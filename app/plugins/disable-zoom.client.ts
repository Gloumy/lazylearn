// Bloque le pinch-zoom sur iOS Safari (qui ignore meta viewport user-scalable=no)
// et le double-tap-zoom universel.
export default defineNuxtPlugin(() => {
  const prevent = (event: Event) => event.preventDefault()

  document.addEventListener('gesturestart', prevent)
  document.addEventListener('gesturechange', prevent)
  document.addEventListener('gestureend', prevent)

  const blockMultiTouch = (event: TouchEvent) => {
    if (event.touches.length > 1) event.preventDefault()
  }
  document.addEventListener('touchstart', blockMultiTouch, { passive: false })
  document.addEventListener('touchmove', blockMultiTouch, { passive: false })

  let lastTouchEnd = 0
  document.addEventListener(
    'touchend',
    (event) => {
      const now = Date.now()
      if (now - lastTouchEnd <= 350) event.preventDefault()
      lastTouchEnd = now
    },
    { passive: false },
  )

  document.addEventListener(
    'wheel',
    (event) => {
      if (event.ctrlKey) event.preventDefault()
    },
    { passive: false },
  )
})
