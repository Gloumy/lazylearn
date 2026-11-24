<script setup lang="ts">
import { NUMBER_RANGES, TOTAL_RANGES, type NumberRange } from '~/data/numbers'

const route = useRoute()
const profileId = Number(route.params.profile)

const { completions, refresh: refreshProgress, complete } = useProgress(profileId)
await refreshProgress()

const { speak } = useSpeech()

function pickNext(): NumberRange | null {
  const done = new Set(
    completions.value.filter(c => c.module === 'numbers').map(c => c.ref),
  )
  const remaining = NUMBER_RANGES.filter(r => !done.has(r.id))
  if (remaining.length) return remaining[0]!
  return NUMBER_RANGES[Math.floor(Math.random() * NUMBER_RANGES.length)]!
}

const currentRange = ref<NumberRange | null>(pickNext())
const showCelebration = ref(false)

function onProgress(value: number) {
  speak(numberToWords(value), { rate: 0.95 })
}

async function onComplete() {
  if (!currentRange.value) return
  showCelebration.value = true
  await complete('numbers', currentRange.value.id)
}

function next() {
  showCelebration.value = false
  currentRange.value = pickNext()
}

const done = computed(() => {
  const set = new Set(
    completions.value.filter(c => c.module === 'numbers').map(c => c.ref),
  )
  return NUMBER_RANGES.filter(r => set.has(r.id)).length
})
</script>

<template>
  <main class="numbers-screen">
    <header class="numbers-screen__header">
      <NuxtLink :to="`/${profileId}`" class="numbers-screen__back">← Menu</NuxtLink>
      <div class="numbers-screen__progress">{{ done }} / {{ TOTAL_RANGES }}</div>
    </header>

    <div class="numbers-screen__stage">
      <NumberGrid
        v-if="currentRange"
        :key="`${currentRange.id}-${completions.length}`"
        :range="currentRange"
        @progress="onProgress"
        @complete="onComplete"
      />
      <p v-else class="numbers-screen__empty">Plus de tranches !</p>
    </div>

    <CelebrationOverlay
      :show="showCelebration"
      emoji="🎉"
      :title="currentRange ? `${currentRange.start} → ${currentRange.end}` : ''"
      background="#00695C"
      next-label="Tranche suivante →"
      @next="next"
    />
  </main>
</template>

<style lang="scss" scoped>
@use '~/assets/styles/variables' as *;

.numbers-screen {
  min-height: 100dvh;
  background: $bg-numbers;
  color: white;
  display: flex;
  flex-direction: column;
}

.numbers-screen__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 20px 24px;

  @media (max-width: 480px) {
    padding: 12px 16px;
  }
}

.numbers-screen__back {
  font-family: $font-body;
  color: white;
  text-decoration: none;
  opacity: 0.85;
  font-size: 1rem;

  &:hover {
    opacity: 1;
  }
}

.numbers-screen__progress {
  font-family: $font-title;
  font-size: 1.25rem;
  opacity: 0.9;
}

.numbers-screen__stage {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;

  @media (max-width: 480px) {
    padding: 12px;
  }
}

.numbers-screen__empty {
  font-family: $font-body;
  font-size: 1.1rem;
  opacity: 0.85;
}
</style>
