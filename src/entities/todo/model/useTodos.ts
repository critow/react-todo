import { useEffect, useMemo, useRef, useState } from 'react'
import type { Todo } from '~/entities/todo/model/types'
import { loadTodos, saveTodos } from '~/entities/todo/lib/storage'

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>(() => loadTodos())
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    saveTodos(todos)
  }, [todos])

  const active = useMemo(() => todos.filter(t => !t.completed), [todos])
  const completed = useMemo(() => todos.filter(t => t.completed), [todos])

  function add(text: string) {
    const value = text.trim()
    if (!value) return
    const newTodo: Todo = {
      id: `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      text: value,
      completed: false,
      createdAt: Date.now(),
    }
    setTodos(prev => [newTodo, ...prev])
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

  function edit(id: string, text: string) {
    const value = text.trim()
    if (!value) return
    setTodos(prev => prev.map(t => (t.id === id ? { ...t, text: value } : t)))
  }

  function setDue(id: string, dueAt: number | undefined) {
    setTodos(prev => prev.map(t => (t.id === id ? { ...t, dueAt } : t)))
  }

  function reorderInGroup(group: 'active' | 'completed', fromId: string, toId: string) {
    const groupItems = group === 'active' ? active : completed
    const fromIndex = groupItems.findIndex(t => t.id === fromId)
    const toIndex = groupItems.findIndex(t => t.id === toId)
    if (fromIndex < 0 || toIndex < 0) return
    const copy = groupItems.slice()
    const [moved] = copy.splice(fromIndex, 1)
    copy.splice(toIndex, 0, moved)
    // Сборка общего списка, встраиваем группу в новом порядке
    let gi = 0
    setTodos(prev =>
      prev.map(t => {
        const inGroup = group === 'active' ? !t.completed : t.completed
        return inGroup ? copy[gi++] : t
      }),
    )
  }

  return {
    todos,
    active,
    completed,
    inputRef,
    add,
    toggle,
    remove,
    edit,
    setDue,
    reorderInGroup,
  }
}
