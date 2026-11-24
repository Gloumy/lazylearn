// Nombres en toutes lettres, à la belge (septante, nonante) : une voix
// fr-FR lit "70" "soixante-dix", mais lit correctement le mot "septante".
const UNITS = [
  'zéro', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf',
  'dix', 'onze', 'douze', 'treize', 'quatorze', 'quinze', 'seize',
]
const TENS: Record<number, string> = {
  2: 'vingt', 3: 'trente', 4: 'quarante', 5: 'cinquante',
  6: 'soixante', 7: 'septante', 8: 'quatre-vingt', 9: 'nonante',
}

export function numberToWords(n: number): string {
  if (!Number.isInteger(n) || n < 0 || n > 999) return String(n)
  if (n <= 16) return UNITS[n]!
  if (n < 20) return `dix-${UNITS[n - 10]}`
  if (n === 80) return 'quatre-vingts'
  if (n < 100) {
    const t = Math.floor(n / 10)
    const u = n % 10
    if (u === 0) return TENS[t]!
    if (u === 1 && t !== 8) return `${TENS[t]} et un`
    return `${TENS[t]}-${UNITS[u]}`
  }
  const h = Math.floor(n / 100)
  const rest = n % 100
  const head = h === 1 ? 'cent' : `${UNITS[h]} cent${rest === 0 ? 's' : ''}`
  return rest === 0 ? head : `${head} ${numberToWords(rest)}`
}
