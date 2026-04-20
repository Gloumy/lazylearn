<script setup lang="ts">
import type { Profile } from '~~/server/database/schema'

const route = useRoute()
const id = Number(route.params.profile)

const { data: profiles } = await useFetch<Profile[]>('/api/profiles', {
  default: () => [],
})
const profile = computed(() => profiles.value.find(p => p.id === id))
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
    <p class="menu-screen__todo">Menu des modules — à venir (phase 2+).</p>
  </main>
</template>

<style lang="scss" scoped>
@use '~/assets/styles/variables' as *;

.menu-screen {
  min-height: 100%;
  background: $bg-menu;
  color: white;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
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

.menu-screen__todo {
  font-family: $font-body;
  opacity: 0.85;
  font-size: 1.15rem;
  margin-top: 40px;
}
</style>
