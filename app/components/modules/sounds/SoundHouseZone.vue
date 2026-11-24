<script setup lang="ts">
import type { SoundHouse, SoundWord } from '~/data/sounds'

defineProps<{
  house: SoundHouse
  words: SoundWord[]
  color: string
  hovering: boolean
  shaking: boolean
}>()
const emit = defineEmits<{ (e: 'say'): void }>()
</script>

<template>
  <div
    class="sound-house"
    :class="{
      'sound-house--hover': hovering,
      'sound-house--shake': shaking,
    }"
    :style="{ '--house-color': color }"
    :data-drop-id="`house-${house.key}`"
  >
    <button class="sound-house__head" @click="emit('say')">
      <span v-if="house.emoji" class="sound-house__emoji">{{ house.emoji }}</span>
      <span class="sound-house__label">{{ house.label }}</span>
      <span class="sound-house__speaker">🔊</span>
    </button>

    <TransitionGroup tag="div" name="placed" class="sound-house__words">
      <div v-for="w in words" :key="w.id" class="sound-house__word">
        <span class="sound-house__word-emoji">{{ w.emoji }}</span>
        <span class="sound-house__word-text">
          <span
            v-for="(seg, i) in w.segments"
            :key="i"
            :class="{ 'sound-house__hl': seg.hl }"
          >{{ seg.text }}</span>
        </span>
      </div>
    </TransitionGroup>
  </div>
</template>

<style lang="scss" scoped>
@use '~/assets/styles/variables' as *;

.sound-house {
  flex: 1 1 0;
  min-width: 150px;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 12px;
  background: var(--house-color);
  border-radius: $radius-card;
  border: 4px solid transparent;
  box-shadow: 0 6px 0 rgba(0, 0, 0, 0.2);
  transition: transform 150ms ease, border-color 150ms ease;

  &--hover {
    border-color: white;
    transform: scale(1.03);
  }

  &--shake {
    animation: shake 400ms ease;
  }

  @media (max-width: 480px) {
    min-width: 120px;
    min-height: 150px;
    padding: 8px;
  }
}

.sound-house__head {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 8px;
  color: white;
  background: rgba(0, 0, 0, 0.15);
  border-radius: $radius-btn;
}

.sound-house__emoji {
  font-size: 2.5rem;
  line-height: 1;

  @media (max-width: 480px) {
    font-size: 1.8rem;
  }
}

.sound-house__label {
  font-family: $font-title;
  font-size: 2.75rem;
  line-height: 1;

  @media (max-width: 480px) {
    font-size: 2rem;
  }
}

.sound-house__speaker {
  font-size: 1.25rem;
  opacity: 0.8;
}

.sound-house__words {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-content: flex-start;
  gap: 8px;
  flex: 1;
}

.sound-house__word {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  background: rgba(255, 255, 255, 0.95);
  color: #2D1B69;
  border-radius: $radius-btn;
  font-family: $font-title;
  font-size: 1.25rem;

  @media (max-width: 480px) {
    font-size: 1rem;
    padding: 4px 8px;
  }
}

.sound-house__word-emoji {
  font-size: 1.4rem;
}

.sound-house__hl {
  color: #E53935;
  background: #FECA57;
  border-radius: 4px;
  padding: 0 1px;
}

.placed-enter-active {
  animation: pop 300ms ease;
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
