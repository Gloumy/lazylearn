import type { Ref } from 'vue'

interface DragState<T> {
  data: T
  offsetX: number
  offsetY: number
  width: number
  height: number
}

export function useDragDrop<T>(opts: {
  onDrop: (data: T, targetId: string | null) => void
}) {
  const dragged = ref(null) as Ref<DragState<T> | null>
  const pointer = ref({ x: 0, y: 0 })
  const hoverTargetId = ref<string | null>(null)

  function resolveTarget(x: number, y: number): string | null {
    const el = document.elementFromPoint(x, y) as HTMLElement | null
    return el?.closest<HTMLElement>('[data-drop-id]')?.dataset.dropId ?? null
  }

  function onMove(e: PointerEvent) {
    if (!dragged.value) return
    pointer.value = { x: e.clientX, y: e.clientY }
    hoverTargetId.value = resolveTarget(e.clientX, e.clientY)
    e.preventDefault()
  }

  function onUp(e: PointerEvent) {
    if (!dragged.value) return
    const targetId = resolveTarget(e.clientX, e.clientY)
    const data = dragged.value.data
    cleanup()
    opts.onDrop(data, targetId)
  }

  function cleanup() {
    dragged.value = null
    hoverTargetId.value = null
    window.removeEventListener('pointermove', onMove)
    window.removeEventListener('pointerup', onUp)
    window.removeEventListener('pointercancel', onUp)
  }

  function startDrag(data: T, event: PointerEvent) {
    if (event.button !== undefined && event.button !== 0 && event.pointerType === 'mouse') return
    const el = event.currentTarget as HTMLElement
    const rect = el.getBoundingClientRect()
    dragged.value = {
      data,
      offsetX: event.clientX - rect.left,
      offsetY: event.clientY - rect.top,
      width: rect.width,
      height: rect.height,
    }
    pointer.value = { x: event.clientX, y: event.clientY }
    window.addEventListener('pointermove', onMove, { passive: false })
    window.addEventListener('pointerup', onUp)
    window.addEventListener('pointercancel', onUp)
    event.preventDefault()
  }

  onBeforeUnmount(cleanup)

  return { dragged, pointer, hoverTargetId, startDrag }
}
