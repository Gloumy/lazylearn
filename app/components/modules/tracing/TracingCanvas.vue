<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    letter: string
    strokeColor?: string
    strokeWidth?: number
  }>(),
  {
    strokeColor: '#FECA57',
    strokeWidth: 14,
  },
)

const canvasEl = ref<HTMLCanvasElement | null>(null)
let ctx: CanvasRenderingContext2D | null = null
let drawing = false
let lastX = 0
let lastY = 0

function setupCanvas() {
  const canvas = canvasEl.value
  if (!canvas) return
  const rect = canvas.getBoundingClientRect()
  if (rect.width === 0 || rect.height === 0) return
  const dpr = window.devicePixelRatio || 1
  canvas.width = Math.round(rect.width * dpr)
  canvas.height = Math.round(rect.height * dpr)
  const c = canvas.getContext('2d')
  if (!c) return
  c.scale(dpr, dpr)
  c.lineCap = 'round'
  c.lineJoin = 'round'
  c.lineWidth = props.strokeWidth
  c.strokeStyle = props.strokeColor
  c.fillStyle = props.strokeColor
  ctx = c
}

function clear() {
  const canvas = canvasEl.value
  if (!canvas || !ctx) return
  ctx.save()
  ctx.setTransform(1, 0, 0, 1, 0, 0)
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.restore()
}

function coords(e: PointerEvent) {
  const rect = canvasEl.value!.getBoundingClientRect()
  return { x: e.clientX - rect.left, y: e.clientY - rect.top }
}

function onPointerDown(e: PointerEvent) {
  if (!ctx) return
  drawing = true
  const { x, y } = coords(e)
  lastX = x
  lastY = y
  ctx.beginPath()
  ctx.arc(x, y, props.strokeWidth / 2, 0, Math.PI * 2)
  ctx.fill()
  canvasEl.value?.setPointerCapture?.(e.pointerId)
  e.preventDefault()
}

function onPointerMove(e: PointerEvent) {
  if (!drawing || !ctx) return
  const { x, y } = coords(e)
  ctx.beginPath()
  ctx.moveTo(lastX, lastY)
  ctx.lineTo(x, y)
  ctx.stroke()
  lastX = x
  lastY = y
  e.preventDefault()
}

function onPointerUp(e: PointerEvent) {
  drawing = false
  canvasEl.value?.releasePointerCapture?.(e.pointerId)
}

let observer: ResizeObserver | null = null

onMounted(() => {
  setupCanvas()
  if (canvasEl.value && 'ResizeObserver' in window) {
    observer = new ResizeObserver(() => setupCanvas())
    observer.observe(canvasEl.value)
  }
})

onBeforeUnmount(() => {
  observer?.disconnect()
})

watch(() => props.letter, () => clear())

defineExpose({ clear })
</script>

<template>
  <div class="tracing-canvas">
    <svg
      class="tracing-canvas__watermark"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
    >
      <text x="50" y="56" text-anchor="middle" dominant-baseline="middle">
        {{ letter }}
      </text>
    </svg>
    <canvas
      ref="canvasEl"
      class="tracing-canvas__canvas"
      @pointerdown="onPointerDown"
      @pointermove="onPointerMove"
      @pointerup="onPointerUp"
      @pointercancel="onPointerUp"
    />
  </div>
</template>

<style lang="scss" scoped>
@use '~/assets/styles/variables' as *;

.tracing-canvas {
  position: relative;
  width: 100%;
  aspect-ratio: 1 / 1;
  max-width: 480px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: $radius-card;
  overflow: hidden;
}

.tracing-canvas__watermark {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;

  text {
    font-family: $font-title;
    font-weight: 800;
    font-size: 70px;
    fill: rgba(255, 255, 255, 0.15);
  }
}

.tracing-canvas__canvas {
  position: relative;
  width: 100%;
  height: 100%;
  display: block;
  touch-action: none;
  cursor: crosshair;
}
</style>
