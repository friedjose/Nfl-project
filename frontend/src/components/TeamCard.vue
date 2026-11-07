<template>
  <div class="team-card">
    <div class="image-wrapper">
      <img :src="team.image" :alt="team.name" />
      <span class="badge">{{ team.conference }}</span>
      <button
        v-if="isAuthenticated()"
        class="favorite-btn"
        @click.stop="handleToggleFavorite"
      >
        {{ isFavorite ? '❤️' : '🤍' }}
      </button>
    </div>
    <h3>{{ team.name }}</h3>
    <p class="subtitle">{{ team.city }} · {{ team.conference }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { toggleFavorite, getMyFavorites } from '../services/favorites';
import { useAuth } from '../composables/useAuth';

const props = defineProps({
  team: { type: Object, required: true },
});

const { isAuthenticated } = useAuth();
const isFavorite = ref(false);

async function checkIfFavorite() {
  if (!isAuthenticated()) return;
  const favorites = await getMyFavorites();
  isFavorite.value = favorites.some((fav) => fav.teamId === props.team.id);
}

async function handleToggleFavorite() {
  const res = await toggleFavorite(props.team.id);
  isFavorite.value = res.favorited;
}

onMounted(checkIfFavorite);
</script>

<style scoped>
.team-card {
  cursor: pointer;
  background: #111117;
  border: 1px solid #22222c;
  border-radius: 10px;
  padding: 1rem;
  text-align: center;
}
.image-wrapper {
  position: relative;
  width: 100%;
  height: 160px;
  margin-bottom: 0.75rem;
}
.image-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
  background: #1a1a22;
}
.badge {
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(0, 0, 0, 0.7);
  border: 1px solid #444;
  color: #fff;
  font-size: 0.7rem;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 4px;
}
.favorite-btn {
  position: absolute;
  top: 8px;
  left: 8px;
  background: rgba(0, 0, 0, 0.6);
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  font-size: 1rem;
  padding: 0;
  cursor: pointer;
}
h3 {
  margin: 0.25rem 0;
  font-size: 1.05rem;
}
.subtitle {
  margin: 0;
  color: #8a8a95;
  font-size: 0.85rem;
}
</style>