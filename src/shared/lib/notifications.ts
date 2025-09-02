declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext
  }
}

export function triggerBeep() {
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext
    if (!Ctx) return
    const ctx = new Ctx()
    const o = ctx.createOscillator()
    const g = ctx.createGain()
    o.type = 'sine'
    o.frequency.value = 880
    o.connect(g)
    g.connect(ctx.destination)
    g.gain.setValueAtTime(0.0001, ctx.currentTime)
    g.gain.exponentialRampToValueAtTime(0.1, ctx.currentTime + 0.01)
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.2)
    o.start()
    o.stop(ctx.currentTime + 0.21)
    setTimeout(() => ctx.close(), 300)
  } catch {
    /* ignore */
  }
}

export function triggerVibrate() {
  try {
    if ('vibrate' in navigator) navigator.vibrate(200)
  } catch {
    /* ignore */
  }
}
