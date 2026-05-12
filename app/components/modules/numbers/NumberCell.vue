<script setup lang="ts">
defineProps<{
  value: number
  color: string
  done: boolean
  shaking: boolean
  disabled: boolean
}>()

defineEmits<{ (e: 'pick'): void }>()
</script>

<template>
  <button
    class="number-cell"
    :class="{ 'number-cell--done': done, 'number-cell--shaking': shaking }"
    :style="{ background: color }"
    :disabled="disabled || done"
    @click="$emit('pick')"
  >
    {{ value }}
  </button>
</template>

<style lang="scss" scoped>
@use '~/assets/styles/variables' as *;

.number-cell {
  aspect-ratio: 1 / 1;
  border-radius: $radius-tile;
  font-family: $font-title;
  font-size: 2.6rem;
  color: white;
  touch-action: manipulation;
  user-select: none;
  box-shadow: 0 6px 0 rgba(0, 0, 0, 0.25);
  transition: transform 120ms ease, box-shadow 120ms ease, opacity 200ms ease, filter 200ms ease;

  &:active:not(:disabled) {
    transform: translateY(3px);
    box-shadow: 0 3px 0 rgba(0, 0, 0, 0.25);
  }

  &--done {
    opacity: 0.35;
    filter: saturate(0.4);
    box-shadow: 0 2px 0 rgba(0, 0, 0, 0.2);
  }

  &--shaking {
    animation: number-cell-shake 450ms ease-in-out;
  }

  @media (max-width: 480px) {
    font-size: 1.8rem;
    box-shadow: 0 4px 0 rgba(0, 0, 0, 0.25);
  }
}

@keyframes number-cell-shake {
  0%, 100% { transform: translateX(0); }
  15% { transform: translateX(-8px); }
  30% { transform: translateX(8px); }
  45% { transform: translateX(-6px); }
  60% { transform: translateX(6px); }
  75% { transform: translateX(-3px); }
  90% { transform: translateX(3px); }
}
</style>
