import type { Todo } from '../model/types'

const STORAGE_KEY = 'todos'

export function loadTodos(): Todo[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (isTodosArray(parsed)) return parsed
    return []
  } catch {
    return []
  }
}

export function saveTodos(todos: Todo[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
}

function isTodosArray(value: unknown): value is Todo[] {
  if (!Array.isArray(value)) return false
  return value.every(v => {
    if (!isRecord(v)) return false
    return (
      typeof v.id === 'string' &&
      typeof v.text === 'string' &&
      typeof v.completed === 'boolean' &&
      typeof v.createdAt === 'number'
    )
  })
}

function isRecord(x: unknown): x is Record<string, unknown> {
  return typeof x === 'object' && x !== null
}
