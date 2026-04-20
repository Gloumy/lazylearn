<script setup lang="ts">
import type { Profile } from '~~/server/database/schema'

defineProps<{ profile: Profile }>()
defineEmits<{ (e: 'click'): void }>()
</script>

<template>
  <button class="profile-card" @click="$emit('click')">
    <span class="profile-card__emoji">{{ profile.emoji }}</span>
    <span class="profile-card__name">{{ profile.name }}</span>
  </button>
</template>

<style lang="scss" scoped>
@use '~/assets/styles/variables' as *;

.profile-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 24px 16px;
  background: rgba(255, 255, 255, 0.12);
  border-radius: $radius-card;
  color: white;
  transition: background 180ms ease, transform 180ms ease;

  &:hover {
    background: rgba(255, 255, 255, 0.22);
    transform: translateY(-2px);
  }
}

.profile-card__emoji {
  font-size: 3.5rem;
  line-height: 1;
}

.profile-card__name {
  font-family: $font-title;
  font-size: 1.5rem;
}
</style>
