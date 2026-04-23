<script setup lang="ts">
import { COLORS, type ColorEntry } from '~/data/colors'

const route = useRoute()
const profileId = Number(route.params.profile)

const { completions, refresh: refreshProgress, complete } = useProgress(profileId)
await refreshProgress()

const { speak } = useSpeech()

function pickNext(): ColorEntry | null {
  const done = new Set(
    completions.value.filter(c => c.module === 'colors').map(c => c.ref),
  )
  const remaining = COLORS.filter(c => !done.has(c.name))
  const source = remaining.length ? remaining : COLORS
  if (!source.length) return null
  return source[Math.floor(Math.random() * source.length)]!
}

const currentColor = ref<ColorEntry | null>(pickNext())
const showCelebration = ref(false)

async function onComplete() {
  if (!currentColor.value) return
  const entry = currentColor.value
  setTimeout(() => {
    speak(`la couleur ${entry.name.toLowerCase()}`, { rate: 0.9 })
  }, 300)
  showCelebration.value = true
  await complete('colors', entry.name)
}

function next() {
  showCelebration.value = false
  currentColor.value = pickNext()
}

const done = computed(() => {
  const set = new Set(
    completions.value.filter(c => c.module === 'colors').map(c => c.ref),
  )
  return COLORS.filter(c => set.has(c.name)).length
})
</script>

<template>
  <main class="colors-screen">
    <header class="colors-screen__header">
      <NuxtLink :to="`/${profileId}`" class="colors-screen__back">← Menu</NuxtLink>
      <div class="colors-screen__progress">{{ done }} / {{ COLORS.length }}</div>
    </header>

    <div class="colors-screen__stage">
      <ColorBoard
        v-if="currentColor"
        :key="`${currentColor.name}-${completions.length}`"
        :entry="currentColor"
        :pool="COLORS"
        @complete="onComplete"
      />
      <p v-else class="colors-screen__empty">Plus de couleurs !</p>
    </div>

    <CelebrationOverlay
      :show="showCelebration"
      :title="currentColor ? currentColor.name.toLowerCase() : ''"
      background="#37474F"
      next-label="Couleur suivante →"
      @next="next"
    >
      <div
        v-if="currentColor"
        class="colors-screen__swatch"
        :style="{ background: currentColor.hex }"
      />
    </CelebrationOverlay>
  </main>
</template>

<style lang="scss" scoped>
@use '~/assets/styles/variables' as *;

.colors-screen {
  min-height: 100dvh;
  background: $bg-colors;
  color: white;
  display: flex;
  flex-direction: column;
}

.colors-screen__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 20px 24px;

  @media (max-width: 480px) {
    padding: 12px 16px;
  }
}

.colors-screen__back {
  font-family: $font-body;
  color: white;
  text-decoration: none;
  opacity: 0.85;
  font-size: 1rem;

  &:hover {
    opacity: 1;
  }
}

.colors-screen__progress {
  font-family: $font-title;
  font-size: 1.25rem;
  opacity: 0.9;
}

.colors-screen__stage {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;

  @media (max-width: 480px) {
    padding: 12px;
  }
}

.colors-screen__empty {
  font-family: $font-body;
  font-size: 1.1rem;
  opacity: 0.85;
}

.colors-screen__swatch {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  box-shadow: inset 0 0 0 3px rgba(255, 255, 255, 0.15);
}
</style>
