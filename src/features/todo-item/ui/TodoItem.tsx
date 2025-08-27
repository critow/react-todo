import type { Todo } from '../../../entities/todo/model/types'

type Props = {
  todo: Todo
  onToggle: (id: string) => void
  onRemove: (id: string) => void
}

export function TodoItem({ todo, onToggle, onRemove }: Props) {
  const base = todo.completed ? 'text-gray-500 line-through' : 'text-gray-900'
  return (
    <li className="flex items-center gap-3 p-3 select-none">
      <input
        id={`todo-${todo.id}`}
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
      />
      <label htmlFor={`todo-${todo.id}`} className={`flex-1 text-sm ${base}`}>
        {todo.text}
      </label>
      <button
        onClick={() => onRemove(todo.id)}
        className="text-gray-400 hover:text-red-600"
        aria-label="Удалить задачу"
        title="Удалить"
      >
        ✕
      </button>
    </li>
  )
}
