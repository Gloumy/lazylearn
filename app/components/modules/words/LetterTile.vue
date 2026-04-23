<script setup lang="ts">
defineProps<{
  letter: string
  color: string
  dragging?: boolean
}>()
const emit = defineEmits<{ (e: 'drag-start', event: PointerEvent): void }>()
</script>

<template>
  <button
    class="letter-tile"
    :class="{
      'letter-tile--dragging': dragging,
      'letter-tile--multi': letter.length > 1,
    }"
    :style="{ background: color }"
    @pointerdown="emit('drag-start', $event)"
  >
    {{ letter }}
  </button>
</template>

<style lang="scss" scoped>
@use '~/assets/styles/variables' as *;

.letter-tile {
  width: 72px;
  height: 72px;
  border-radius: $radius-tile;
  font-family: $font-title;
  font-size: 2.25rem;
  color: white;
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

  &--multi {
    font-size: 1.4rem;
  }

  @media (max-width: 480px) {
    width: 56px;
    height: 56px;
    font-size: 1.75rem;

    &--multi {
      font-size: 1.1rem;
    }
  }
}
</style>
