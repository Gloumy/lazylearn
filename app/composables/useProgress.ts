interface ProgressEntry {
  id: number
  profileId: number
  module: string
  ref: string
  completedAt: string
}

export function useProgress(profileId: number) {
  const completions = ref<ProgressEntry[]>([])

  async function refresh() {
    completions.value = await $fetch<ProgressEntry[]>(`/api/progress/${profileId}`)
  }

  async function complete(module: string, ref: string) {
    await $fetch('/api/progress', {
      method: 'POST',
      body: { profileId, module, ref },
    })
    await refresh()
  }

  function isCompleted(module: string, ref: string) {
    return completions.value.some(c => c.module === module && c.ref === ref)
  }

  function completedCount(module: string) {
    const refs = new Set(
      completions.value.filter(c => c.module === module).map(c => c.ref),
    )
    return refs.size
  }

  return { completions, refresh, complete, isCompleted, completedCount }
}
