export type WordTheme = 'animaux' | 'nature' | 'famille' | 'nourriture' | 'objets'
export type WordLevel = 1 | 2 | 3

export interface WordEntry {
  word: string
  article: 'le' | 'la' | 'un' | 'une'
  emoji: string
  theme: WordTheme
  level: WordLevel
}

export const WORDS: WordEntry[] = [
  // Niveau 1 — 3 lettres
  { word: 'BUS', article: 'le', emoji: '🚌', theme: 'objets', level: 1 },
  { word: 'MER', article: 'la', emoji: '🌊', theme: 'nature', level: 1 },
  { word: 'NEZ', article: 'le', emoji: '👃', theme: 'famille', level: 1 },
  { word: 'FEU', article: 'le', emoji: '🔥', theme: 'nature', level: 1 },
  { word: 'ROI', article: 'le', emoji: '👑', theme: 'objets', level: 1 },
  { word: 'COQ', article: 'le', emoji: '🐓', theme: 'animaux', level: 1 },
  { word: 'LIT', article: 'le', emoji: '🛏️', theme: 'objets', level: 1 },
  { word: 'RAT', article: 'le', emoji: '🐀', theme: 'animaux', level: 1 },
  { word: 'OEUF', article: 'un', emoji: '🥚', theme: 'nourriture', level: 1 },
  { word: 'ILE', article: 'une', emoji: '🏝️', theme: 'nature', level: 1 },

  // Niveau 2 — 4 lettres
  { word: 'CHAT', article: 'le', emoji: '🐱', theme: 'animaux', level: 2 },
  { word: 'LUNE', article: 'la', emoji: '🌙', theme: 'nature', level: 2 },
  { word: 'MAIN', article: 'la', emoji: '✋', theme: 'famille', level: 2 },
  { word: 'PIED', article: 'le', emoji: '🦶', theme: 'famille', level: 2 },
  { word: 'LOUP', article: 'le', emoji: '🐺', theme: 'animaux', level: 2 },
  { word: 'OURS', article: 'un', emoji: '🐻', theme: 'animaux', level: 2 },
  { word: 'ROSE', article: 'une', emoji: '🌹', theme: 'nature', level: 2 },
  { word: 'PAIN', article: 'le', emoji: '🍞', theme: 'nourriture', level: 2 },
  { word: 'DENT', article: 'la', emoji: '🦷', theme: 'famille', level: 2 },
  { word: 'VELO', article: 'le', emoji: '🚲', theme: 'objets', level: 2 },

  // Niveau 3 — 5 à 6 lettres
  { word: 'CHIEN', article: 'le', emoji: '🐶', theme: 'animaux', level: 3 },
  { word: 'ARBRE', article: 'un', emoji: '🌳', theme: 'nature', level: 3 },
  { word: 'FLEUR', article: 'la', emoji: '🌸', theme: 'nature', level: 3 },
  { word: 'POMME', article: 'la', emoji: '🍎', theme: 'nourriture', level: 3 },
  { word: 'LAPIN', article: 'le', emoji: '🐰', theme: 'animaux', level: 3 },
  { word: 'TIGRE', article: 'le', emoji: '🐯', theme: 'animaux', level: 3 },
  { word: 'PANDA', article: 'le', emoji: '🐼', theme: 'animaux', level: 3 },
  { word: 'SOLEIL', article: 'le', emoji: '☀️', theme: 'nature', level: 3 },
  { word: 'GIRAFE', article: 'la', emoji: '🦒', theme: 'animaux', level: 3 },
  { word: 'BANANE', article: 'la', emoji: '🍌', theme: 'nourriture', level: 3 },
]
