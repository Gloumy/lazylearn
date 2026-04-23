// Syllabes chargées au runtime depuis /public/data/syllables.json
// → mise à jour du contenu sans rebuild.
// Les digrammes (ou, au, eu, ai, oi) sont des graphèmes d'un seul son :
// ils peuvent être construits depuis leur propre tuile OU depuis deux tuiles voyelles.
let cache: Promise<Set<string>> | null = null

export function loadSyllables(): Promise<Set<string>> {
  if (!cache) {
    cache = $fetch<string[]>('/data/syllables.json').then(arr => new Set(arr))
  }
  return cache
}
