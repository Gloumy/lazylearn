<script setup lang="ts">
import { loadWords, type WordEntry, type WordLevel } from '~/data/words'

const route = useRoute()
const profileId = Number(route.params.profile)

const { completions, refresh: refreshProgress, complete } = useProgress(profileId)
const [words] = await Promise.all([loadWords(), refreshProgress()])

const { speak } = useSpeech()

const level = ref<WordLevel>(1)

const pool = computed(() => words.filter(w => w.level === level.value))

function pickNext(): WordEntry | null {
  const done = new Set(
    completions.value.filter(c => c.module === 'pictures').map(c => c.ref),
  )
  const remaining = pool.value.filter(w => !done.has(w.word))
  const source = remaining.length ? remaining : pool.value
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
  await complete('pictures', entry.word)
}

function next() {
  showCelebration.value = false
  currentWord.value = pickNext()
}

const levelDone = computed(() => {
  const done = new Set(
    completions.value.filter(c => c.module === 'pictures').map(c => c.ref),
  )
  return pool.value.filter(w => done.has(w.word)).length
})
const levelTotal = computed(() => pool.value.length)
</script>

<template>
  <main class="pictures-screen">
    <header class="pictures-screen__header">
      <NuxtLink :to="`/${profileId}`" class="pictures-screen__back">← Menu</NuxtLink>
      <div class="pictures-screen__levels">
        <button
          v-for="lvl in ([1, 2, 3] as const)"
          :key="lvl"
          class="pictures-screen__level"
          :class="{ 'pictures-screen__level--active': level === lvl }"
          @click="level = lvl"
        >
          Niveau {{ lvl }}
        </button>
      </div>
      <div class="pictures-screen__progress">{{ levelDone }} / {{ levelTotal }}</div>
    </header>

    <div class="pictures-screen__stage">
      <PictureBoard
        v-if="currentWord"
        :key="`${currentWord.word}-${completions.length}`"
        :entry="currentWord"
        :pool="pool"
        @complete="onComplete"
      />
      <p v-else class="pictures-screen__empty">Plus d'images pour ce niveau !</p>
    </div>

    <CelebrationOverlay
      :show="showCelebration"
      :emoji="currentWord?.emoji"
      :title="currentWord ? `${currentWord.article} ${currentWord.word.toLowerCase()}` : ''"
      background="#311B92"
      next-label="Image suivante →"
      @next="next"
    />
  </main>
</template>

<style lang="scss" scoped>
@use '~/assets/styles/variables' as *;

.pictures-screen {
  min-height: 100dvh;
  background: $bg-pictures;
  color: white;
  display: flex;
  flex-direction: column;
}

.pictures-screen__header {
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

.pictures-screen__back {
  font-family: $font-body;
  color: white;
  text-decoration: none;
  opacity: 0.85;
  font-size: 1rem;

  &:hover {
    opacity: 1;
  }
}

.pictures-screen__levels {
  display: flex;
  gap: 8px;
}

.pictures-screen__level {
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

.pictures-screen__progress {
  font-family: $font-title;
  font-size: 1.25rem;
  opacity: 0.9;
}

.pictures-screen__stage {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;

  @media (max-width: 480px) {
    padding: 12px;
  }
}

.pictures-screen__empty {
  font-family: $font-body;
  font-size: 1.1rem;
  opacity: 0.85;
}
</style>
