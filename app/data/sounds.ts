// Données chargées au runtime depuis /public/data/sounds.json
// → ajouter une série = éditer le JSON sur le serveur, sans rebuild.
//
// Format d'un mot : les lettres qui font le son sont entre crochets,
// ex. "ro[s]e", "poi[ss]on", "b[on]b[on]". Elles sont surlignées une fois
// le mot rangé dans la bonne maison.

export interface SoundHouse {
  key: string
  label: string
  emoji?: string
  /** Texte lu par la TTS quand on touche la maison. */
  say: string
}

interface SoundWordRaw {
  word: string
  emoji: string
  house: string
}

interface SoundSeriesRaw {
  id: string
  title: string
  houses: SoundHouse[]
  words: SoundWordRaw[]
}

export interface Segment {
  text: string
  hl: boolean
}

export interface SoundWord {
  id: number
  text: string
  segments: Segment[]
  emoji: string
  house: string
}

export interface SoundSeries {
  id: string
  title: string
  houses: SoundHouse[]
  words: SoundWord[]
}

export function parseMarked(marked: string): Segment[] {
  const segments: Segment[] = []
  const re = /\[([^\]]+)\]/g
  let last = 0
  for (const m of marked.matchAll(re)) {
    if (m.index > last) segments.push({ text: marked.slice(last, m.index), hl: false })
    segments.push({ text: m[1]!, hl: true })
    last = m.index + m[0].length
  }
  if (last < marked.length) segments.push({ text: marked.slice(last), hl: false })
  return segments
}

function normalize(raw: SoundSeriesRaw): SoundSeries {
  return {
    id: raw.id,
    title: raw.title,
    houses: raw.houses,
    words: raw.words.map((w, i) => {
      const segments = parseMarked(w.word)
      return {
        id: i,
        text: segments.map(s => s.text).join(''),
        segments,
        emoji: w.emoji,
        house: w.house,
      }
    }),
  }
}

let cache: Promise<SoundSeries[]> | null = null

export function loadSounds(): Promise<SoundSeries[]> {
  if (!cache) {
    cache = $fetch<SoundSeriesRaw[]>('/data/sounds.json').then(list => list.map(normalize))
  }
  return cache
}
