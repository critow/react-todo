import { FormEvent, useEffect, useMemo, useRef, useState } from 'react'
import {
  DndContext,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  closestCenter,
} from '@dnd-kit/core'
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

type Todo = {
  id: string
  text: string
  completed: boolean
  createdAt: number
  completedAt?: number
}

const STORAGE_KEY = 'todos'

function loadTodos(): Todo[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as Todo[]
    if (!Array.isArray(parsed)) return []
    return parsed
  } catch {
    return []
  }
}

function saveTodos(todos: Todo[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
}

function App() {
  const [todos, setTodos] = useState<Todo[]>(() => loadTodos())
  const [text, setText] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    saveTodos(todos)
  }, [todos])

  const active = useMemo(() => todos.filter(t => !t.completed), [todos])
  const completed = useMemo(() => todos.filter(t => t.completed), [todos])

  // DnD: dnd-kit (мышь + touch), сортировка в рамках группы
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 100, tolerance: 6 } }),
  )

  const activeIds = useMemo(() => active.map(t => t.id), [active])
  const completedIds = useMemo(() => completed.map(t => t.id), [completed])

  function reorder(group: 'active' | 'completed', fromId: string, toId: string) {
    const groupItems = group === 'active' ? active : completed
    const fromIndex = groupItems.findIndex(t => t.id === fromId)
    const toIndex = groupItems.findIndex(t => t.id === toId)
    if (fromIndex < 0 || toIndex < 0) return
    const newGroup = arrayMove(groupItems, fromIndex, toIndex)

    // Вклеиваем новый порядок группы обратно в общий список
    let gi = 0
    const next = todos.map(t => {
      const inGroup = group === 'active' ? !t.completed : t.completed
      return inGroup ? newGroup[gi++] : t
    })
    setTodos(next)
  }

  function handleDragEnd(e: DragEndEvent) {
    const { active: a, over } = e
    if (!over) return
    const fromId = String(a.id)
    const toId = String(over.id)
    const fromGroup = activeIds.includes(fromId)
      ? 'active'
      : completedIds.includes(fromId)
        ? 'completed'
        : null
    const toGroup = activeIds.includes(toId)
      ? 'active'
      : completedIds.includes(toId)
        ? 'completed'
        : null
    if (!fromGroup || !toGroup) return
    if (fromGroup !== toGroup) {
      // Перетаскивание между группами можно включить позже (автотоггл).
      return
    }
    if (fromId !== toId) reorder(fromGroup, fromId, toId)
  }

  function SortableItem({ todo }: { todo: Todo }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
      id: todo.id,
    })
    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    }
    const base = todo.completed ? 'text-gray-500 line-through' : 'text-gray-900'
    return (
      <li
        ref={setNodeRef}
        style={style}
        className={`flex items-center gap-3 p-3 select-none ${isDragging ? 'bg-indigo-50 shadow-sm' : ''}`}
        {...attributes}
        {...listeners}
      >
        <input
          id={`todo-${todo.id}`}
          type="checkbox"
          checked={todo.completed}
          onChange={() => toggle(todo.id)}
          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
        />
        <label htmlFor={`todo-${todo.id}`} className={`flex-1 text-sm ${base}`}>
          {todo.text}
        </label>
        <button
          onClick={() => remove(todo.id)}
          className="text-gray-400 hover:text-red-600"
          aria-label="Удалить задачу"
          title="Удалить"
        >
          ✕
        </button>
      </li>
    )
  }

  function handleAdd(e: FormEvent) {
    e.preventDefault()
    const value = text.trim()
    if (!value) return
    const newTodo: Todo = {
      id: `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      text: value,
      completed: false,
      createdAt: Date.now(),
    }
    setTodos(prev => [newTodo, ...prev])
    setText('')
    inputRef.current?.focus()
  }

  function toggle(id: string) {
    setTodos(prev =>
      prev.map(t =>
        t.id === id
          ? {
              ...t,
              completed: !t.completed,
              completedAt: !t.completed ? Date.now() : undefined,
            }
          : t,
      ),
    )
  }

  function remove(id: string) {
    setTodos(prev => prev.filter(t => t.id !== id))
  }

  return (
    <div className="min-h-full py-10">
      <div className="mx-auto max-w-xl px-4">
        <h1 className="text-3xl font-bold tracking-tight mb-6">React Todo</h1>

        <form onSubmit={handleAdd} className="flex gap-2 mb-6">
          <input
            ref={inputRef}
            type="text"
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Что нужно сделать?"
            className="flex-1 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
            disabled={!text.trim()}
          >
            Добавить
          </button>
        </form>

        <section aria-labelledby="active-heading" className="mb-8">
          <h2 id="active-heading" className="text-lg font-semibold mb-3">
            Активные задачи
          </h2>
          {active.length === 0 ? (
            <p className="text-sm text-gray-500">Пока пусто — добавьте первую задачу.</p>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext items={activeIds} strategy={verticalListSortingStrategy}>
                <ul className="divide-y divide-gray-200 rounded-md border border-gray-200 bg-white">
                  {active.map(t => (
                    <SortableItem key={t.id} todo={t} />
                  ))}
                </ul>
              </SortableContext>
            </DndContext>
          )}
        </section>

        <section aria-labelledby="done-heading">
          <h2 id="done-heading" className="text-lg font-semibold mb-3">
            Завершённые
          </h2>
          {completed.length === 0 ? (
            <p className="text-sm text-gray-500">Ещё нет завершённых задач.</p>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext items={completedIds} strategy={verticalListSortingStrategy}>
                <ul className="divide-y divide-gray-200 rounded-md border border-gray-200 bg-white">
                  {completed.map(t => (
                    <SortableItem key={t.id} todo={t} />
                  ))}
                </ul>
              </SortableContext>
            </DndContext>
          )}
        </section>
      </div>
    </div>
  )
}

export default App
