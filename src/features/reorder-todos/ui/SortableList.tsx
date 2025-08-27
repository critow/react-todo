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
import { CSS } from '@dnd-kit/utilities'
import type { Todo } from '../../../entities/todo/model/types'
import { TodoItem } from '../../todo-item/ui/TodoItem'

type Props = {
  items: Todo[]
  group: 'active' | 'completed'
  onToggle: (id: string) => void
  onRemove: (id: string) => void
  onReorder: (group: 'active' | 'completed', fromId: string, toId: string) => void
}

function SortableTodo({
  todo,
  onToggle,
  onRemove,
}: {
  todo: Todo
  onToggle: (id: string) => void
  onRemove: (id: string) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: todo.id,
  })
  const style = { transform: CSS.Transform.toString(transform), transition }
  return (
    <li
      ref={setNodeRef}
      style={style}
      className={`bg-white ${isDragging ? 'bg-indigo-50 shadow-sm' : ''}`}
      {...attributes}
      {...listeners}
    >
      <TodoItem todo={todo} onToggle={onToggle} onRemove={onRemove} />
    </li>
  )
}

export function SortableList({ items, group, onToggle, onRemove, onReorder }: Props) {
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
            <SortableTodo key={t.id} todo={t} onToggle={onToggle} onRemove={onRemove} />
          ))}
        </ul>
      </SortableContext>
    </DndContext>
  )
}
