<script setup lang="ts">
import type { SoundSeries, SoundWord } from '~/data/sounds'

const props = defineProps<{ series: SoundSeries }>()
const emit = defineEmits<{ (e: 'complete'): void }>()

const HOUSE_COLORS = ['#45aaf2', '#26de81', '#FF9F43', '#a55eea']

const { speak } = useSpeech()

const bank = ref<SoundWord[]>([])
const placed = ref<Record<string, SoundWord[]>>({})
const shakingHouse = ref<string | null>(null)

function setup(series: SoundSeries) {
  bank.value = shuffled(series.words)
  placed.value = Object.fromEntries(series.houses.map(h => [h.key, []]))
  shakingHouse.value = null
}

watch(() => props.series, setup, { immediate: true })

const { dragged, pointer, hoverTargetId, startDrag } = useDragDrop<SoundWord>({
  onDrop(word, targetId) {
    if (!targetId?.startsWith('house-')) return
    const key = targetId.slice('house-'.length)
    if (word.house !== key) {
      triggerShake(key)
      return
    }
    placed.value[key]!.push(word)
    bank.value = bank.value.filter(w => w.id !== word.id)
    speak(word.text, { rate: 0.85 })
    if (!bank.value.length) setTimeout(() => emit('complete'), 900)
  },
})

function onCardDown(word: SoundWord, event: PointerEvent) {
  // On entend le mot dès qu'on le prend : le tri se fait à l'oreille.
  speak(word.text, { rate: 0.85 })
  startDrag(word, event)
}

function triggerShake(key: string) {
  shakingHouse.value = key
  setTimeout(() => {
    if (shakingHouse.value === key) shakingHouse.value = null
  }, 450)
}
</script>

<template>
  <div class="sound-board">
    <div class="sound-board__houses">
      <SoundHouseZone
        v-for="(h, i) in series.houses"
        :key="h.key"
        :house="h"
        :words="placed[h.key] ?? []"
        :color="HOUSE_COLORS[i % HOUSE_COLORS.length]!"
        :hovering="dragged !== null && hoverTargetId === `house-${h.key}`"
        :shaking="shakingHouse === h.key"
        @say="speak(h.say, { rate: 0.85 })"
      />
    </div>

    <div v-if="bank.length" class="sound-board__bank">
      <SoundCard
        v-for="w in bank"
        :key="w.id"
        :word="w"
        :dragging="dragged?.data.id === w.id"
        @drag-start="(event) => onCardDown(w, event)"
      />
    </div>

    <Teleport v-if="dragged" to="body">
      <div
        class="drag-ghost sound-ghost"
        :style="{
          left: `${pointer.x - dragged.offsetX}px`,
          top: `${pointer.y - dragged.offsetY}px`,
          width: `${dragged.width}px`,
          height: `${dragged.height}px`,
        }"
      >
        <span class="sound-ghost__emoji">{{ dragged.data.emoji }}</span>
        <span>{{ dragged.data.text }}</span>
      </div>
    </Teleport>
  </div>
</template>

<style lang="scss" scoped>
@use '~/assets/styles/variables' as *;

.sound-board {
  display: flex;
  flex-direction: column;
  gap: 28px;
  width: 100%;
  max-width: 1000px;

  @media (max-width: 480px) {
    gap: 16px;
  }
}

.sound-board__houses {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;

  @media (max-width: 480px) {
    gap: 10px;
  }
}

.sound-board__bank {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
  padding: 20px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: $radius-card;

  @media (max-width: 480px) {
    gap: 8px;
    padding: 12px;
  }
}

.sound-ghost {
  flex-direction: column;
  gap: 4px;
  background: white;
  color: #2D1B69;
  font-size: 1.5rem;
}

.sound-ghost__emoji {
  font-size: 2.5rem;
  line-height: 1;
}
</style>
