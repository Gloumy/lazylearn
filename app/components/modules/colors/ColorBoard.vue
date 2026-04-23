<script setup lang="ts">
import type { ColorEntry } from '~/data/colors'

const props = defineProps<{ entry: ColorEntry; pool: ColorEntry[] }>()
const emit = defineEmits<{ (e: 'complete'): void }>()

interface Choice {
  name: string
}

function shuffled<T>(arr: T[]): T[] {
  const out = [...arr]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[out[i], out[j]] = [out[j]!, out[i]!]
  }
  return out
}

const TILE_BG = '#37474F'

const choices = ref<Choice[]>([])
const shakingName = ref<string | null>(null)
const locked = ref(false)

function setup(entry: ColorEntry, pool: ColorEntry[]) {
  const distractors = shuffled(pool.filter(c => c.name !== entry.name)).slice(0, 3)
  const all = shuffled([entry, ...distractors])
  choices.value = all.map(c => ({ name: c.name }))
  shakingName.value = null
  locked.value = false
}

watch(() => props.entry, e => setup(e, props.pool), { immediate: true })

function pick(name: string) {
  if (locked.value) return
  if (name === props.entry.name) {
    locked.value = true
    emit('complete')
  } else {
    shakingName.value = name
    setTimeout(() => {
      if (shakingName.value === name) shakingName.value = null
    }, 450)
  }
}
</script>

<template>
  <div class="color-board">
    <div
      class="color-board__swatch"
      :style="{ background: entry.hex }"
    />

    <div class="color-board__choices">
      <WordChoice
        v-for="c in choices"
        :key="c.name"
        :label="c.name"
        :color="TILE_BG"
        :shaking="shakingName === c.name"
        :disabled="locked"
        @select="pick(c.name)"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.color-board {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 36px;
  width: 100%;

  @media (max-width: 480px) {
    gap: 20px;
  }
}

.color-board__swatch {
  width: 220px;
  height: 220px;
  border-radius: 50%;
  box-shadow: 0 10px 0 rgba(0, 0, 0, 0.35), inset 0 0 0 4px rgba(255, 255, 255, 0.1);

  @media (max-width: 480px) {
    width: 140px;
    height: 140px;
    box-shadow: 0 6px 0 rgba(0, 0, 0, 0.35), inset 0 0 0 3px rgba(255, 255, 255, 0.1);
  }
}

.color-board__choices {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
  width: 100%;
  max-width: 520px;

  @media (max-width: 480px) {
    gap: 10px;
  }
}
</style>
