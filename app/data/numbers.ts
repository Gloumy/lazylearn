export interface NumberRange {
  id: string
  start: number
  end: number
}

export const NUMBER_RANGES: NumberRange[] = Array.from({ length: 10 }, (_, i) => {
  const start = i * 10 + 1
  const end = start + 9
  return { id: `${start}-${end}`, start, end }
})

export const TOTAL_RANGES = NUMBER_RANGES.length

export function rangeValues(range: NumberRange): number[] {
  return Array.from({ length: range.end - range.start + 1 }, (_, i) => range.start + i)
}
