<template>
  <div class="reviews-panel">
    <h2>Reseñas de {{ team.name }}</h2>

    <div class="stats-box" v-if="stats.total > 0">
      <span class="avg">{{ stats.average.toFixed(1) }} ⭐</span>
      <span class="count">de {{ stats.total }} {{ stats.total === 1 ? 'reseña' : 'reseñas' }}</span>
    </div>

    <form v-if="isAuthenticated()" @submit.prevent="handleSave" class="review-form">
      <label>
        Calificación
        <select v-model.number="rating">
          <option v-for="n in 5" :key="n" :value="n">{{ n }} ⭐</option>
        </select>
      </label>
      <label>
        Comentario (opcional)
        <textarea v-model="comment" rows="3" placeholder="¿Qué opinas de este equipo?"></textarea>
      </label>
      <button type="submit">Guardar reseña</button>
    </form>
    <p v-else class="hint">Inicia sesión para dejar tu reseña.</p>

    <hr />

    <p v-if="loading">Cargando reseñas...</p>
    <p v-else-if="reviews.length === 0" class="status">Todavía no hay reseñas.</p>

    <ul v-else class="review-list">
      <li v-for="review in reviews" :key="review.id">
        <strong>{{ review.user.username }}</strong> — {{ review.rating }} ⭐
        <p v-if="review.comment">{{ review.comment }}</p>
      </li>
    </ul>

    <button class="close-btn" @click="$emit('close')">Cerrar</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getTeamReviews, saveReview, getTeamStats } from '../services/reviews';
import { useAuth } from '../composables/useAuth';

const props = defineProps({
  team: { type: Object, required: true },
});
defineEmits(['close']);

const { isAuthenticated } = useAuth();

const reviews = ref([]);
const loading = ref(false);
const rating = ref(5);
const comment = ref('');
const stats = ref({ average: 0, total: 0 });

async function loadReviews() {
  loading.value = true;
  try {
    reviews.value = await getTeamReviews(props.team.id);
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
}

async function loadStats() {
  stats.value = await getTeamStats(props.team.id);
}

async function handleSave() {
  try {
    await saveReview(props.team.id, rating.value, comment.value);
    comment.value = '';
    loadReviews();
    loadStats();
  } catch (err) {
    console.error(err);
  }
}

onMounted(() => {
  loadReviews();
  loadStats();
});
</script>

<style scoped>
.reviews-panel {
  background: #111117;
  border: 1px solid #22222c;
  border-radius: 10px;
  padding: 1.5rem;
  max-width: 420px;
  margin: 1.5rem auto;
}
.stats-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #1a1a22;
  border-radius: 8px;
  padding: 0.75rem 1rem;
  margin-bottom: 1rem;
}
.avg {
  font-size: 1.5rem;
  font-weight: 700;
}
.count {
  color: #8a8a95;
  font-size: 0.85rem;
}
.review-form {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1rem;
}
.review-list {
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
.review-list li {
  border-bottom: 1px solid #22222c;
  padding-bottom: 0.5rem;
}
.hint {
  color: #8a8a95;
  font-size: 0.85rem;
}
.close-btn {
  margin-top: 1rem;
  background: #1a1a22;
  color: #ccc;
}
</style>
