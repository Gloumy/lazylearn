<script setup lang="ts">
defineProps<{
  label: string
  color: string
  shaking?: boolean
  disabled?: boolean
}>()
defineEmits<{ (e: 'select'): void }>()
</script>

<template>
  <button
    class="word-choice"
    :class="{ 'word-choice--shake': shaking }"
    :style="{ background: color }"
    :disabled="disabled"
    @click="$emit('select')"
  >
    {{ label }}
  </button>
</template>

<style lang="scss" scoped>
@use '~/assets/styles/variables' as *;

.word-choice {
  min-width: 180px;
  padding: 24px 28px;
  border-radius: $radius-card;
  font-family: $font-title;
  font-size: 2rem;
  color: white;
  letter-spacing: 0.05em;
  box-shadow: 0 6px 0 rgba(0, 0, 0, 0.25);
  transition: transform 120ms ease, box-shadow 120ms ease;

  &:active:not(:disabled) {
    transform: translateY(3px);
    box-shadow: 0 3px 0 rgba(0, 0, 0, 0.25);
  }

  &--shake {
    animation: word-shake 450ms ease;
  }

  @media (max-width: 480px) {
    min-width: 0;
    padding: 16px 14px;
    font-size: 1.4rem;
  }
}

@keyframes word-shake {
  0%, 100% { transform: translateX(0); }
  20%      { transform: translateX(-8px); }
  40%      { transform: translateX(8px); }
  60%      { transform: translateX(-6px); }
  80%      { transform: translateX(6px); }
}
</style>
