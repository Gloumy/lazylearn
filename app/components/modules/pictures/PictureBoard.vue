<script setup lang="ts">
import type { WordEntry } from '~/data/words'

// Mode audio "Écoute et trouve" : la voix nomme un objet, l'enfant touche
// la bonne image parmi 4. Aucune lecture nécessaire (public maternelle).
const props = defineProps<{ entry: WordEntry; pool: WordEntry[] }>()
const emit = defineEmits<{ (e: 'complete'): void }>()

const { speak } = useSpeech()

const choices = ref<WordEntry[]>([])
const shakingWord = ref<string | null>(null)
const locked = ref(false)

function prompt() {
  speak(`Montre-moi ${props.entry.article} ${props.entry.word.toLowerCase()}`, { rate: 0.9 })
}

function setup(entry: WordEntry, pool: WordEntry[]) {
  // Distracteurs d'emoji différents (évite deux images identiques).
  const seen = new Set([entry.emoji])
  const distractors: WordEntry[] = []
  for (const w of shuffled(pool)) {
    if (distractors.length === 3) break
    if (seen.has(w.emoji)) continue
    seen.add(w.emoji)
    distractors.push(w)
  }
  choices.value = shuffled([entry, ...distractors])
  shakingWord.value = null
  locked.value = false
}

watch(() => props.entry, e => setup(e, props.pool), { immediate: true })
onMounted(() => setTimeout(prompt, 350))

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
    <ListenButton @click="prompt" />

    <div class="picture-board__choices">
      <button
        v-for="c in choices"
        :key="c.word"
        class="picture-board__choice"
        :class="{ 'picture-board__choice--shake': shakingWord === c.word }"
        :aria-label="c.word"
        :disabled="locked"
        @click="pick(c.word)"
      >
        {{ c.emoji }}
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '~/assets/styles/variables' as *;

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

.picture-board__choices {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 24px;
  width: 100%;
  max-width: 480px;

  @media (max-width: 480px) {
    gap: 14px;
    max-width: 320px;
  }
}

.picture-board__choice {
  aspect-ratio: 1;
  font-size: 6rem;
  line-height: 1;
  background: rgba(255, 255, 255, 0.92);
  border-radius: $radius-card;
  box-shadow: 0 8px 0 rgba(0, 0, 0, 0.3);
  transition: transform 120ms ease, box-shadow 120ms ease;

  &:active:not(:disabled) {
    transform: translateY(4px);
    box-shadow: 0 4px 0 rgba(0, 0, 0, 0.3);
  }

  &--shake {
    animation: shake 400ms ease;
  }

  @media (max-width: 480px) {
    font-size: 4rem;
  }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20% { transform: translateX(-8px); }
  40% { transform: translateX(8px); }
  60% { transform: translateX(-6px); }
  80% { transform: translateX(4px); }
}
</style>
