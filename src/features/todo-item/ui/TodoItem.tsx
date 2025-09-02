import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import type { Todo } from '~/entities/todo/model/types'
import { formatDuration } from '~/shared/lib/time'

type Props = {
  todo: Todo
  onToggle: (id: string) => void
  onRemove: (id: string) => void
  dragHandle?: ReactNode
  onEdit?: (id: string, text: string) => void
  onSetDue?: (id: string, dueAt: number | undefined) => void
}

export type TodoItemHandle = {
  startEdit: () => void
}

export const TodoItem = forwardRef<TodoItemHandle, Props>(function TodoItem(
  { todo, onToggle, onRemove, dragHandle, onEdit, onSetDue }: Props,
  ref,
) {
  const base = todo.completed ? 'text-gray-500 line-through' : 'text-gray-900'
  const [isEditing, setIsEditing] = useState(false)
  const [value, setValue] = useState(todo.text)
  const inputRef = useRef<HTMLInputElement>(null)
  const [dueOpen, setDueOpen] = useState(false)

  useImperativeHandle(ref, () => ({ startEdit: () => setIsEditing(true) }), [])

  useEffect(() => {
    if (isEditing) {
      setValue(todo.text)
      inputRef.current?.focus()
      inputRef.current?.select()
    }
  }, [isEditing, todo.text])

  function commitEdit() {
    const v = value.trim()
    if (!v) {
      setIsEditing(false)
      setValue(todo.text)
      return
    }
    if (v !== todo.text) onEdit?.(todo.id, v)
    setIsEditing(false)
  }

  function cancelEdit() {
    setIsEditing(false)
    setValue(todo.text)
  }

  function formatInputValue(ts?: number) {
    if (!ts) return ''
    const d = new Date(ts)
    const pad = (n: number) => String(n).padStart(2, '0')
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(
      d.getMinutes(),
    )}`
  }

  function parseInputValue(v: string): number | undefined {
    if (!v) return undefined
    const t = Date.parse(v)
    return Number.isNaN(t) ? undefined : t
  }

  return (
    <div className="flex items-center gap-3 p-3 select-none">
      {dragHandle}
      <input
        id={`todo-${todo.id}`}
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
      />
      {isEditing ? (
        <input
          ref={inputRef}
          className="flex-1 text-sm rounded border border-gray-300 px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={value}
          onChange={e => setValue(e.target.value)}
          onBlur={commitEdit}
          onKeyDown={e => {
            if (e.key === 'Enter') commitEdit()
            else if (e.key === 'Escape') cancelEdit()
          }}
          aria-label="Редактировать текст задачи"
        />
      ) : (
        <span className="flex-1 flex items-center gap-2">
          <span
            role="button"
            tabIndex={-1}
            onClick={() => setIsEditing(true)}
            className={`flex-1 text-sm cursor-text ${base}`}
            title="Нажмите, чтобы редактировать"
          >
            {todo.text}
          </span>
          {todo.completed && todo.completedAt && (
            <span className="text-[11px] text-gray-400 whitespace-nowrap" title="Время выполнения">
              ⏱ за {formatDuration(todo.completedAt - todo.createdAt)}
            </span>
          )}
          {onSetDue && (
            <span className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setDueOpen(v => !v)}
                className={`text-[11px] rounded px-1 py-0.5 border ${
                  todo.dueAt && !todo.completed && todo.dueAt < Date.now()
                    ? 'border-red-300 text-red-600'
                    : 'border-gray-200 text-gray-500 hover:text-gray-700'
                }`}
                title="Установить дедлайн"
                aria-label="Установить дедлайн"
              >
                {todo.dueAt ? new Date(todo.dueAt).toLocaleString() : 'Дедлайн'}
              </button>
              {dueOpen && (
                <input
                  type="datetime-local"
                  className="text-[11px] border border-gray-300 rounded px-1 py-0.5"
                  value={formatInputValue(todo.dueAt)}
                  onChange={e => onSetDue(todo.id, parseInputValue(e.target.value))}
                  onBlur={() => setDueOpen(false)}
                  autoFocus
                />
              )}
            </span>
          )}
        </span>
      )}
      <button
        onClick={() => onRemove(todo.id)}
        className="text-gray-400 hover:text-red-600"
        aria-label="Удалить задачу"
        title="Удалить"
      >
        ✕
      </button>
    </div>
  )
})
