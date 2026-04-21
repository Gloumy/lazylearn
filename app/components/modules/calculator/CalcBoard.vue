<script setup lang="ts">
import { OPERATOR_COLORS, type Operator } from '~/data/calculator'

type SlotKey = 'a' | 'op' | 'b'

const props = defineProps<{
  slotA: number | null
  slotOp: Operator | null
  slotB: number | null
  result: number | null
  allFilled: boolean
  hoverSlot: SlotKey | null
  dragging: boolean
  numberColor: (n: number) => string
}>()

const emit = defineEmits<{ (e: 'clear', which: SlotKey): void }>()

function clear(which: SlotKey) {
  emit('clear', which)
}
</script>

<template>
  <div class="calc-board">
    <div class="calc-board__row">
      <button
        class="calc-board__slot"
        :class="{
          'calc-board__slot--hover': dragging && hoverSlot === 'a',
          'calc-board__slot--filled': slotA !== null,
        }"
        :style="slotA !== null ? { background: numberColor(slotA) } : undefined"
        data-drop-id="slot-a"
        :aria-label="slotA !== null ? `Retirer ${slotA}` : 'Déposer un chiffre'"
        @click="slotA !== null && clear('a')"
      >
        <span v-if="slotA !== null">{{ slotA }}</span>
        <span v-else class="calc-board__placeholder">?</span>
      </button>

      <button
        class="calc-board__slot calc-board__slot--op"
        :class="{
          'calc-board__slot--hover': dragging && hoverSlot === 'op',
          'calc-board__slot--filled': slotOp !== null,
        }"
        :style="slotOp !== null ? { background: OPERATOR_COLORS[slotOp] } : undefined"
        data-drop-id="slot-op"
        :aria-label="slotOp !== null ? `Retirer ${slotOp}` : 'Déposer un opérateur'"
        @click="slotOp !== null && clear('op')"
      >
        <span v-if="slotOp !== null">{{ slotOp }}</span>
        <span v-else class="calc-board__placeholder">?</span>
      </button>

      <button
        class="calc-board__slot"
        :class="{
          'calc-board__slot--hover': dragging && hoverSlot === 'b',
          'calc-board__slot--filled': slotB !== null,
        }"
        :style="slotB !== null ? { background: numberColor(slotB) } : undefined"
        data-drop-id="slot-b"
        :aria-label="slotB !== null ? `Retirer ${slotB}` : 'Déposer un chiffre'"
        @click="slotB !== null && clear('b')"
      >
        <span v-if="slotB !== null">{{ slotB }}</span>
        <span v-else class="calc-board__placeholder">?</span>
      </button>

      <span class="calc-board__equals">=</span>

      <div
        class="calc-board__result"
        :class="{ 'calc-board__result--ready': allFilled && result !== null }"
      >
        <span v-if="allFilled && result !== null" class="calc-board__result-value">
          {{ result }}
        </span>
        <span v-else-if="allFilled && result === null" class="calc-board__result-muted">
          —
        </span>
        <span v-else class="calc-board__result-muted">?</span>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '~/assets/styles/variables' as *;

.calc-board {
  display: flex;
  justify-content: center;
  padding: 24px 16px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: $radius-card;
  width: 100%;
}

.calc-board__row {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
}

.calc-board__slot {
  width: 80px;
  height: 80px;
  border-radius: $radius-tile;
  background: rgba(255, 255, 255, 0.08);
  border: 3px dashed rgba(255, 255, 255, 0.35);
  font-family: $font-title;
  font-size: 2.4rem;
  color: white;
  transition: border-color 150ms ease, background 150ms ease, transform 120ms ease;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;

  &--hover {
    border-color: rgba(255, 255, 255, 0.9);
    background: rgba(255, 255, 255, 0.18);
  }

  &--filled {
    border-style: solid;
    border-color: transparent;
    box-shadow: 0 4px 0 rgba(0, 0, 0, 0.25);

    &:hover {
      transform: translateY(-2px);
    }
  }
}

.calc-board__placeholder {
  font-size: 1.8rem;
  color: rgba(255, 255, 255, 0.4);
}

.calc-board__equals {
  font-family: $font-title;
  font-size: 2.6rem;
  padding: 0 4px;
}

.calc-board__result {
  min-width: 110px;
  height: 80px;
  border-radius: $radius-tile;
  background: rgba(255, 255, 255, 0.12);
  font-family: $font-title;
  font-size: 2.6rem;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 16px;
  box-sizing: border-box;
  transition: background 200ms ease, transform 200ms ease;

  &--ready {
    background: #FECA57;
    color: #7a3000;
    transform: scale(1.02);
  }
}

.calc-board__result-muted {
  color: rgba(255, 255, 255, 0.45);
  font-size: 2rem;
}
</style>
