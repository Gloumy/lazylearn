<script setup lang="ts">
defineProps<{
  show: boolean
  emoji?: string
  title?: string
  background?: string
  nextLabel?: string
}>()

defineEmits<{
  next: []
}>()
</script>

<template>
  <Transition name="celebration">
    <div v-if="show" class="celebration-overlay" @click.self="$emit('next')">
      <div
        class="celebration-overlay__card"
        :style="background ? { background } : undefined"
      >
        <span v-if="emoji" class="celebration-overlay__emoji">{{ emoji }}</span>
        <h2 v-if="title" class="celebration-overlay__title">{{ title }}</h2>
        <slot />
        <button class="celebration-overlay__next" @click="$emit('next')">
          {{ nextLabel ?? 'Suivant →' }}
        </button>
      </div>
    </div>
  </Transition>
</template>

<style lang="scss" scoped>
@use '~/assets/styles/variables' as *;

.celebration-overlay {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.55);
  z-index: 100;
}

.celebration-overlay__card {
  background: #2D1B69;
  padding: 40px 48px;
  border-radius: $radius-card;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  text-align: center;
  animation: celebration-pop 500ms cubic-bezier(0.34, 1.56, 0.64, 1);
  max-width: calc(100vw - 32px);
}

.celebration-overlay__emoji {
  font-size: 6rem;
  line-height: 1;
}

.celebration-overlay__title {
  font-family: $font-title;
  font-size: 2.5rem;
  color: white;
  margin: 0;
}

.celebration-overlay__next {
  font-family: $font-body;
  font-weight: 600;
  font-size: 1.15rem;
  padding: 14px 28px;
  background: #FF6B35;
  color: white;
  border-radius: $radius-btn;
  transition: filter 150ms ease;

  &:hover {
    filter: brightness(1.1);
  }
}

@keyframes celebration-pop {
  0% {
    transform: scale(0.6);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.celebration-enter-active,
.celebration-leave-active {
  transition: opacity 250ms ease;
}
.celebration-enter-from,
.celebration-leave-to {
  opacity: 0;
}
</style>
