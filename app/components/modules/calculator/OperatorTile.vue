<script setup lang="ts">
import { OPERATOR_COLORS, type Operator } from '~/data/calculator'

const props = defineProps<{ op: Operator }>()
const emit = defineEmits<{ (e: 'drag-start', event: PointerEvent): void }>()

const color = computed(() => OPERATOR_COLORS[props.op])
</script>

<template>
  <button
    class="operator-tile"
    :style="{ background: color }"
    @pointerdown="emit('drag-start', $event)"
  >
    {{ op }}
  </button>
</template>

<style lang="scss" scoped>
@use '~/assets/styles/variables' as *;

.operator-tile {
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

  @media (max-width: 480px) {
    width: 52px;
    height: 52px;
    font-size: 1.5rem;
  }
}
</style>
