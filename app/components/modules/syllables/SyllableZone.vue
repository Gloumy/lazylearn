<script setup lang="ts">
interface ZoneLetter {
  id: number
  letter: string
  color: string
}

defineProps<{
  letters: ZoneLetter[]
  valid: boolean
  hovering: boolean
}>()

const emit = defineEmits<{
  (e: 'remove', id: number): void
}>()
</script>

<template>
  <div
    class="syllable-zone"
    data-drop-id="syllable-zone"
    :class="{
      'syllable-zone--valid': valid,
      'syllable-zone--hovering': hovering && !valid,
    }"
  >
    <div class="syllable-zone__inner">
      <template v-if="letters.length">
        <button
          v-for="l in letters"
          :key="l.id"
          class="syllable-zone__tile"
          :class="{ 'syllable-zone__tile--multi': l.letter.length > 1 }"
          :style="{ background: l.color }"
          :aria-label="`Retirer ${l.letter}`"
          @click="emit('remove', l.id)"
        >
          {{ l.letter }}
        </button>
      </template>
      <span v-else class="syllable-zone__placeholder">
        Glisse des lettres ici
      </span>
    </div>
    <Transition name="badge">
      <span v-if="valid" class="syllable-zone__badge">✓ Bravo !</span>
    </Transition>
  </div>
</template>

<style lang="scss" scoped>
@use '~/assets/styles/variables' as *;

.syllable-zone {
  position: relative;
  width: min(100%, 480px);
  min-height: 140px;
  padding: 20px 24px;
  background: rgba(0, 0, 0, 0.2);
  border: 3px dashed rgba(255, 255, 255, 0.3);
  border-radius: $radius-card;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: border-color 200ms ease, background 200ms ease;

  &--hovering {
    border-color: rgba(255, 255, 255, 0.7);
    background: rgba(255, 255, 255, 0.08);
  }

  &--valid {
    border-color: #4ade80;
    background: rgba(74, 222, 128, 0.15);
  }
}

.syllable-zone__inner {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
}

.syllable-zone__tile {
  width: 72px;
  height: 72px;
  border-radius: $radius-tile;
  font-family: $font-title;
  font-size: 2.25rem;
  color: white;
  box-shadow: 0 4px 0 rgba(0, 0, 0, 0.25);
  transition: transform 150ms ease, opacity 150ms ease;

  &:hover {
    transform: translateY(-2px);
  }

  &:active {
    opacity: 0.6;
  }

  &--multi {
    font-size: 1.4rem;
  }
}

.syllable-zone__placeholder {
  font-family: $font-body;
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.6);
}

.syllable-zone__badge {
  position: absolute;
  top: -16px;
  right: -8px;
  padding: 8px 16px;
  background: #4ade80;
  color: #006064;
  font-family: $font-title;
  font-weight: 800;
  font-size: 1rem;
  border-radius: $radius-btn;
  box-shadow: 0 4px 0 rgba(0, 0, 0, 0.25);
}

.badge-enter-active,
.badge-leave-active {
  transition: transform 300ms cubic-bezier(0.34, 1.56, 0.64, 1), opacity 200ms ease;
}
.badge-enter-from,
.badge-leave-to {
  transform: scale(0.5) translateY(10px);
  opacity: 0;
}
</style>
