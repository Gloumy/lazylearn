<script setup lang="ts">
import type { Profile } from '~~/server/database/schema'
import { loadWords } from '~/data/words'
import { COLORS } from '~/data/colors'
import { TOTAL_RANGES } from '~/data/numbers'
import { loadSounds } from '~/data/sounds'
import { AUDIENCES, MODULES } from '~/data/modules'

const route = useRoute()
const id = Number(route.params.profile)

const { data: profiles } = await useFetch<Profile[]>('/api/profiles', {
  default: () => [],
})
const profile = computed(() => profiles.value.find(p => p.id === id))

const { refresh: refreshProgress, completedCount } = useProgress(id)
const [words, sounds] = await Promise.all([
  loadWords(),
  loadSounds(),
  refreshProgress(),
])

const totals: Record<string, number> = {
  sounds: sounds.length,
  numbers: TOTAL_RANGES,
  pictures: words.length,
  colors: COLORS.length,
  tracing: 26,
}

const sections = AUDIENCES.map(a => ({
  ...a,
  modules: MODULES.filter(m => m.enabled && m.audience === a.key).map(m => {
    const total = totals[m.key] ?? 0
    const done = Math.min(completedCount(m.key), total)
    return { ...m, total, done, pct: total ? Math.round((done / total) * 100) : 0 }
  }),
})).filter(s => s.modules.length)
</script>

<template>
  <main class="menu-screen">
    <header class="menu-screen__header">
      <NuxtLink to="/" class="menu-screen__back">← Changer de profil</NuxtLink>
      <div v-if="profile" class="menu-screen__profile">
        <span class="menu-screen__emoji">{{ profile.emoji }}</span>
        <h1>{{ profile.name }}</h1>
      </div>
    </header>

    <section v-for="s in sections" :key="s.key" class="menu-screen__section">
      <h2 class="menu-screen__section-title">{{ s.title }}</h2>
      <div class="menu-screen__grid">
        <NuxtLink
          v-for="m in s.modules"
          :key="m.key"
          :to="`/${id}/${m.key}`"
          class="menu-card"
          :style="{ background: m.bg }"
        >
          <span class="menu-card__emoji">{{ m.emoji }}</span>
          <span class="menu-card__title">{{ m.title }}</span>
          <span class="menu-card__bar">
            <span class="menu-card__bar-fill" :style="{ width: `${m.pct}%` }" />
          </span>
          <span class="menu-card__count">
            {{ m.done }} / {{ m.total }}<template v-if="m.done === m.total && m.total"> ⭐</template>
          </span>
        </NuxtLink>
      </div>
    </section>
  </main>
</template>

<style lang="scss" scoped>
@use '~/assets/styles/variables' as *;

.menu-screen {
  min-height: 100dvh;
  background: $bg-menu;
  color: white;
  padding: 32px 24px;
  display: flex;
  flex-direction: column;
  gap: 40px;

  @media (max-width: 480px) {
    padding: 20px 16px;
    gap: 24px;
  }
}

.menu-screen__header {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.menu-screen__back {
  font-family: $font-body;
  color: white;
  text-decoration: none;
  opacity: 0.9;
  font-size: 1rem;

  &:hover {
    opacity: 1;
  }
}

.menu-screen__profile {
  display: flex;
  align-items: center;
  gap: 16px;
}

.menu-screen__emoji {
  font-size: 3rem;
}

.menu-screen__profile h1 {
  font-family: $font-title;
  font-size: 2.5rem;
}

.menu-screen__section {
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 900px;
  width: 100%;
  margin: 0 auto;
}

.menu-screen__section-title {
  font-size: 1.5rem;
  opacity: 0.95;
}

.menu-screen__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;

  @media (max-width: 480px) {
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }
}

.menu-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 32px 20px;
  border-radius: $radius-card;
  color: white;
  text-decoration: none;
  box-shadow: 0 8px 0 rgba(0, 0, 0, 0.2);
  transition: transform 180ms ease, box-shadow 180ms ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 0 rgba(0, 0, 0, 0.2);
  }

  @media (max-width: 480px) {
    gap: 8px;
    padding: 18px 12px;
  }
}

.menu-card__emoji {
  font-size: 3.5rem;
  line-height: 1;

  @media (max-width: 480px) {
    font-size: 2.5rem;
  }
}

.menu-card__title {
  font-family: $font-title;
  font-size: 1.5rem;

  @media (max-width: 480px) {
    font-size: 1.15rem;
  }
}

.menu-card__count {
  font-family: $font-body;
  font-size: 0.95rem;
  opacity: 0.85;
}

.menu-card__bar {
  width: 70%;
  height: 8px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.2);
  overflow: hidden;
}

.menu-card__bar-fill {
  display: block;
  height: 100%;
  border-radius: 4px;
  background: #FECA57;
  transition: width 400ms ease;
}
</style>
