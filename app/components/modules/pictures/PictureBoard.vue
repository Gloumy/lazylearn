<script setup lang="ts">
import type { WordEntry } from '~/data/words'

const props = defineProps<{ entry: WordEntry; pool: WordEntry[] }>()
const emit = defineEmits<{ (e: 'complete'): void }>()

const TILE_COLORS = [
  '#FF6B6B', '#FF9F43', '#FECA57', '#26de81',
  '#45aaf2', '#a55eea', '#2bcbba', '#FC427B',
]

interface Choice {
  word: string
  color: string
}

function shuffled<T>(arr: T[]): T[] {
  const out = [...arr]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[out[i], out[j]] = [out[j]!, out[i]!]
  }
  return out
}

const choices = ref<Choice[]>([])
const shakingWord = ref<string | null>(null)
const locked = ref(false)

function setup(entry: WordEntry, pool: WordEntry[]) {
  const distractors = shuffled(pool.filter(w => w.word !== entry.word)).slice(0, 3)
  const all = shuffled([entry, ...distractors])
  const colors = shuffled(TILE_COLORS).slice(0, 4)
  choices.value = all.map((w, i) => ({ word: w.word, color: colors[i]! }))
  shakingWord.value = null
  locked.value = false
}

watch(() => props.entry, e => setup(e, props.pool), { immediate: true })

function pick(word: string) {
  if (locked.value) return
  if (word === props.entry.word) {
    locked.value = true
    emit('complete')
  } else {
    shakingWord.value = word
    setTimeout(() => {
      if (shakingWord.value === word) shakingWord.value = null
    }, 450)
  }
}
</script>

<template>
  <div class="picture-board">
    <span class="picture-board__emoji">{{ entry.emoji }}</span>

    <div class="picture-board__choices">
      <WordChoice
        v-for="c in choices"
        :key="c.word"
        :label="c.word"
        :color="c.color"
        :shaking="shakingWord === c.word"
        :disabled="locked"
        @select="pick(c.word)"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.picture-board {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 36px;
  width: 100%;

  @media (max-width: 480px) {
    gap: 20px;
  }
}

.picture-board__emoji {
  font-size: 9rem;
  line-height: 1;

  @media (max-width: 480px) {
    font-size: 5rem;
  }
}

.picture-board__choices {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
  width: 100%;
  max-width: 520px;

  @media (max-width: 480px) {
    gap: 10px;
  }
}
</style>
