<template>
  <div class="teams-view">
    <div class="header">
      <h1 class="title">Equipos NFL</h1>
      <button v-if="isAuthenticated()" @click="openCreateForm">+ Nuevo Equipo</button>
      <span v-else class="spacer"></span>
    </div>

    <div class="toolbar">
      <input
        v-model="search"
        @input="onSearchChange"
        type="text"
        placeholder="Buscar equipo por nombre..."
      />
    </div>

    <TeamForm
      v-if="showForm"
      :team="editingTeam"
      @submit="handleFormSubmit"
      @cancel="closeForm"
    />

    <p v-if="loading" class="status">Cargando...</p>
    <p v-else-if="teams.length === 0" class="status">No se encontraron equipos.</p>

    <div v-else class="grid">
      <div v-for="team in teams" :key="team.id" class="card-wrapper">
        <TeamCard :team="team" />
        <div class="card-actions" v-if="isAuthenticated()">
          <button class="secondary" @click="openEditForm(team)">Editar</button>
          <button class="danger" @click="handleDelete(team.id)">Eliminar</button>
        </div>
      </div>
    </div>

    <div class="pagination" v-if="totalPages > 1">
      <button class="secondary" :disabled="page === 1" @click="goToPage(page - 1)">Prev</button>
      <span>Página {{ page }} de {{ totalPages }}</span>
      <button class="secondary" :disabled="page === totalPages" @click="goToPage(page + 1)">Next</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import TeamCard from '../components/TeamCard.vue';
import TeamForm from '../components/TeamForm.vue';
import { getTeams, createTeam, updateTeam, deleteTeam } from '../services/teams';
import { useAuth } from '../composables/useAuth';

const { isAuthenticated } = useAuth();
const router = useRouter();

const teams = ref([]);
const search = ref('');
const page = ref(1);
const limit = 6;
const totalPages = ref(1);
const loading = ref(false);

const showForm = ref(false);
const editingTeam = ref(null);

let debounceTimer = null;

async function loadTeams() {
  loading.value = true;
  try {
    const res = await getTeams(page.value, limit, search.value);
    teams.value = res.data;
    totalPages.value = res.totalPages;
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
}

function goToPage(newPage) {
  page.value = newPage;
  loadTeams();
}

function onSearchChange() {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    page.value = 1;
    loadTeams();
  }, 400);
}

function openCreateForm() {
  if (!isAuthenticated()) {
    router.push('/login');
    return;
  }
  editingTeam.value = null;
  showForm.value = true;
}

function openEditForm(team) {
  if (!isAuthenticated()) {
    router.push('/login');
    return;
  }
  editingTeam.value = team;
  showForm.value = true;
}

function closeForm() {
  showForm.value = false;
  editingTeam.value = null;
}

async function handleFormSubmit(data) {
  try {
    if (editingTeam.value) {
      await updateTeam(editingTeam.value.id, data);
    } else {
      await createTeam(data);
    }
    closeForm();
    loadTeams();
  } catch (err) {
    console.error(err);
  }
}

async function handleDelete(id) {
  if (!isAuthenticated()) {
    router.push('/login');
    return;
  }
  if (!confirm('¿Seguro que quieres eliminar este equipo?')) return;
  try {
    await deleteTeam(id);
    loadTeams();
  } catch (err) {
    console.error(err);
  }
}

onMounted(loadTeams);
</script>

<style scoped>
.teams-view {
  width: 100%;
  min-height: 100vh;
  padding: 2rem 4rem;
  background-image:
    linear-gradient(rgba(10, 10, 15, 0.85), rgba(10, 10, 15, 0.92)),
    url('https://thumb.wikimedia.org/wikipedia/commons/thumb/b/bd/SoFi_Stadium_%2851126606022%29.jpg/960px-SoFi_Stadium_%2851126606022%29.jpg?utm_source=es.wikipedia.org&utm_campaign=parser&utm_content=thumbnail');
  background-size: cover;
  background-position: center top;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}
.title {
  font-size: 2.2rem;
  margin: 0;
}
.login-btn {
  background: #fff;
  color: #0a0a0f;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 600;
}
.spacer {
  width: 130px;
}
.toolbar {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}
.toolbar input {
  width: 320px;
}
.status {
  text-align: center;
  color: #8a8a95;
}
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1.25rem;
}
.card-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.card-actions {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
}
.card-actions .secondary {
  background: #1a1a22;
  color: #ccc;
}
.card-actions .danger {
  background: #3a1a1a;
  color: #ff8a8a;
}
.pagination {
  margin-top: 2rem;
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  align-items: center;
  color: #8a8a95;
}
.pagination .secondary {
  background: #1a1a22;
  color: #ccc;
}
</style>