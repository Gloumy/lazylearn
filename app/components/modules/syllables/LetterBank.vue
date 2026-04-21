<script setup lang="ts">
const CONSONANT_COLORS = [
  '#FF6B6B', '#FF9F43', '#26de81',
  '#45aaf2', '#a55eea', '#2bcbba',
  '#FC427B', '#5C6BC0', '#8BC34A',
]
const VOWEL_COLOR = '#FECA57'

const props = defineProps<{
  label: string
  letters: string[]
  variant: 'consonant' | 'vowel'
}>()

const emit = defineEmits<{
  (e: 'drag-start', letter: string, event: PointerEvent): void
}>()

function colorFor(letter: string) {
  if (props.variant === 'vowel') return VOWEL_COLOR
  const h = letter.charCodeAt(0) - 97
  return CONSONANT_COLORS[((h % CONSONANT_COLORS.length) + CONSONANT_COLORS.length) % CONSONANT_COLORS.length]!
}
</script>

<template>
  <div class="letter-bank" :class="`letter-bank--${variant}`">
    <h3 class="letter-bank__label">{{ label }}</h3>
    <div class="letter-bank__grid">
      <LetterTile
        v-for="letter in letters"
        :key="letter"
        :letter="letter"
        :color="colorFor(letter)"
        @drag-start="(event) => emit('drag-start', letter, event)"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '~/assets/styles/variables' as *;

.letter-bank {
  background: rgba(255, 255, 255, 0.08);
  border-radius: $radius-card;
  padding: 16px;
}

.letter-bank__label {
  font-family: $font-title;
  font-size: 1rem;
  margin-bottom: 12px;
  color: rgba(255, 255, 255, 0.85);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.letter-bank__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, 72px);
  gap: 10px;
  justify-content: center;
}
</style>
