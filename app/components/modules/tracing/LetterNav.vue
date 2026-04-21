<script setup lang="ts">
const props = defineProps<{
  current: string
  completed: Set<string>
}>()
const emit = defineEmits<{ (e: 'select', letter: string): void }>()

const LETTERS = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i))
</script>

<template>
  <nav class="letter-nav">
    <button
      v-for="letter in LETTERS"
      :key="letter"
      class="letter-nav__item"
      :class="{
        'letter-nav__item--current': letter === current,
        'letter-nav__item--done': completed.has(letter),
      }"
      :aria-label="`Lettre ${letter}${completed.has(letter) ? ', déjà tracée' : ''}`"
      @click="emit('select', letter)"
    >
      {{ letter }}
      <span v-if="completed.has(letter)" class="letter-nav__mark">★</span>
    </button>
  </nav>
</template>

<style lang="scss" scoped>
@use '~/assets/styles/variables' as *;

.letter-nav {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(44px, 1fr));
  gap: 6px;
  padding: 12px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: $radius-card;
}

.letter-nav__item {
  position: relative;
  padding: 10px 6px;
  font-family: $font-title;
  font-size: 1.25rem;
  color: white;
  background: rgba(255, 255, 255, 0.1);
  border-radius: $radius-btn;
  transition: background 150ms ease, transform 150ms ease;

  &:hover {
    background: rgba(255, 255, 255, 0.22);
  }

  &--current {
    background: rgba(255, 255, 255, 0.38);
    transform: scale(1.05);
  }

  &--done {
    background: rgba(254, 202, 87, 0.28);
  }
}

.letter-nav__mark {
  position: absolute;
  top: 2px;
  right: 4px;
  font-size: 0.7rem;
  color: #FECA57;
}
</style>
