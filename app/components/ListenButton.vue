<script setup lang="ts">
defineEmits<{ (e: 'click'): void }>()
</script>

<template>
  <button class="listen-button" aria-label="Réécouter" @click="$emit('click')">
    🔊
  </button>
</template>

<style lang="scss" scoped>
.listen-button {
  width: 88px;
  height: 88px;
  border-radius: 50%;
  font-size: 2.5rem;
  background: rgba(255, 255, 255, 0.18);
  box-shadow: 0 6px 0 rgba(0, 0, 0, 0.25);
  transition: transform 120ms ease, box-shadow 120ms ease, background 150ms ease;

  &:hover {
    background: rgba(255, 255, 255, 0.26);
  }

  &:active {
    transform: translateY(3px);
    box-shadow: 0 3px 0 rgba(0, 0, 0, 0.25);
  }

  @media (max-width: 480px) {
    width: 68px;
    height: 68px;
    font-size: 2rem;
  }
}
</style>
