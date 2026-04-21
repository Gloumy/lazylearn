export function useSpeech() {
  function speak(text: string, opts: { rate?: number; pitch?: number } = {}) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
    const synth = window.speechSynthesis
    synth.cancel()
    const utter = new SpeechSynthesisUtterance(text)
    utter.lang = 'fr-FR'
    const voice = synth.getVoices().find(v => v.lang.startsWith('fr'))
    if (voice) utter.voice = voice
    utter.rate = opts.rate ?? 1
    utter.pitch = opts.pitch ?? 1
    synth.speak(utter)
  }

  function cancel() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
  }

  return { speak, cancel }
}
