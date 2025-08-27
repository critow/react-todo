import { FormEvent, useState } from 'react'

type Props = {
  onAdd: (text: string) => void
}

export function AddTodoForm({ onAdd }: Props) {
  const [text, setText] = useState('')

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!text.trim()) return
    onAdd(text)
    setText('')
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
      <input
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
  )
}
