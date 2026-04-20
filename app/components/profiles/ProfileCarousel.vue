<script setup lang="ts">
import type { Profile } from '~~/server/database/schema'

const props = defineProps<{ profiles: Profile[] }>()
const emit = defineEmits<{ (e: 'select', id: number): void }>()

const PAGE_SIZE = 6
const pages = computed(() => {
  const out: Profile[][] = []
  for (let i = 0; i < props.profiles.length; i += PAGE_SIZE) {
    out.push(props.profiles.slice(i, i + PAGE_SIZE))
  }
  return out
})
const currentPage = ref(0)
</script>

<template>
  <div class="profile-carousel">
    <div class="profile-carousel__viewport">
      <div
        class="profile-carousel__track"
        :style="{ transform: `translateX(-${currentPage * 100}%)` }"
      >
        <div
          v-for="(page, idx) in pages"
          :key="idx"
          class="profile-carousel__page"
        >
          <ProfileCard
            v-for="profile in page"
            :key="profile.id"
            :profile="profile"
            @click="emit('select', profile.id)"
          />
        </div>
      </div>
    </div>
    <div class="profile-carousel__dots">
      <button
        v-for="(_, idx) in pages"
        :key="idx"
        class="profile-carousel__dot"
        :class="{ 'profile-carousel__dot--active': idx === currentPage }"
        :aria-label="`Page ${idx + 1}`"
        @click="currentPage = idx"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '~/assets/styles/variables' as *;

.profile-carousel {
  width: 100%;
  max-width: 720px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.profile-carousel__viewport {
  overflow: hidden;
  width: 100%;
}

.profile-carousel__track {
  display: flex;
  transition: transform 300ms ease;
}

.profile-carousel__page {
  flex: 0 0 100%;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 20px;
}

.profile-carousel__dots {
  display: flex;
  justify-content: center;
  gap: 10px;
}

.profile-carousel__dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  transition: background 150ms ease, transform 150ms ease;

  &--active {
    background: white;
    transform: scale(1.2);
  }
}
</style>
