import { TodosWidget } from '~/widgets/todos/ui/TodosWidget'

export function HomePage() {
  return (
    <div className="min-h-full py-10">
      <div className="mx-auto max-w-xl px-4">
        <h1 className="text-3xl font-bold tracking-tight mb-6">Список задач</h1>
        <TodosWidget />
      </div>
    </div>
  )
}
