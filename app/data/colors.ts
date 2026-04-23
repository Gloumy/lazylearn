export interface ColorEntry {
  name: string
  hex: string
}

export const COLORS: ColorEntry[] = [
  { name: 'ROUGE',  hex: '#E53935' },
  { name: 'BLEU',   hex: '#1E88E5' },
  { name: 'VERT',   hex: '#43A047' },
  { name: 'JAUNE',  hex: '#FDD835' },
  { name: 'ORANGE', hex: '#FB8C00' },
  { name: 'VIOLET', hex: '#8E24AA' },
  { name: 'ROSE',   hex: '#EC407A' },
  { name: 'MARRON', hex: '#6D4C41' },
  { name: 'NOIR',   hex: '#212121' },
  { name: 'BLANC',  hex: '#FAFAFA' },
]

export const TOTAL_COLORS = COLORS.length
