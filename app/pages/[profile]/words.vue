<script setup lang="ts">
import { WORDS, type WordEntry, type WordLevel } from '~/data/words'

const route = useRoute()
const profileId = Number(route.params.profile)

const { completions, refresh: refreshProgress, complete } = useProgress(profileId)
await refreshProgress()

const { speak } = useSpeech()

const level = ref<WordLevel>(1)

function pickNext(): WordEntry | null {
  const pool = WORDS.filter(w => w.level === level.value)
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
  const pool = WORDS.filter(w => w.level === level.value)
  const done = new Set(
    completions.value.filter(c => c.module === 'words').map(c => c.ref),
  )
  return pool.filter(w => done.has(w.word)).length
})
const levelTotal = computed(() => WORDS.filter(w => w.level === level.value).length)
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

    <Transition name="celebration">
      <div v-if="showCelebration" class="words-screen__overlay">
        <div class="words-screen__celebration">
          <span class="words-screen__celebration-emoji">{{ currentWord?.emoji }}</span>
          <h2>{{ currentWord?.article }} {{ currentWord?.word?.toLowerCase() }}</h2>
          <button class="words-screen__next" @click="next">Mot suivant →</button>
        </div>
      </div>
    </Transition>
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
}

.words-screen__empty {
  font-family: $font-body;
  font-size: 1.1rem;
  opacity: 0.85;
}

.words-screen__overlay {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.55);
  z-index: 100;
}

.words-screen__celebration {
  background: $bg-words;
  padding: 40px 48px;
  border-radius: $radius-card;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  text-align: center;
  animation: celebration-pop 500ms cubic-bezier(0.34, 1.56, 0.64, 1);
}

.words-screen__celebration-emoji {
  font-size: 6rem;
  line-height: 1;
}

.words-screen__celebration h2 {
  font-family: $font-title;
  font-size: 2.5rem;
  color: white;
  margin: 0;
}

.words-screen__next {
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
