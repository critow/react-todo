import {
  DndContext,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useRef } from 'react'
import { CSS } from '@dnd-kit/utilities'
import type { Todo } from '~/entities/todo/model/types'
import { TodoItem, type TodoItemHandle } from '~/features/todo-item/ui/TodoItem'

type Props = {
  items: Todo[]
  group: 'active' | 'completed'
  onToggle: (id: string) => void
  onRemove: (id: string) => void
  onEdit: (id: string, text: string) => void
  onReorder: (group: 'active' | 'completed', fromId: string, toId: string) => void
}

function SortableTodo({
  todo,
  onToggle,
  onRemove,
  onEdit,
}: {
  todo: Todo
  onToggle: (id: string) => void
  onRemove: (id: string) => void
  onEdit: (id: string, text: string) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: todo.id,
  })
  const style = { transform: CSS.Transform.toString(transform), transition }
  const itemRef = useRef<TodoItemHandle>(null)

  function handleKeyDown(e: React.KeyboardEvent<HTMLLIElement>) {
    if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') return
    const activeEl = document.activeElement as HTMLElement | null
    if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA')) return
    e.preventDefault()
    const current = e.currentTarget as HTMLElement
    const next =
      e.key === 'ArrowDown'
        ? (current.nextElementSibling as HTMLElement | null)
        : (current.previousElementSibling as HTMLElement | null)
    next?.focus()
  }
  function handleEnter(e: React.KeyboardEvent<HTMLLIElement>) {
    if (e.key !== 'Enter') return
    const activeEl = document.activeElement as HTMLElement | null
    if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA')) return
    if (e.metaKey || e.ctrlKey) {
      e.preventDefault()
      itemRef.current?.startEdit()
    } else {
      e.preventDefault()
      onToggle(todo.id)
    }
  }
  return (
    <li
      ref={setNodeRef}
      style={style}
      className={`bg-white outline-none focus:ring-2 focus:ring-indigo-500 ${isDragging ? 'bg-indigo-50 shadow-sm' : ''}`}
      tabIndex={0}
      onKeyDown={e => {
        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') handleKeyDown(e)
        else if (e.key === 'Enter') handleEnter(e)
      }}
    >
      <TodoItem
        ref={itemRef}
        todo={todo}
        onToggle={onToggle}
        onRemove={onRemove}
        onEdit={onEdit}
        dragHandle={
          <button
            type="button"
            aria-label="Переместить задачу"
            title="Переместить"
            className="mr-1 cursor-grab touch-none select-none text-gray-300 hover:text-gray-500"
            {...attributes}
            {...listeners}
          >
            ⋮⋮
          </button>
        }
      />
    </li>
  )
}

export function SortableList({ items, group, onToggle, onRemove, onEdit, onReorder }: Props) {
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 100, tolerance: 6 } }),
  )
  const ids = items.map(t => t.id)

  function handleDragEnd(e: DragEndEvent) {
    const { active, over } = e
    if (!over) return
    const fromId = String(active.id)
    const toId = String(over.id)
    if (fromId === toId) return
    onReorder(group, fromId, toId)
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={ids} strategy={verticalListSortingStrategy}>
        <ul className="divide-y divide-gray-200 rounded-md border border-gray-200 bg-white">
          {items.map(t => (
            <SortableTodo
              key={t.id}
              todo={t}
              onToggle={onToggle}
              onRemove={onRemove}
              onEdit={onEdit}
            />
          ))}
        </ul>
      </SortableContext>
    </DndContext>
  )
}
