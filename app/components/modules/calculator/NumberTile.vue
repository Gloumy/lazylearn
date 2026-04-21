<script setup lang="ts">
defineProps<{
  value: number
  color: string
}>()
const emit = defineEmits<{ (e: 'drag-start', event: PointerEvent): void }>()
</script>

<template>
  <button
    class="number-tile"
    :style="{ background: color }"
    @pointerdown="emit('drag-start', $event)"
  >
    {{ value }}
  </button>
</template>

<style lang="scss" scoped>
@use '~/assets/styles/variables' as *;

.number-tile {
  width: 64px;
  height: 64px;
  border-radius: $radius-tile;
  font-family: $font-title;
  font-size: 2rem;
  color: white;
  touch-action: none;
  user-select: none;
  box-shadow: 0 4px 0 rgba(0, 0, 0, 0.25);
  transition: transform 120ms ease, box-shadow 120ms ease;

  &:active {
    transform: translateY(2px);
    box-shadow: 0 2px 0 rgba(0, 0, 0, 0.25);
  }
}
</style>
