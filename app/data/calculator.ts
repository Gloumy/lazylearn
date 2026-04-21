// Opérateurs affichés (Unicode — pas d'hyphen ni d'astérisque).
export const OPERATORS = ['+', '−', '×', '÷'] as const
export type Operator = typeof OPERATORS[number]

export const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] as const

export const DIGIT_COLORS = [
  '#FF6B6B', '#FF9F43', '#FECA57', '#26de81', '#45aaf2',
  '#a55eea', '#2bcbba', '#FC427B', '#5C6BC0', '#8BC34A',
]

export const OPERATOR_COLORS: Record<Operator, string> = {
  '+': '#26de81',
  '−': '#FF6B6B',
  '×': '#45aaf2',
  '÷': '#a55eea',
}

export const OPERATOR_WORDS: Record<Operator, string> = {
  '+': 'plus',
  '−': 'moins',
  '×': 'fois',
  '÷': 'divisé par',
}

// Retourne null pour une division non entière ou une division par zéro
// — pas de résultat affiché dans ce cas, message neutre côté UI.
export function compute(a: number, op: Operator, b: number): number | null {
  switch (op) {
    case '+': return a + b
    case '−': return a - b
    case '×': return a * b
    case '÷':
      if (b === 0 || a % b !== 0) return null
      return a / b
  }
}

export function operationRef(a: number, op: Operator, b: number): string {
  return `${a}${op}${b}`
}

// Nombre total d'opérations (a op b) avec a, b ∈ 0..9 produisant un résultat.
// Calculé au chargement pour le compteur de progression.
export const TOTAL_OPERATIONS = (() => {
  let n = 0
  for (let a = 0; a <= 9; a++) {
    for (let b = 0; b <= 9; b++) {
      for (const op of OPERATORS) {
        if (compute(a, op, b) !== null) n++
      }
    }
  }
  return n
})()
