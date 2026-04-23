// Données chargées au runtime depuis /public/data/words.json
// → mise à jour du contenu sans rebuild.
export type WordTheme = 'animaux' | 'nature' | 'famille' | 'nourriture' | 'objets'
export type WordLevel = 1 | 2 | 3

export interface WordEntry {
  word: string
  article: 'le' | 'la' | 'un' | 'une'
  emoji: string
  theme: WordTheme
  level: WordLevel
}

let cache: Promise<WordEntry[]> | null = null

export function loadWords(): Promise<WordEntry[]> {
  if (!cache) cache = $fetch<WordEntry[]>('/data/words.json')
  return cache
}
