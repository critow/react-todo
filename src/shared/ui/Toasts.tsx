// no React import needed with react-jsx transform

export type Toast = { id: string; text: string }

export function Toasts({ toasts, onClose }: { toasts: Toast[]; onClose: (id: string) => void }) {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map(t => (
        <div
          key={t.id}
          className="max-w-xs rounded-md border border-yellow-200 bg-yellow-50 px-3 py-2 text-sm text-yellow-900 shadow transition"
        >
          <div className="flex items-start gap-2">
            <span>⏰</span>
            <div className="flex-1">{t.text}</div>
            <button
              className="text-yellow-700/70 hover:text-yellow-900"
              aria-label="Закрыть уведомление"
              onClick={() => onClose(t.id)}
            >
              ×
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
