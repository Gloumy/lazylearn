<script setup lang="ts">
import type { Profile } from '~~/server/database/schema'
import { WORDS } from '~/data/words'
import { SYLLABLES } from '~/data/syllables'

const route = useRoute()
const id = Number(route.params.profile)

const { data: profiles } = await useFetch<Profile[]>('/api/profiles', {
  default: () => [],
})
const profile = computed(() => profiles.value.find(p => p.id === id))

const { refresh: refreshProgress, completedCount } = useProgress(id)
await refreshProgress()

interface ModuleCard {
  key: string
  title: string
  emoji: string
  to?: string
  bg: string
  total?: number
  disabled?: boolean
}

const modules: ModuleCard[] = [
  { key: 'words',      title: 'Les mots',  emoji: '📖', to: `/${id}/words`,     bg: '#1A237E', total: WORDS.length },
  { key: 'tracing',    title: 'Tracer',    emoji: '✏️', to: `/${id}/tracing`,   bg: '#1B5E20', total: 26 },
  { key: 'syllables',  title: 'Syllabes',  emoji: '🔤', to: `/${id}/syllables`, bg: '#006064', total: SYLLABLES.size },
  { key: 'calculator', title: 'Calcul',    emoji: '🧮', bg: '#E65100', disabled: true },
]
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

    <section class="menu-screen__grid">
      <component
        :is="m.disabled ? 'div' : 'a'"
        v-for="m in modules"
        :key="m.key"
        :href="m.disabled ? undefined : m.to"
        class="menu-card"
        :class="{ 'menu-card--disabled': m.disabled }"
        :style="{ background: m.bg }"
      >
        <span class="menu-card__emoji">{{ m.emoji }}</span>
        <span class="menu-card__title">{{ m.title }}</span>
        <span v-if="!m.disabled" class="menu-card__count">
          {{ completedCount(m.key) }} / {{ m.total }} complété{{ (m.total ?? 0) > 1 ? 's' : '' }}
        </span>
        <span v-else class="menu-card__badge">Bientôt</span>
      </component>
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

.menu-screen__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  max-width: 900px;
  width: 100%;
  margin: 0 auto;
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

  &:hover:not(.menu-card--disabled) {
    transform: translateY(-2px);
    box-shadow: 0 10px 0 rgba(0, 0, 0, 0.2);
  }

  &--disabled {
    opacity: 0.55;
    cursor: not-allowed;
    box-shadow: 0 4px 0 rgba(0, 0, 0, 0.15);
  }
}

.menu-card__emoji {
  font-size: 3.5rem;
  line-height: 1;
}

.menu-card__title {
  font-family: $font-title;
  font-size: 1.5rem;
}

.menu-card__count {
  font-family: $font-body;
  font-size: 0.95rem;
  opacity: 0.85;
}

.menu-card__badge {
  font-family: $font-body;
  font-weight: 600;
  font-size: 0.85rem;
  padding: 4px 10px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: $radius-btn;
}
</style>
