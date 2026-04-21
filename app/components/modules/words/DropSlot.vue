<script setup lang="ts">
interface FilledTile {
  letter: string
  color: string
}

defineProps<{
  slotId: string
  expected: string
  filled: FilledTile | null
  shaking: boolean
  hovering: boolean
}>()
</script>

<template>
  <div
    class="drop-slot"
    :class="{
      'drop-slot--shake': shaking,
      'drop-slot--hover': hovering && !filled,
      'drop-slot--filled': !!filled,
    }"
    :data-drop-id="slotId"
    :style="filled ? { background: filled.color } : undefined"
  >
    <span v-if="filled">{{ filled.letter }}</span>
  </div>
</template>

<style lang="scss" scoped>
@use '~/assets/styles/variables' as *;

.drop-slot {
  width: 72px;
  height: 72px;
  border-radius: $radius-tile;
  background: rgba(255, 255, 255, 0.12);
  border: 3px dashed rgba(255, 255, 255, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: $font-title;
  font-size: 2.25rem;
  color: white;
  transition: background 150ms ease, border-color 150ms ease, transform 150ms ease;

  &--hover {
    border-color: rgba(255, 255, 255, 0.7);
    transform: scale(1.05);
  }

  &--filled {
    border: none;
    box-shadow: 0 4px 0 rgba(0, 0, 0, 0.25);
    animation: pop 300ms ease;
  }

  &--shake {
    animation: shake 400ms ease;
  }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20% { transform: translateX(-8px); }
  40% { transform: translateX(8px); }
  60% { transform: translateX(-6px); }
  80% { transform: translateX(4px); }
}

@keyframes pop {
  0% { transform: scale(0.5); }
  60% { transform: scale(1.15); }
  100% { transform: scale(1); }
}
</style>
