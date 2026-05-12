<script setup lang="ts">
import { type NumberRange, rangeValues } from '~/data/numbers'

const props = defineProps<{ range: NumberRange }>()
const emit = defineEmits<{
  (e: 'progress', value: number): void
  (e: 'complete'): void
}>()

const TILE_COLORS = [
  '#FF6B6B', '#FF9F43', '#FECA57', '#26de81', '#45aaf2',
  '#a55eea', '#2bcbba', '#FC427B', '#5C6BC0', '#8BC34A',
]

function shuffled<T>(arr: T[]): T[] {
  const out = [...arr]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[out[i], out[j]] = [out[j]!, out[i]!]
  }
  return out
}

interface Cell {
  value: number
  color: string
}

const cells = ref<Cell[]>([])
const next = ref(0)
const shakingValue = ref<number | null>(null)
const locked = ref(false)

function setup(r: NumberRange) {
  const values = rangeValues(r)
  const colors = shuffled(TILE_COLORS).slice(0, values.length)
  const shuffledValues = shuffled(values)
  cells.value = shuffledValues.map((v, i) => ({ value: v, color: colors[i]! }))
  next.value = r.start
  shakingValue.value = null
  locked.value = false
}

watch(() => props.range, r => setup(r), { immediate: true })

function pick(value: number) {
  if (locked.value) return
  if (value === next.value) {
    emit('progress', value)
    next.value += 1
    if (next.value > props.range.end) {
      locked.value = true
      emit('complete')
    }
  } else {
    shakingValue.value = value
    setTimeout(() => {
      if (shakingValue.value === value) shakingValue.value = null
    }, 450)
  }
}

const done = computed(() => {
  const doneSet = new Set<number>()
  for (let v = props.range.start; v < next.value; v++) doneSet.add(v)
  return doneSet
})
</script>

<template>
  <div class="number-grid">
    <div class="number-grid__prompt">
      Clique sur <strong>{{ next <= range.end ? next : range.end }}</strong>
    </div>

    <div class="number-grid__cells">
      <NumberCell
        v-for="c in cells"
        :key="c.value"
        :value="c.value"
        :color="c.color"
        :done="done.has(c.value)"
        :shaking="shakingValue === c.value"
        :disabled="locked"
        @pick="pick(c.value)"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '~/assets/styles/variables' as *;

.number-grid {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 28px;
  width: 100%;

  @media (max-width: 480px) {
    gap: 16px;
  }
}

.number-grid__prompt {
  font-family: $font-title;
  font-size: 1.6rem;
  color: white;
  opacity: 0.9;

  strong {
    font-size: 2.2rem;
    margin-left: 8px;
  }

  @media (max-width: 480px) {
    font-size: 1.2rem;
    strong { font-size: 1.8rem; }
  }
}

.number-grid__cells {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 14px;
  width: 100%;
  max-width: 620px;

  @media (max-width: 480px) {
    gap: 8px;
    grid-template-columns: repeat(5, minmax(0, 1fr));
  }
}
</style>
