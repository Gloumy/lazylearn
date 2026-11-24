// Registre des modules affichés dans le menu.
// `enabled: false` → retiré du menu (la page reste accessible par URL).

export type Audience = 'grands' | 'petits'

export interface ModuleDef {
  key: string
  title: string
  emoji: string
  bg: string
  audience: Audience
  enabled: boolean
}

export const MODULES: ModuleDef[] = [
  // Pour la grande (lectrice débutante, 1ère primaire)
  { key: 'sounds',     title: 'Les sons',         emoji: '👂', bg: '#880E4F', audience: 'grands', enabled: true },
  { key: 'numbers',    title: 'Chiffres',         emoji: '🔢', bg: '#00695C', audience: 'grands', enabled: true },

  // Pour la petite (maternelle, ne lit pas) : tout passe par l'audio
  { key: 'pictures',   title: 'Écoute et trouve', emoji: '🔍', bg: '#4A148C', audience: 'petits', enabled: true },
  { key: 'colors',     title: 'Couleurs',         emoji: '🎨', bg: '#263238', audience: 'petits', enabled: true },
  { key: 'tracing',    title: 'Tracer',           emoji: '✏️', bg: '#1B5E20', audience: 'petits', enabled: true },

  // Désactivés : plus adaptés au niveau actuel
  { key: 'words',      title: 'Les mots',         emoji: '📖', bg: '#1A237E', audience: 'grands', enabled: false },
  { key: 'syllables',  title: 'Syllabes',         emoji: '🔤', bg: '#006064', audience: 'grands', enabled: false },
  { key: 'calculator', title: 'Calcul',           emoji: '🧮', bg: '#E65100', audience: 'grands', enabled: false },
]

export const AUDIENCES: { key: Audience; title: string }[] = [
  { key: 'grands', title: '🎒 Pour les grands' },
  { key: 'petits', title: '🧸 Pour les petits' },
]
