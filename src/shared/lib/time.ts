export function formatDuration(ms: number): string {
  const s = Math.max(0, Math.floor(ms / 1000))
  const days = Math.floor(s / 86400)
  const hours = Math.floor((s % 86400) / 3600)
  const minutes = Math.floor((s % 3600) / 60)
  const seconds = s % 60

  if (days > 0) return `${days} д ${hours} ч`
  if (hours > 0) return `${hours} ч ${minutes} мин`
  if (minutes > 0) return `${minutes} мин`
  return `${seconds} с`
}

export function formatRelativeToNow(ts: number): string {
  const diff = ts - Date.now()
  const abs = Math.abs(diff)
  const s = Math.max(0, Math.floor(abs / 1000))
  const days = Math.floor(s / 86400)
  const hours = Math.floor((s % 86400) / 3600)
  const minutes = Math.floor((s % 3600) / 60)

  let unit = ''
  let value = 0
  if (days > 0) {
    unit = days === 1 ? 'день' : 'дн'
    value = days
  } else if (hours > 0) {
    unit = 'ч'
    value = hours
  } else {
    unit = 'мин'
    value = Math.max(1, minutes)
  }

  if (diff >= 0) return `через ${value} ${unit}`
  return `просрочено на ${value} ${unit}`
}
