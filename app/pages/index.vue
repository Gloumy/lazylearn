<script setup lang="ts">
import type { Profile } from '~~/server/database/schema'

const { data: profiles, refresh } = await useFetch<Profile[]>('/api/profiles', {
  default: () => [],
})

const mode = ref<'list' | 'create'>('list')

async function onCreated() {
  mode.value = 'list'
  await refresh()
}

function onSelect(id: number) {
  navigateTo(`/${id}`)
}
</script>

<template>
  <main class="profiles-screen">
    <header class="profiles-screen__header">
      <h1>lazylearn</h1>
      <p v-if="mode === 'list'">Qui joue aujourd'hui ?</p>
    </header>

    <section v-if="mode === 'list'" class="profiles-screen__body">
      <p v-if="!profiles.length" class="profiles-screen__empty">
        Aucun profil pour le moment.
      </p>

      <div
        v-else-if="profiles.length <= 6"
        class="profiles-screen__grid"
      >
        <ProfileCard
          v-for="profile in profiles"
          :key="profile.id"
          :profile="profile"
          @click="onSelect(profile.id)"
        />
      </div>

      <ProfileCarousel
        v-else
        :profiles="profiles"
        @select="onSelect"
      />

      <button class="profiles-screen__add" @click="mode = 'create'">
        + Nouveau profil
      </button>
    </section>

    <ProfileCreate
      v-else
      @cancel="mode = 'list'"
      @created="onCreated"
    />
  </main>
</template>

<style lang="scss" scoped>
@use '~/assets/styles/variables' as *;

.profiles-screen {
  min-height: 100%;
  background: $bg-profiles;
  color: white;
  padding: 32px 24px 48px;
  display: flex;
  flex-direction: column;
  gap: 32px;
  align-items: center;
}

.profiles-screen__header {
  text-align: center;

  h1 {
    font-family: $font-title;
    font-size: 3rem;
    letter-spacing: 2px;
  }

  p {
    font-family: $font-body;
    font-size: 1.25rem;
    opacity: 0.85;
    margin-top: 8px;
  }
}

.profiles-screen__body {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
  width: 100%;
}

.profiles-screen__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 20px;
  width: 100%;
  max-width: 720px;
}

.profiles-screen__empty {
  font-family: $font-body;
  opacity: 0.8;
  font-size: 1.1rem;
}

.profiles-screen__add {
  font-family: $font-body;
  font-weight: 600;
  font-size: 1.1rem;
  color: white;
  background: rgba(255, 255, 255, 0.15);
  padding: 14px 28px;
  border-radius: $radius-btn;
  transition: background 150ms ease;

  &:hover {
    background: rgba(255, 255, 255, 0.25);
  }
}
</style>
