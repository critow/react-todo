import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import type { Todo } from '~/entities/todo/model/types'

type Props = {
  todo: Todo
  onToggle: (id: string) => void
  onRemove: (id: string) => void
  dragHandle?: ReactNode
  onEdit?: (id: string, text: string) => void
}

export type TodoItemHandle = {
  startEdit: () => void
}

export const TodoItem = forwardRef<TodoItemHandle, Props>(function TodoItem(
  { todo, onToggle, onRemove, dragHandle, onEdit }: Props,
  ref,
) {
  const base = todo.completed ? 'text-gray-500 line-through' : 'text-gray-900'
  const [isEditing, setIsEditing] = useState(false)
  const [value, setValue] = useState(todo.text)
  const inputRef = useRef<HTMLInputElement>(null)

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
        <span
          role="button"
          tabIndex={-1}
          onClick={() => setIsEditing(true)}
          className={`flex-1 text-sm cursor-text ${base}`}
          title="Нажмите, чтобы редактировать"
        >
          {todo.text}
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
