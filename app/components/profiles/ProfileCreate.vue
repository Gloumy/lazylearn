<script setup lang="ts">
const emit = defineEmits<{
  (e: 'cancel'): void
  (e: 'created'): void
}>()

const EMOJIS = [
  '🦊', '🐰', '🐻', '🐶', '🐱', '🦁',
  '🐯', '🐨', '🐼', '🦄', '🐲', '🐙',
  '🦖', '🦋', '🐞', '🐝', '🐢', '🐸',
  '🐵', '🐹', '🦉', '🐳', '🌈', '⭐',
  '🚀', '🎈', '🎨', '⚽',
]

const name = ref('')
const emoji = ref('')
const submitting = ref(false)
const errorMessage = ref<string | null>(null)

const canSubmit = computed(
  () => name.value.trim().length > 0 && !!emoji.value && !submitting.value,
)

async function submit() {
  if (!canSubmit.value) return
  submitting.value = true
  errorMessage.value = null
  try {
    await $fetch('/api/profiles', {
      method: 'POST',
      body: { name: name.value.trim(), emoji: emoji.value },
    })
    emit('created')
  } catch (err: any) {
    errorMessage.value = err?.statusMessage ?? 'Oups, une erreur est survenue.'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="profile-create">
    <section class="profile-create__emojis">
      <h2>Choisis ton avatar</h2>
      <div class="profile-create__grid">
        <button
          v-for="e in EMOJIS"
          :key="e"
          class="profile-create__emoji"
          :class="{ 'profile-create__emoji--selected': e === emoji }"
          :aria-label="`Emoji ${e}`"
          @click="emoji = e"
        >
          {{ e }}
        </button>
      </div>
    </section>

    <section class="profile-create__preview">
      <h2>Aperçu</h2>
      <div class="profile-create__card">
        <span class="profile-create__card-emoji">{{ emoji || '❓' }}</span>
        <span class="profile-create__card-name">{{ name || 'Ton prénom' }}</span>
      </div>

      <label class="profile-create__label">
        Prénom
        <input
          v-model="name"
          class="profile-create__input"
          maxlength="20"
          placeholder="Emma, Léo…"
          @keydown.enter="submit"
        />
      </label>

      <p v-if="errorMessage" class="profile-create__error">{{ errorMessage }}</p>

      <div class="profile-create__actions">
        <button class="profile-create__cancel" @click="emit('cancel')">
          Annuler
        </button>
        <button
          class="profile-create__submit"
          :disabled="!canSubmit"
          @click="submit"
        >
          C'est parti !
        </button>
      </div>
    </section>
  </div>
</template>

<style lang="scss" scoped>
@use '~/assets/styles/variables' as *;

.profile-create {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 32px;
  width: 100%;
  max-width: 960px;

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
}

.profile-create__emojis,
.profile-create__preview {
  background: rgba(255, 255, 255, 0.1);
  border-radius: $radius-card;
  padding: 24px;

  h2 {
    font-family: $font-title;
    font-size: 1.5rem;
    margin-bottom: 16px;
  }
}

.profile-create__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(64px, 1fr));
  gap: 10px;
}

.profile-create__emoji {
  aspect-ratio: 1;
  font-size: 2rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: $radius-tile;
  transition: background 150ms ease, transform 150ms ease;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }

  &--selected {
    background: rgba(255, 255, 255, 0.35);
    transform: scale(1.05);
  }
}

.profile-create__preview {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.profile-create__card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  background: rgba(255, 255, 255, 0.12);
  border-radius: $radius-card;
  padding: 24px 16px;
}

.profile-create__card-emoji {
  font-size: 4rem;
  line-height: 1;
}

.profile-create__card-name {
  font-family: $font-title;
  font-size: 1.75rem;
  color: white;
}

.profile-create__label {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-family: $font-body;
  font-weight: 600;
  color: white;
}

.profile-create__input {
  background: rgba(255, 255, 255, 0.18);
  color: white;
  padding: 10px 14px;
  border-radius: $radius-btn;
  border: none;
  outline: none;
  font-family: $font-body;
  font-size: 1.1rem;

  &::placeholder {
    color: rgba(255, 255, 255, 0.6);
  }

  &:focus {
    background: rgba(255, 255, 255, 0.28);
  }
}

.profile-create__error {
  color: #ffd166;
  font-family: $font-body;
  margin: 0;
}

.profile-create__actions {
  display: flex;
  gap: 12px;
  margin-top: auto;
}

.profile-create__cancel,
.profile-create__submit {
  flex: 1;
  padding: 12px 16px;
  border-radius: $radius-btn;
  font-family: $font-body;
  font-weight: 600;
  font-size: 1rem;
}

.profile-create__cancel {
  background: rgba(255, 255, 255, 0.15);
  color: white;

  &:hover {
    background: rgba(255, 255, 255, 0.25);
  }
}

.profile-create__submit {
  background: #FF6B35;
  color: white;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    filter: brightness(1.1);
  }
}
</style>
