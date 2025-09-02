import { useEffect, useState } from 'react'
import { TodosWidget } from '~/widgets/todos/ui/TodosWidget'

export function HomePage() {
  const [showHotkeys, setShowHotkeys] = useState(true)
  const [hintReady, setHintReady] = useState(false)

  useEffect(() => {
    try {
      const v = localStorage.getItem('hotkeys_hint_hidden')
      if (v === '1') setShowHotkeys(false)
    } catch {
      /* ignore */
    }
  }, [])

  // Animate in when shown
  useEffect(() => {
    if (showHotkeys) {
      // next frame to allow transition
      const id = requestAnimationFrame(() => setHintReady(true))
      return () => cancelAnimationFrame(id)
    } else {
      setHintReady(false)
    }
  }, [showHotkeys])

  function hideHotkeys() {
    setShowHotkeys(false)
    try {
      localStorage.setItem('hotkeys_hint_hidden', '1')
    } catch {
      /* ignore */
    }
  }

  function restoreHotkeys() {
    setShowHotkeys(true)
    try {
      localStorage.removeItem('hotkeys_hint_hidden')
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="min-h-full py-10">
      <div className="mx-auto max-w-xl px-4">
        <h1 className="text-3xl font-bold tracking-tight mb-6">Список задач</h1>
        <TodosWidget />
      </div>
      {showHotkeys && (
        <div className="fixed bottom-4 right-4 max-w-xs text-xs text-gray-600">
          <div
            className={
              `relative rounded-md border border-gray-200 bg-white/95 backdrop-blur px-3 py-2 shadow-sm ` +
              `transition duration-200 ease-out transform ` +
              (hintReady
                ? 'opacity-100 translate-y-0 scale-100'
                : 'opacity-0 translate-y-2 scale-95')
            }
          >
            <div className="absolute -top-2 -right-2 group">
              <button
                type="button"
                onClick={hideHotkeys}
                className="h-6 w-6 rounded-full bg-white border border-gray-200 shadow text-gray-500 hover:text-gray-800"
                aria-label="Скрыть подсказку"
                title="Скрыть подсказку"
              >
                ×
              </button>
              <div className="pointer-events-none absolute right-full mr-2 top-1/2 -translate-y-1/2 whitespace-nowrap rounded bg-gray-800 px-2 py-1 text-white text-[11px] opacity-0 transition group-hover:opacity-100">
                Скрыть подсказку
              </div>
            </div>
            <div className="font-medium text-gray-800 mb-1">Горячие клавиши</div>
            <ul className="space-y-0.5">
              <li>
                <span className="font-semibold">↑/↓</span>: перемещение по задачам
              </li>
              <li>
                <span className="font-semibold">Enter</span>: отметить/снять выполнено
              </li>
              <li>
                <span className="font-semibold">Cmd+Enter</span> /{' '}
                <span className="font-semibold">Ctrl+Enter</span>: редактировать
              </li>
              <li>Клик по тексту: редактировать</li>
              <li>
                Перетаскивание за <span className="font-mono">⋮⋮</span>: изменить порядок
              </li>
            </ul>
          </div>
        </div>
      )}
      {!showHotkeys && (
        <div className="fixed bottom-4 right-4 group">
          <button
            type="button"
            onClick={restoreHotkeys}
            className={
              `h-9 w-9 rounded-full border border-gray-200 ` +
              `bg-white/95 backdrop-blur text-gray-700 shadow hover:text-gray-900 ` +
              `transition transform duration-200 opacity-100 translate-y-0`
            }
            aria-label="Показать подсказку по горячим клавишам"
            title="Показать подсказку по горячим клавишам"
          >
            ?
          </button>
          <div className="pointer-events-none absolute bottom-full right-0 mb-2 whitespace-nowrap rounded bg-gray-800 px-2 py-1 text-white text-[11px] opacity-0 transition group-hover:opacity-100">
            Показать подсказку
          </div>
        </div>
      )}
    </div>
  )
}
