import { useCallback, useEffect, useMemo, useState } from 'react'
import { AddTodoForm } from '~/features/add-todo'
import { SortableList } from '~/features/reorder-todos'
import { useTodos } from '~/entities/todo'
import { Toasts } from '~/shared/ui/Toasts'
import { triggerBeep, triggerVibrate } from '~/shared/lib/notifications'

type Filter = 'all' | 'overdue' | 'today' | 'week'
type Toast = { id: string; text: string }

export function TodosWidget() {
  const { active, completed, add, toggle, remove, edit, setDue, markDueNotified, reorderInGroup } =
    useTodos()
  const [filter, setFilter] = useState<Filter>('all')
  const [now, setNow] = useState(() => Date.now())
  const [toasts, setToasts] = useState<Toast[]>([])
  const [notifyEnabled, setNotifyEnabled] = useState(true)
  const [notifySound, setNotifySound] = useState(false)
  const [notifyVibrate, setNotifyVibrate] = useState(false)
  const filterOptions: Array<[Filter, string]> = [
    ['all', 'Все'],
    ['overdue', 'Просроченные'],
    ['today', 'Сегодня'],
    ['week', 'Неделя'],
  ]

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 60_000)
    return () => clearInterval(id)
  }, [])

  // load notification settings
  useEffect(() => {
    try {
      const e = localStorage.getItem('notify_enabled')
      const s = localStorage.getItem('notify_sound')
      const v = localStorage.getItem('notify_vibrate')
      if (e != null) setNotifyEnabled(e === '1')
      if (s != null) setNotifySound(s === '1')
      if (v != null) setNotifyVibrate(v === '1')
    } catch {
      /* ignore */
    }
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem('notify_enabled', notifyEnabled ? '1' : '0')
      localStorage.setItem('notify_sound', notifySound ? '1' : '0')
      localStorage.setItem('notify_vibrate', notifyVibrate ? '1' : '0')
    } catch {
      /* ignore */
    }
  }, [notifyEnabled, notifySound, notifyVibrate])

  function isOverdue(ts?: number) {
    return typeof ts === 'number' && ts < now
  }

  const activePartitioned = useMemo(() => {
    const overdue: typeof active = []
    const rest: typeof active = []
    for (const t of active) {
      if (!t.completed && isOverdue(t.dueAt)) overdue.push(t)
      else rest.push(t)
    }
    return [...overdue, ...rest]
  }, [active, now])

  const activeFiltered = useMemo(() => {
    if (filter === 'all') return activePartitioned
    const start = new Date(now)
    start.setHours(0, 0, 0, 0)
    const endToday = new Date(start)
    endToday.setDate(start.getDate() + 1)
    const endWeek = new Date(start)
    endWeek.setDate(start.getDate() + 7)
    return activePartitioned.filter(t => {
      if (!t.dueAt) return false
      const d = t.dueAt
      if (filter === 'overdue') return d < now
      if (filter === 'today') return d >= start.getTime() && d < endToday.getTime()
      if (filter === 'week') return d >= start.getTime() && d < endWeek.getTime()
      return true
    })
  }, [activePartitioned, filter, now])

  // Notify when due time passes for a task (one-time per task)
  useEffect(() => {
    if (!notifyEnabled) return
    const newlyDue = active.filter(
      t => t.dueAt && t.dueAt <= now && !t.completed && !t.dueNotifiedAt,
    )
    if (newlyDue.length === 0) return
    newlyDue.forEach(t => {
      setToasts(prev => [...prev, { id: `${t.id}:${now}`, text: `Время задачи: "${t.text}"` }])
      if (notifySound) triggerBeep()
      if (notifyVibrate) triggerVibrate()
      markDueNotified(t.id)
    })
  }, [now, active, markDueNotified, notifyEnabled, notifySound, notifyVibrate])

  // On load, if there are already overdue tasks, show one summary toast and mark them notified
  useEffect(() => {
    if (!notifyEnabled) return
    const overdue = active.filter(
      t => t.dueAt && t.dueAt <= Date.now() && !t.completed && !t.dueNotifiedAt,
    )
    if (overdue.length > 0) {
      const id = `overdue-summary:${Date.now()}`
      setToasts(prev => [...prev, { id, text: `Есть ${overdue.length} просроченных задач(и)` }])
      if (notifySound) triggerBeep()
      if (notifyVibrate) triggerVibrate()
      overdue.forEach(t => markDueNotified(t.id))
    }
    // run once on mount
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  useEffect(() => {
    if (toasts.length === 0) return
    const timers = toasts.map(t => setTimeout(() => removeToast(t.id), 8000))
    return () => timers.forEach(clearTimeout)
  }, [toasts])

  // звук/вибрация вынесены в shared/lib/notifications

  return (
    <div>
      <AddTodoForm onAdd={add} />

      <section aria-labelledby="active-heading" className="mb-8">
        <h2 id="active-heading" className="text-lg font-semibold mb-3">
          Активные задачи
        </h2>
        <div className="mb-3 flex items-center gap-3 text-xs flex-wrap">
          <span className="text-gray-500">Фильтр:</span>
          {filterOptions.map(([key, label]) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={
                `rounded border px-2 py-1 ` +
                (filter === key
                  ? 'border-indigo-300 bg-indigo-50 text-indigo-700'
                  : 'border-gray-200 text-gray-600 hover:text-gray-800')
              }
            >
              {label}
            </button>
          ))}
          <span className="w-px h-4 bg-gray-200" />
          <label className="inline-flex items-center gap-1 cursor-pointer select-none">
            <input
              type="checkbox"
              className="h-3 w-3"
              checked={notifyEnabled}
              onChange={e => setNotifyEnabled(e.target.checked)}
            />
            Уведомления
          </label>
          <label className="inline-flex items-center gap-1 cursor-pointer select-none text-gray-600">
            <input
              type="checkbox"
              className="h-3 w-3"
              checked={notifySound}
              onChange={e => setNotifySound(e.target.checked)}
              disabled={!notifyEnabled}
            />
            Звук
          </label>
          <label className="inline-flex items-center gap-1 cursor-pointer select-none text-gray-600">
            <input
              type="checkbox"
              className="h-3 w-3"
              checked={notifyVibrate}
              onChange={e => setNotifyVibrate(e.target.checked)}
              disabled={!notifyEnabled}
            />
            Вибрация
          </label>
        </div>
        {(filter === 'all' ? activePartitioned : activeFiltered).length === 0 ? (
          <p className="text-sm text-gray-500">Пока пусто — добавьте первую задачу.</p>
        ) : (
          <SortableList
            items={filter === 'all' ? activePartitioned : activeFiltered}
            group="active"
            onToggle={toggle}
            onRemove={remove}
            onEdit={edit}
            onSetDue={setDue}
            onReorder={reorderInGroup}
          />
        )}
      </section>

      <section aria-labelledby="done-heading">
        <h2 id="done-heading" className="text-lg font-semibold mb-3">
          Завершённые
        </h2>
        {completed.length === 0 ? (
          <p className="text-sm text-gray-500">Ещё нет завершённых задач.</p>
        ) : (
          <SortableList
            items={completed}
            group="completed"
            onToggle={toggle}
            onRemove={remove}
            onEdit={edit}
            onSetDue={setDue}
            onReorder={reorderInGroup}
          />
        )}
      </section>

      <Toasts toasts={toasts} onClose={removeToast} />
    </div>
  )
}
