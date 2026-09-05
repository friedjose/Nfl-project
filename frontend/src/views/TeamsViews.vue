<!-- src/views/TeamsView.vue -->
<template>
  <div class="teams-view">
    <div class="header">
      <h1>Equipos NFL</h1>
      <button @click="openCreateForm">+ Nuevo Equipo</button>
    </div>

    <input
      v-model="search"
      @input="onSearchChange"
      type="text"
      placeholder="Buscar equipo por nombre..."
    />

    <TeamForm
      v-if="showForm"
      :team="editingTeam"
      @submit="handleFormSubmit"
      @cancel="closeForm"
    />

    <p v-if="loading">Cargando...</p>
    <p v-else-if="teams.length === 0">No se encontraron equipos.</p>

    <div v-else class="grid">
      <div v-for="team in teams" :key="team.id" class="card-wrapper">
        <TeamCard :team="team" />
        <div class="card-actions">
          <button @click="openEditForm(team)">Editar</button>
          <button @click="handleDelete(team.id)">Eliminar</button>
        </div>
      </div>
    </div>

    <div class="pagination" v-if="totalPages > 1">
      <button :disabled="page === 1" @click="goToPage(page - 1)">Prev</button>
      <span>Página {{ page }} de {{ totalPages }}</span>
      <button :disabled="page === totalPages" @click="goToPage(page + 1)">Next</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import TeamCard from '../components/TeamCard.vue';
import TeamForm from '../components/TeamForm.vue';
import { getTeams, createTeam, updateTeam, deleteTeam } from '../services/teams';

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
  editingTeam.value = null;
  showForm.value = true;
}

function openEditForm(team) {
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
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
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
.pagination {
  margin-top: 1rem;
  display: flex;
  gap: 1rem;
  align-items: center;
}
</style>
