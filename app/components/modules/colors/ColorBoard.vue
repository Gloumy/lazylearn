<script setup lang="ts">
import type { ColorEntry } from '~/data/colors'

// Mode audio : la voix demande une couleur, l'enfant touche la bonne pastille.
// Aucune lecture nécessaire (public maternelle).
const props = defineProps<{ entry: ColorEntry; pool: ColorEntry[] }>()
const emit = defineEmits<{ (e: 'complete'): void }>()

const { speak } = useSpeech()

const choices = ref<ColorEntry[]>([])
const shakingName = ref<string | null>(null)
const locked = ref(false)

function prompt() {
  speak(`Montre-moi le ${props.entry.name.toLowerCase()}`, { rate: 0.9 })
}

function setup(entry: ColorEntry, pool: ColorEntry[]) {
  const distractors = shuffled(pool.filter(c => c.name !== entry.name)).slice(0, 3)
  choices.value = shuffled([entry, ...distractors])
  shakingName.value = null
  locked.value = false
}

watch(() => props.entry, e => setup(e, props.pool), { immediate: true })
onMounted(() => setTimeout(prompt, 350))

function pick(name: string) {
  if (locked.value) return
  if (name === props.entry.name) {
    locked.value = true
    emit('complete')
  } else {
    shakingName.value = name
    setTimeout(() => {
      if (shakingName.value === name) shakingName.value = null
    }, 450)
  }
}
</script>

<template>
  <div class="color-board">
    <ListenButton @click="prompt" />

    <div class="color-board__choices">
      <button
        v-for="c in choices"
        :key="c.name"
        class="color-board__swatch"
        :class="{ 'color-board__swatch--shake': shakingName === c.name }"
        :style="{ background: c.hex }"
        :aria-label="c.name"
        :disabled="locked"
        @click="pick(c.name)"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.color-board {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 36px;
  width: 100%;

  @media (max-width: 480px) {
    gap: 20px;
  }
}

.color-board__choices {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 28px;
  width: 100%;
  max-width: 440px;

  @media (max-width: 480px) {
    gap: 16px;
    max-width: 300px;
  }
}

.color-board__swatch {
  aspect-ratio: 1;
  border-radius: 50%;
  box-shadow: 0 8px 0 rgba(0, 0, 0, 0.35), inset 0 0 0 4px rgba(255, 255, 255, 0.15);
  transition: transform 120ms ease, box-shadow 120ms ease;

  &:active:not(:disabled) {
    transform: translateY(4px);
    box-shadow: 0 4px 0 rgba(0, 0, 0, 0.35), inset 0 0 0 4px rgba(255, 255, 255, 0.15);
  }

  &--shake {
    animation: shake 400ms ease;
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
