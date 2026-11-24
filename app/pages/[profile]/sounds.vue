<script setup lang="ts">
import { loadSounds } from '~/data/sounds'

const route = useRoute()
const profileId = Number(route.params.profile)

const { refresh: refreshProgress, complete, isCompleted, completedCount } = useProgress(profileId)
const [allSeries] = await Promise.all([loadSounds(), refreshProgress()])

const { speak } = useSpeech()

// Démarre sur la première série pas encore réussie.
const firstTodo = allSeries.findIndex(s => !isCompleted('sounds', s.id))
const index = ref(firstTodo === -1 ? 0 : firstTodo)
const round = ref(0)
const series = computed(() => allSeries[index.value] ?? null)
const showCelebration = ref(false)

function select(i: number) {
  showCelebration.value = false
  index.value = i
  round.value++
}

async function onComplete() {
  if (!series.value) return
  speak('Bravo, tout est bien rangé !', { rate: 0.9 })
  showCelebration.value = true
  await complete('sounds', series.value.id)
}

function next() {
  select((index.value + 1) % allSeries.length)
}
</script>

<template>
  <main class="sounds-screen">
    <header class="sounds-screen__header">
      <NuxtLink :to="`/${profileId}`" class="sounds-screen__back">← Menu</NuxtLink>
      <div class="sounds-screen__progress">
        {{ completedCount('sounds') }} / {{ allSeries.length }}
      </div>
    </header>

    <nav class="sounds-screen__series">
      <button
        v-for="(s, i) in allSeries"
        :key="s.id"
        class="sounds-screen__chip"
        :class="{ 'sounds-screen__chip--active': i === index }"
        @click="select(i)"
      >
        <span v-if="isCompleted('sounds', s.id)">✅</span>
        {{ s.title }}
      </button>
    </nav>

    <div class="sounds-screen__stage">
      <SoundBoard
        v-if="series"
        :key="`${series.id}-${round}`"
        :series="series"
        @complete="onComplete"
      />
      <p v-else class="sounds-screen__empty">Aucune série disponible.</p>
    </div>

    <CelebrationOverlay
      :show="showCelebration"
      emoji="👂"
      title="Bravo !"
      background="#4A0E2E"
      next-label="Série suivante →"
      @next="next"
    />
  </main>
</template>

<style lang="scss" scoped>
@use '~/assets/styles/variables' as *;

.sounds-screen {
  min-height: 100dvh;
  background: $bg-sounds;
  color: white;
  display: flex;
  flex-direction: column;
}

.sounds-screen__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 20px 24px 8px;

  @media (max-width: 480px) {
    padding: 12px 16px 4px;
  }
}

.sounds-screen__back {
  font-family: $font-body;
  color: white;
  text-decoration: none;
  opacity: 0.85;
  font-size: 1rem;

  &:hover {
    opacity: 1;
  }
}

.sounds-screen__progress {
  font-family: $font-title;
  font-size: 1.25rem;
  opacity: 0.9;
}

.sounds-screen__series {
  display: flex;
  gap: 8px;
  padding: 8px 24px;
  overflow-x: auto;
  scrollbar-width: none;

  @media (max-width: 480px) {
    padding: 6px 16px;
  }
}

.sounds-screen__chip {
  flex-shrink: 0;
  padding: 8px 14px;
  font-family: $font-body;
  font-weight: 600;
  font-size: 0.95rem;
  color: white;
  background: rgba(255, 255, 255, 0.1);
  border-radius: $radius-btn;
  white-space: nowrap;
  transition: background 150ms ease;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }

  &--active {
    background: rgba(255, 255, 255, 0.3);
  }
}

.sounds-screen__stage {
  flex: 1;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 16px 24px 24px;

  @media (max-width: 480px) {
    padding: 8px 12px 12px;
  }
}

.sounds-screen__empty {
  font-family: $font-body;
  font-size: 1.1rem;
  opacity: 0.85;
}
</style>
