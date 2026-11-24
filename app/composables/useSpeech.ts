// Choix de voix, mis en cache au niveau du module.
// Chrome renvoie une liste vide à getVoices() tant que l'événement
// `voiceschanged` n'est pas passé : sans ce cache, la 1ʳᵉ phrase partait
// avec la voix par défaut (souvent anglaise).
let cachedVoice: SpeechSynthesisVoice | null = null
let listening = false

const QUALITY_HINTS = ['natural', 'neural', 'premium', 'enhanced', 'google', 'amélie', 'thomas']

function scoreVoice(v: SpeechSynthesisVoice): number {
  const lang = v.lang.toLowerCase().replace('_', '-')
  if (!lang.startsWith('fr')) return -1
  let score = 0
  // Une voix belge dit naturellement septante / nonante.
  if (lang === 'fr-be') score += 30
  else if (lang === 'fr-fr') score += 20
  else score += 10
  const name = v.name.toLowerCase()
  if (QUALITY_HINTS.some(h => name.includes(h))) score += 5
  if (v.localService) score += 1
  return score
}

function pickVoice(): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis.getVoices()
  let best: SpeechSynthesisVoice | null = null
  let bestScore = -1
  for (const v of voices) {
    const s = scoreVoice(v)
    if (s > bestScore) {
      best = v
      bestScore = s
    }
  }
  return best
}

function ensureVoice(): SpeechSynthesisVoice | null {
  const synth = window.speechSynthesis
  if (!listening) {
    listening = true
    synth.addEventListener?.('voiceschanged', () => {
      cachedVoice = pickVoice()
    })
  }
  if (!cachedVoice) cachedVoice = pickVoice()
  return cachedVoice
}

export function useSpeech() {
  const supported = typeof window !== 'undefined' && 'speechSynthesis' in window

  function speak(text: string, opts: { rate?: number; pitch?: number } = {}) {
    if (!supported) return
    const synth = window.speechSynthesis
    synth.cancel()
    const utter = new SpeechSynthesisUtterance(text)
    const voice = ensureVoice()
    utter.voice = voice
    utter.lang = voice?.lang ?? 'fr-FR'
    utter.rate = opts.rate ?? 1
    utter.pitch = opts.pitch ?? 1
    synth.speak(utter)
  }

  function cancel() {
    if (!supported) return
    window.speechSynthesis.cancel()
  }

  // Précharge la liste des voix dès l'utilisation du composable.
  if (supported) ensureVoice()

  return { speak, cancel }
}
