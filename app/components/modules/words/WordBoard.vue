<script setup lang="ts">
import type { WordEntry } from '~/data/words'

const props = defineProps<{ entry: WordEntry }>()
const emit = defineEmits<{ (e: 'complete'): void }>()

const TILE_COLORS = [
  '#FF6B6B', '#FF9F43', '#FECA57', '#26de81',
  '#45aaf2', '#a55eea', '#2bcbba', '#FC427B',
  '#5C6BC0', '#8BC34A',
]

interface Tile {
  id: number
  letter: string
  color: string
}

interface Slot {
  index: number
  letter: string
  filled: Tile | null
}

const { speak } = useSpeech()

function shuffled<T>(arr: T[]): T[] {
  const out = [...arr]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[out[i], out[j]] = [out[j]!, out[i]!]
  }
  return out
}

const slots = ref<Slot[]>([])
const tiles = ref<Tile[]>([])
const shakingSlotId = ref<string | null>(null)

function setup(entry: WordEntry) {
  const letters = entry.word.split('')
  slots.value = letters.map((letter, index) => ({ index, letter, filled: null }))
  tiles.value = shuffled(
    letters.map((letter, i) => ({
      id: i,
      letter,
      color: TILE_COLORS[i % TILE_COLORS.length]!,
    })),
  )
  shakingSlotId.value = null
}

watch(() => props.entry, setup, { immediate: true })

const { dragged, pointer, hoverTargetId, startDrag } = useDragDrop<Tile>({
  onDrop(tile, targetId) {
    if (!targetId || !targetId.startsWith('slot-')) return
    const slotIndex = Number(targetId.slice('slot-'.length))
    const slot = slots.value[slotIndex]
    if (!slot) return
    if (slot.filled) {
      triggerShake(targetId)
      return
    }
    if (slot.letter === tile.letter) {
      slot.filled = tile
      tiles.value = tiles.value.filter(t => t.id !== tile.id)
      speak(tile.letter, { rate: 0.8 })
      if (slots.value.every(s => s.filled)) {
        setTimeout(() => emit('complete'), 450)
      }
    } else {
      triggerShake(targetId)
    }
  },
})

function triggerShake(slotId: string) {
  shakingSlotId.value = slotId
  setTimeout(() => {
    if (shakingSlotId.value === slotId) shakingSlotId.value = null
  }, 450)
}
</script>

<template>
  <div class="word-board">
    <div class="word-board__prompt">
      <span class="word-board__emoji">{{ entry.emoji }}</span>
      <span class="word-board__article">{{ entry.article }}</span>
    </div>

    <div class="word-board__slots">
      <DropSlot
        v-for="slot in slots"
        :key="slot.index"
        :slot-id="`slot-${slot.index}`"
        :expected="slot.letter"
        :filled="slot.filled"
        :shaking="shakingSlotId === `slot-${slot.index}`"
        :hovering="hoverTargetId === `slot-${slot.index}` && dragged !== null"
      />
    </div>

    <div
      class="word-board__tiles"
      :style="{ '--word-length': entry.word.length }"
    >
      <LetterTile
        v-for="tile in tiles"
        :key="tile.id"
        :letter="tile.letter"
        :color="tile.color"
        :dragging="dragged?.data.id === tile.id"
        @drag-start="(event) => startDrag(tile, event)"
      />
    </div>

    <Teleport v-if="dragged" to="body">
      <div
        class="drag-ghost"
        :style="{
          left: `${pointer.x - dragged.offsetX}px`,
          top: `${pointer.y - dragged.offsetY}px`,
          width: `${dragged.width}px`,
          height: `${dragged.height}px`,
          background: dragged.data.color,
        }"
      >
        {{ dragged.data.letter }}
      </div>
    </Teleport>
  </div>
</template>

<style lang="scss" scoped>
@use '~/assets/styles/variables' as *;

.word-board {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
  width: 100%;
}

.word-board__prompt {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.word-board__emoji {
  font-size: 5rem;
  line-height: 1;

  @media (max-width: 480px) {
    font-size: 3.5rem;
  }
}

.word-board__article {
  font-family: $font-title;
  font-size: 1.5rem;
  color: rgba(255, 255, 255, 0.85);

  @media (max-width: 480px) {
    font-size: 1.2rem;
  }
}

.word-board__slots,
.word-board__tiles {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;

  @media (max-width: 480px) {
    gap: 8px;
  }
}

.word-board__tiles {
  --tile-size: 72px;
  --tile-gap: 12px;
  padding: 20px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: $radius-card;
  min-height: 112px;
  width: calc(
    var(--word-length, 5) * var(--tile-size)
    + (var(--word-length, 5) - 1) * var(--tile-gap)
    + 40px
  );
  max-width: 100%;
  box-sizing: border-box;

  @media (max-width: 480px) {
    --tile-size: 56px;
    --tile-gap: 8px;
    padding: 12px;
    min-height: 80px;
  }
}

.word-board {
  @media (max-width: 480px) {
    gap: 18px;
  }
}
</style>
