<script setup lang="ts">
import { SYLLABLES } from '~/data/syllables'

const CONSONANTS = ['b','c','d','f','g','h','j','l','m','n','p','r','s','t','v','z']
const VOWELS = ['a','à','e','é','è','ê','i','o','u','ou','au','eu','ai','oi']

const CONSONANT_COLORS = [
  '#FF6B6B', '#FF9F43', '#26de81',
  '#45aaf2', '#a55eea', '#2bcbba',
  '#FC427B', '#5C6BC0', '#8BC34A',
]
const VOWEL_COLOR = '#FECA57'

function colorFor(letter: string, variant: 'consonant' | 'vowel') {
  if (variant === 'vowel') return VOWEL_COLOR
  const h = letter.charCodeAt(0) - 97
  return CONSONANT_COLORS[((h % CONSONANT_COLORS.length) + CONSONANT_COLORS.length) % CONSONANT_COLORS.length]!
}

const route = useRoute()
const profileId = Number(route.params.profile)

const { refresh, complete, isCompleted, completedCount } = useProgress(profileId)
await refresh()

const { speak } = useSpeech()

interface ZoneLetter {
  id: number
  letter: string
  color: string
}
const zone = ref<ZoneLetter[]>([])
let nextId = 0

const composition = computed(
  () => zone.value.map(z => z.letter).join('').toLowerCase(),
)
const isValid = computed(
  () => composition.value.length >= 2 && SYLLABLES.has(composition.value),
)

watch(isValid, async (v, prev) => {
  if (v && !prev) {
    speak(composition.value, { rate: 0.8 })
    if (!isCompleted('syllables', composition.value)) {
      await complete('syllables', composition.value)
    }
  }
})

interface DragData {
  letter: string
  variant: 'consonant' | 'vowel'
}

const { dragged, pointer, hoverTargetId, startDrag } = useDragDrop<DragData>({
  onDrop(item, targetId) {
    if (targetId !== 'syllable-zone') return
    if (zone.value.length >= 4) return
    zone.value.push({
      id: nextId++,
      letter: item.letter,
      color: colorFor(item.letter, item.variant),
    })
  },
})

function removeLetter(id: number) {
  zone.value = zone.value.filter(z => z.id !== id)
}

function clearZone() {
  zone.value = []
}

function replay() {
  if (isValid.value) speak(composition.value, { rate: 0.8 })
}

function onBankDragStart(letter: string, variant: 'consonant' | 'vowel', event: PointerEvent) {
  startDrag({ letter, variant }, event)
}
</script>

<template>
  <main class="syllables-screen">
    <header class="syllables-screen__header">
      <NuxtLink :to="`/${profileId}`" class="syllables-screen__back">← Menu</NuxtLink>
      <div class="syllables-screen__progress">
        {{ completedCount('syllables') }} syllabes découvertes
      </div>
    </header>

    <section class="syllables-screen__stage">
      <SyllableZone
        :letters="zone"
        :valid="isValid"
        :hovering="hoverTargetId === 'syllable-zone' && dragged !== null"
        @remove="removeLetter"
      />
      <div class="syllables-screen__buttons">
        <button
          class="syllables-screen__btn syllables-screen__btn--audio"
          :disabled="!isValid"
          aria-label="Réécouter la syllabe"
          @click="replay"
        >
          🔊
        </button>
        <button
          class="syllables-screen__btn"
          :disabled="!zone.length"
          @click="clearZone"
        >
          Vider
        </button>
      </div>
    </section>

    <section class="syllables-screen__banks">
      <LetterBank
        label="Voyelles"
        :letters="VOWELS"
        variant="vowel"
        @drag-start="(l, e) => onBankDragStart(l, 'vowel', e)"
      />
      <LetterBank
        label="Consonnes"
        :letters="CONSONANTS"
        variant="consonant"
        @drag-start="(l, e) => onBankDragStart(l, 'consonant', e)"
      />
    </section>

    <Teleport v-if="dragged" to="body">
      <div
        class="drag-ghost"
        :style="{
          left: `${pointer.x - dragged.offsetX}px`,
          top: `${pointer.y - dragged.offsetY}px`,
          width: `${dragged.width}px`,
          height: `${dragged.height}px`,
          background: colorFor(dragged.data.letter, dragged.data.variant),
          fontSize: dragged.data.letter.length > 1 ? '1.4rem' : '2.25rem',
        }"
      >
        {{ dragged.data.letter }}
      </div>
    </Teleport>
  </main>
</template>

<style lang="scss" scoped>
@use '~/assets/styles/variables' as *;

.syllables-screen {
  min-height: 100dvh;
  background: $bg-syllables;
  color: white;
  display: flex;
  flex-direction: column;
  padding: 0 24px 24px;
}

.syllables-screen__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 0;
  flex-wrap: wrap;
  gap: 12px;
}

.syllables-screen__back {
  font-family: $font-body;
  color: white;
  text-decoration: none;
  opacity: 0.85;
  font-size: 1rem;

  &:hover {
    opacity: 1;
  }
}

.syllables-screen__progress {
  font-family: $font-title;
  font-size: 1.1rem;
  opacity: 0.9;
}

.syllables-screen__stage {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  margin-bottom: 32px;
}

.syllables-screen__buttons {
  display: flex;
  gap: 12px;
}

.syllables-screen__btn {
  padding: 12px 20px;
  font-family: $font-body;
  font-weight: 600;
  font-size: 1rem;
  color: white;
  background: rgba(255, 255, 255, 0.15);
  border-radius: $radius-btn;
  transition: background 150ms ease;

  &:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.25);
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  &--audio {
    font-size: 1.3rem;
    padding: 12px 18px;
  }
}

.syllables-screen__banks {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 16px;
  align-items: start;

  @media (max-width: 860px) {
    grid-template-columns: 1fr;
  }
}
</style>
