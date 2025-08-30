import { AddTodoForm } from '~/features/add-todo/ui/AddTodoForm'
import { SortableList } from '~/features/reorder-todos/ui/SortableList'
import { useTodos } from '~/entities/todo/model/useTodos'

export function TodosWidget() {
  const { active, completed, add, toggle, remove, edit, reorderInGroup } = useTodos()

  return (
    <div>
      <AddTodoForm onAdd={add} />

      <section aria-labelledby="active-heading" className="mb-8">
        <h2 id="active-heading" className="text-lg font-semibold mb-3">
          Активные задачи
        </h2>
        {active.length === 0 ? (
          <p className="text-sm text-gray-500">Пока пусто — добавьте первую задачу.</p>
        ) : (
          <SortableList
            items={active}
            group="active"
            onToggle={toggle}
            onRemove={remove}
            onEdit={edit}
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
            onReorder={reorderInGroup}
          />
        )}
      </section>
    </div>
  )
}
