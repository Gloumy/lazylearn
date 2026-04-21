<script setup lang="ts">
import {
  DIGITS,
  OPERATORS,
  OPERATOR_COLORS,
  OPERATOR_WORDS,
  DIGIT_COLORS,
  TOTAL_OPERATIONS,
  compute,
  operationRef,
  type Operator,
} from '~/data/calculator'

const route = useRoute()
const profileId = Number(route.params.profile)

const { refresh, complete, isCompleted, completedCount } = useProgress(profileId)
await refresh()

const { speak } = useSpeech()

type SlotKey = 'a' | 'op' | 'b'

const slotA = ref<number | null>(null)
const slotOp = ref<Operator | null>(null)
const slotB = ref<number | null>(null)

const allFilled = computed(
  () => slotA.value !== null && slotOp.value !== null && slotB.value !== null,
)

const result = computed(() => {
  if (!allFilled.value) return null
  return compute(slotA.value!, slotOp.value!, slotB.value!)
})

function numberColor(n: number) {
  return DIGIT_COLORS[n % DIGIT_COLORS.length]!
}

// Dès que l'opération est complète et valide : énoncer + enregistrer.
watch([slotA, slotOp, slotB], async () => {
  if (!allFilled.value) return
  const res = result.value
  if (res === null) return // division non entière → message neutre, pas de TTS
  const ref = operationRef(slotA.value!, slotOp.value!, slotB.value!)
  speak(
    `${slotA.value} ${OPERATOR_WORDS[slotOp.value!]} ${slotB.value} égale ${res}`,
    { rate: 0.85 },
  )
  if (!isCompleted('calculator', ref)) {
    await complete('calculator', ref)
  }
})

interface DragNumber { kind: 'number'; value: number }
interface DragOperator { kind: 'operator'; value: Operator }
type DragData = DragNumber | DragOperator

const { dragged, pointer, hoverTargetId, startDrag } = useDragDrop<DragData>({
  onDrop(item, targetId) {
    if (item.kind === 'number') {
      if (targetId === 'slot-a') slotA.value = item.value
      else if (targetId === 'slot-b') slotB.value = item.value
    } else if (item.kind === 'operator') {
      if (targetId === 'slot-op') slotOp.value = item.value
    }
  },
})

function hoverSlotKey(targetId: string | null): SlotKey | null {
  if (targetId === 'slot-a') return 'a'
  if (targetId === 'slot-op') return 'op'
  if (targetId === 'slot-b') return 'b'
  return null
}

function clearSlot(which: SlotKey) {
  if (which === 'a') slotA.value = null
  else if (which === 'op') slotOp.value = null
  else slotB.value = null
}

function clearAll() {
  slotA.value = null
  slotOp.value = null
  slotB.value = null
}

function replay() {
  if (!allFilled.value || result.value === null) return
  speak(
    `${slotA.value} ${OPERATOR_WORDS[slotOp.value!]} ${slotB.value} égale ${result.value}`,
    { rate: 0.85 },
  )
}

function onNumberDragStart(value: number, event: PointerEvent) {
  startDrag({ kind: 'number', value }, event)
}

function onOperatorDragStart(value: Operator, event: PointerEvent) {
  startDrag({ kind: 'operator', value }, event)
}

const dragBackground = computed(() => {
  if (!dragged.value) return 'transparent'
  const d = dragged.value.data
  return d.kind === 'number' ? numberColor(d.value) : OPERATOR_COLORS[d.value]
})
</script>

<template>
  <main class="calc-screen">
    <header class="calc-screen__header">
      <NuxtLink :to="`/${profileId}`" class="calc-screen__back">← Menu</NuxtLink>
      <div class="calc-screen__progress">
        {{ completedCount('calculator') }} / {{ TOTAL_OPERATIONS }} opérations
      </div>
    </header>

    <section class="calc-screen__stage">
      <CalcBoard
        :slot-a="slotA"
        :slot-op="slotOp"
        :slot-b="slotB"
        :result="result"
        :all-filled="allFilled"
        :hover-slot="dragged ? hoverSlotKey(hoverTargetId) : null"
        :dragging="dragged !== null"
        :number-color="numberColor"
        @clear="clearSlot"
      />

      <div class="calc-screen__buttons">
        <button
          class="calc-screen__btn calc-screen__btn--audio"
          :disabled="!allFilled || result === null"
          aria-label="Réécouter l'opération"
          @click="replay"
        >
          🔊
        </button>
        <button
          class="calc-screen__btn"
          :disabled="slotA === null && slotOp === null && slotB === null"
          @click="clearAll"
        >
          Tout effacer
        </button>
      </div>
    </section>

    <section class="calc-screen__banks">
      <div class="calc-screen__bank">
        <h3 class="calc-screen__label">Chiffres</h3>
        <div class="calc-screen__grid calc-screen__grid--numbers">
          <NumberTile
            v-for="n in DIGITS"
            :key="n"
            :value="n"
            :color="numberColor(n)"
            @drag-start="(e) => onNumberDragStart(n, e)"
          />
        </div>
      </div>
      <div class="calc-screen__bank">
        <h3 class="calc-screen__label">Opérateurs</h3>
        <div class="calc-screen__grid calc-screen__grid--ops">
          <OperatorTile
            v-for="op in OPERATORS"
            :key="op"
            :op="op"
            @drag-start="(e) => onOperatorDragStart(op, e)"
          />
        </div>
      </div>
    </section>

    <Teleport v-if="dragged" to="body">
      <div
        class="drag-ghost"
        :style="{
          left: `${pointer.x - dragged.offsetX}px`,
          top: `${pointer.y - dragged.offsetY}px`,
          width: `${dragged.width}px`,
          height: `${dragged.height}px`,
          background: dragBackground,
          fontSize: '2rem',
        }"
      >
        {{ dragged.data.value }}
      </div>
    </Teleport>
  </main>
</template>

<style lang="scss" scoped>
@use '~/assets/styles/variables' as *;

.calc-screen {
  min-height: 100dvh;
  background: $bg-calculator;
  color: white;
  display: flex;
  flex-direction: column;
  padding: 0 24px 24px;
  gap: 24px;
}

.calc-screen__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 0;
  flex-wrap: wrap;
  gap: 12px;
}

.calc-screen__back {
  font-family: $font-body;
  color: white;
  text-decoration: none;
  opacity: 0.85;
  font-size: 1rem;

  &:hover {
    opacity: 1;
  }
}

.calc-screen__progress {
  font-family: $font-title;
  font-size: 1.1rem;
  opacity: 0.9;
}

.calc-screen__stage {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  max-width: 720px;
  width: 100%;
  margin: 0 auto;
}

.calc-screen__buttons {
  display: flex;
  gap: 12px;
}

.calc-screen__btn {
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

.calc-screen__banks {
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 720px;
  width: 100%;
  margin: 0 auto;
}

.calc-screen__bank {
  background: rgba(255, 255, 255, 0.08);
  border-radius: $radius-card;
  padding: 16px;
}

.calc-screen__label {
  font-family: $font-title;
  font-size: 1rem;
  margin-bottom: 12px;
  color: rgba(255, 255, 255, 0.85);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.calc-screen__grid {
  display: grid;
  gap: 10px;
  justify-content: center;

  &--numbers {
    grid-template-columns: repeat(auto-fill, 64px);
  }

  &--ops {
    grid-template-columns: repeat(auto-fill, 64px);
  }
}
</style>
