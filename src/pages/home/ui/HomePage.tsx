import { TodosWidget } from '~/widgets/todos/ui/TodosWidget'

export function HomePage() {
  return (
    <div className="min-h-full py-10">
      <div className="mx-auto max-w-xl px-4">
        <h1 className="text-3xl font-bold tracking-tight mb-6">Список задач</h1>
        <TodosWidget />
      </div>
      <div className="fixed bottom-4 right-4 max-w-xs text-xs text-gray-600">
        <div className="rounded-md border border-gray-200 bg-white/95 backdrop-blur px-3 py-2 shadow-sm">
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
    </div>
  )
}
