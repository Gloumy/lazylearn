<script setup lang="ts">
import { loadWords, type WordEntry, type WordLevel } from '~/data/words'

const route = useRoute()
const profileId = Number(route.params.profile)

const { completions, refresh: refreshProgress, complete } = useProgress(profileId)
const [words] = await Promise.all([loadWords(), refreshProgress()])

const { speak } = useSpeech()

const level = ref<WordLevel>(1)

function pickNext(): WordEntry | null {
  const pool = words.filter(w => w.level === level.value)
  const done = new Set(
    completions.value.filter(c => c.module === 'words').map(c => c.ref),
  )
  const remaining = pool.filter(w => !done.has(w.word))
  const source = remaining.length ? remaining : pool
  if (!source.length) return null
  return source[Math.floor(Math.random() * source.length)]!
}

const currentWord = ref<WordEntry | null>(pickNext())
const showCelebration = ref(false)

watch(level, () => {
  showCelebration.value = false
  currentWord.value = pickNext()
})

async function onComplete() {
  if (!currentWord.value) return
  const entry = currentWord.value
  setTimeout(() => {
    speak(`le mot : ${entry.article} ${entry.word.toLowerCase()}`, { rate: 0.9 })
  }, 300)
  showCelebration.value = true
  await complete('words', entry.word)
}

function next() {
  showCelebration.value = false
  currentWord.value = pickNext()
}

const levelDone = computed(() => {
  const pool = words.filter(w => w.level === level.value)
  const done = new Set(
    completions.value.filter(c => c.module === 'words').map(c => c.ref),
  )
  return pool.filter(w => done.has(w.word)).length
})
const levelTotal = computed(() => words.filter(w => w.level === level.value).length)
</script>

<template>
  <main class="words-screen">
    <header class="words-screen__header">
      <NuxtLink :to="`/${profileId}`" class="words-screen__back">← Menu</NuxtLink>
      <div class="words-screen__levels">
        <button
          v-for="lvl in ([1, 2, 3] as const)"
          :key="lvl"
          class="words-screen__level"
          :class="{ 'words-screen__level--active': level === lvl }"
          @click="level = lvl"
        >
          Niveau {{ lvl }}
        </button>
      </div>
      <div class="words-screen__progress">{{ levelDone }} / {{ levelTotal }}</div>
    </header>

    <div class="words-screen__stage">
      <WordBoard
        v-if="currentWord"
        :key="`${currentWord.word}-${completions.length}`"
        :entry="currentWord"
        @complete="onComplete"
      />
      <p v-else class="words-screen__empty">Plus de mots pour ce niveau !</p>
    </div>

    <CelebrationOverlay
      :show="showCelebration"
      :emoji="currentWord?.emoji"
      :title="currentWord ? `${currentWord.article} ${currentWord.word.toLowerCase()}` : ''"
      background="#1A237E"
      next-label="Mot suivant →"
      @next="next"
    />
  </main>
</template>

<style lang="scss" scoped>
@use '~/assets/styles/variables' as *;

.words-screen {
  min-height: 100dvh;
  background: $bg-words;
  color: white;
  display: flex;
  flex-direction: column;
}

.words-screen__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 20px 24px;
  flex-wrap: wrap;

  @media (max-width: 480px) {
    padding: 12px 16px;
    gap: 10px;
  }
}

.words-screen__back {
  font-family: $font-body;
  color: white;
  text-decoration: none;
  opacity: 0.85;
  font-size: 1rem;

  &:hover {
    opacity: 1;
  }
}

.words-screen__levels {
  display: flex;
  gap: 8px;
}

.words-screen__level {
  padding: 8px 14px;
  font-family: $font-body;
  font-weight: 600;
  font-size: 0.95rem;
  color: white;
  background: rgba(255, 255, 255, 0.1);
  border-radius: $radius-btn;
  transition: background 150ms ease;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }

  &--active {
    background: rgba(255, 255, 255, 0.3);
  }
}

.words-screen__progress {
  font-family: $font-title;
  font-size: 1.25rem;
  opacity: 0.9;
}

.words-screen__stage {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;

  @media (max-width: 480px) {
    padding: 12px;
  }
}

.words-screen__empty {
  font-family: $font-body;
  font-size: 1.1rem;
  opacity: 0.85;
}
</style>
