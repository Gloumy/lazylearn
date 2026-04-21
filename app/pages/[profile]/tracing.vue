<script setup lang="ts">
const route = useRoute()
const profileId = Number(route.params.profile)

const LETTERS = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i))

const { completions, refresh: refreshProgress, complete } = useProgress(profileId)
await refreshProgress()

const { speak } = useSpeech()

const current = ref<string>('A')

const completedSet = computed(
  () => new Set(completions.value.filter(c => c.module === 'tracing').map(c => c.ref)),
)

const canvasRef = ref<{ clear: () => void } | null>(null)

function selectLetter(letter: string) {
  current.value = letter
}

function clearCanvas() {
  canvasRef.value?.clear()
}

async function next() {
  await complete('tracing', current.value)
  const idx = LETTERS.indexOf(current.value)
  current.value = LETTERS[(idx + 1) % LETTERS.length]!
}

function speakCurrent() {
  speak(current.value, { rate: 0.8 })
}
</script>

<template>
  <main class="tracing-screen">
    <header class="tracing-screen__header">
      <NuxtLink :to="`/${profileId}`" class="tracing-screen__back">← Menu</NuxtLink>
      <div class="tracing-screen__progress">
        {{ completedSet.size }} / {{ LETTERS.length }}
      </div>
    </header>

    <div class="tracing-screen__layout">
      <aside class="tracing-screen__nav">
        <LetterNav
          :current="current"
          :completed="completedSet"
          @select="selectLetter"
        />
      </aside>

      <section class="tracing-screen__main">
        <TracingCanvas ref="canvasRef" :letter="current" />
        <div class="tracing-screen__buttons">
          <button
            class="tracing-screen__btn tracing-screen__btn--audio"
            aria-label="Écouter la lettre"
            @click="speakCurrent"
          >
            🔊
          </button>
          <button class="tracing-screen__btn" @click="clearCanvas">Effacer</button>
          <button
            class="tracing-screen__btn tracing-screen__btn--primary"
            @click="next"
          >
            Suivant →
          </button>
        </div>
      </section>

      <aside class="tracing-screen__ref">
        <svg
          class="tracing-screen__ref-svg"
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid meet"
          aria-hidden="true"
        >
          <text x="50" y="56" text-anchor="middle" dominant-baseline="middle">
            {{ current }}
          </text>
        </svg>
      </aside>
    </div>
  </main>
</template>

<style lang="scss" scoped>
@use '~/assets/styles/variables' as *;

.tracing-screen {
  min-height: 100dvh;
  background: $bg-tracing;
  color: white;
  display: flex;
  flex-direction: column;
}

.tracing-screen__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
}

.tracing-screen__back {
  font-family: $font-body;
  color: white;
  text-decoration: none;
  opacity: 0.85;
  font-size: 1rem;

  &:hover {
    opacity: 1;
  }
}

.tracing-screen__progress {
  font-family: $font-title;
  font-size: 1.25rem;
  opacity: 0.9;
}

.tracing-screen__layout {
  flex: 1;
  display: grid;
  grid-template-columns: minmax(220px, 300px) 1fr minmax(180px, 260px);
  gap: 20px;
  padding: 0 24px 24px;

  @media (max-width: 860px) {
    grid-template-columns: 1fr;

    .tracing-screen__ref  { order: 1; }
    .tracing-screen__main { order: 2; }
    .tracing-screen__nav  { order: 3; }
  }
}

.tracing-screen__main {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.tracing-screen__buttons {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
}

.tracing-screen__btn {
  padding: 12px 20px;
  font-family: $font-body;
  font-weight: 600;
  font-size: 1rem;
  color: white;
  background: rgba(255, 255, 255, 0.15);
  border-radius: $radius-btn;
  transition: background 150ms ease, filter 150ms ease;

  &:hover {
    background: rgba(255, 255, 255, 0.25);
  }

  &--audio {
    padding: 12px 16px;
    font-size: 1.4rem;
  }

  &--primary {
    background: #FECA57;
    color: #1B5E20;

    &:hover {
      background: #FECA57;
      filter: brightness(1.05);
    }
  }
}

.tracing-screen__ref {
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.2);
  border-radius: $radius-card;
  padding: 24px;

  @media (max-width: 860px) {
    padding: 10px 16px;
  }
}

.tracing-screen__ref-svg {
  width: 100%;
  max-width: 220px;
  aspect-ratio: 1 / 1;

  @media (max-width: 860px) {
    max-width: 90px;
  }

  text {
    font-family: $font-title;
    font-weight: 800;
    font-size: 70px;
    fill: #FECA57;
  }
}
</style>
