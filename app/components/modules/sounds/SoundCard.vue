<script setup lang="ts">
import type { SoundWord } from '~/data/sounds'

defineProps<{
  word: SoundWord
  dragging?: boolean
}>()
const emit = defineEmits<{ (e: 'drag-start', event: PointerEvent): void }>()
</script>

<template>
  <button
    class="sound-card"
    :class="{ 'sound-card--dragging': dragging }"
    @pointerdown="emit('drag-start', $event)"
  >
    <span class="sound-card__emoji">{{ word.emoji }}</span>
    <span class="sound-card__text">{{ word.text }}</span>
  </button>
</template>

<style lang="scss" scoped>
@use '~/assets/styles/variables' as *;

.sound-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  min-width: 110px;
  padding: 12px 16px;
  background: white;
  color: #2D1B69;
  border-radius: $radius-tile;
  touch-action: none;
  user-select: none;
  box-shadow: 0 4px 0 rgba(0, 0, 0, 0.25);
  transition: transform 120ms ease, box-shadow 120ms ease, opacity 150ms ease;

  &:active {
    transform: translateY(2px);
    box-shadow: 0 2px 0 rgba(0, 0, 0, 0.25);
  }

  &--dragging {
    opacity: 0;
    pointer-events: none;
  }

  @media (max-width: 480px) {
    min-width: 88px;
    padding: 8px 10px;
  }
}

.sound-card__emoji {
  font-size: 2.5rem;
  line-height: 1;

  @media (max-width: 480px) {
    font-size: 2rem;
  }
}

.sound-card__text {
  font-family: $font-title;
  font-size: 1.5rem;
  line-height: 1.1;

  @media (max-width: 480px) {
    font-size: 1.2rem;
  }
}
</style>
