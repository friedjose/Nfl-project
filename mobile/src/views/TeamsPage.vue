<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Equipos NFL</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="openCreateModal">+ Nuevo</ion-button>
        </ion-buttons>
      </ion-toolbar>
      <ion-toolbar>
        <ion-searchbar
          v-model="search"
          placeholder="Buscar equipo por nombre..."
          @ionInput="onSearchChange"
        ></ion-searchbar>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-list>
        <ion-item v-for="team in teams" :key="team.id">
          <ion-thumbnail slot="start">
            <img :src="team.image" :alt="team.name" />
          </ion-thumbnail>
          <ion-label>
            <h2>{{ team.name }}</h2>
            <p>{{ team.city }} · {{ team.conference }}</p>
          </ion-label>
          <ion-button slot="end" fill="clear" @click="openEditModal(team)">Editar</ion-button>
          <ion-button slot="end" fill="clear" color="danger" @click="confirmDelete(team)">Eliminar</ion-button>
        </ion-item>
      </ion-list>

      <ion-infinite-scroll
        @ionInfinite="loadMore"
        threshold="100px"
        :disabled="isInfiniteDisabled"
      >
        <ion-infinite-scroll-content
          loading-spinner="bubbles"
          loading-text="Cargando más equipos..."
        ></ion-infinite-scroll-content>
      </ion-infinite-scroll>
    </ion-content>

    <ion-modal :is-open="showModal" @didDismiss="closeModal">
      <ion-header>
        <ion-toolbar>
          <ion-title>{{ editingTeam ? 'Editar Equipo' : 'Nuevo Equipo' }}</ion-title>
          <ion-buttons slot="end">
            <ion-button @click="closeModal">Cerrar</ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>
      <ion-content class="ion-padding">
        <ion-item>
          <ion-input label="Team Name" v-model="form.name" placeholder="e.g. Chiefs"></ion-input>
        </ion-item>
        <ion-item>
          <ion-input label="City" v-model="form.city" placeholder="e.g. Kansas City"></ion-input>
        </ion-item>
        <ion-item>
          <ion-select label="Conference" v-model="form.conference">
            <ion-select-option value="AFC">AFC</ion-select-option>
            <ion-select-option value="NFC">NFC</ion-select-option>
          </ion-select>
        </ion-item>
        <ion-item>
          <ion-input label="Image URL" v-model="form.image" placeholder="https://..."></ion-input>
        </ion-item>
        <ion-button expand="block" class="ion-margin-top" @click="handleSubmit">
          Guardar Equipo
        </ion-button>
      </ion-content>
    </ion-modal>
  </ion-page>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton,
  IonSearchbar, IonList, IonItem, IonLabel, IonThumbnail,
  IonInfiniteScroll, IonInfiniteScrollContent,
  IonModal, IonInput, IonSelect, IonSelectOption,
  alertController,
} from '@ionic/vue';
import { getTeams, createTeam, updateTeam, deleteTeam } from '../services/teams';

const teams = ref([]);
const search = ref('');
const page = ref(1);
const limit = 6;
const totalPages = ref(1);
const isInfiniteDisabled = ref(false);

const showModal = ref(false);
const editingTeam = ref(null);
const form = reactive({ name: '', city: '', conference: 'AFC', image: '' });

let debounceTimer = null;

async function loadTeams(reset = false) {
  const res = await getTeams(page.value, limit, search.value);
  teams.value = reset ? res.data : [...teams.value, ...res.data];
  totalPages.value = res.totalPages;
  isInfiniteDisabled.value = page.value >= res.totalPages;
}

async function loadMore(event) {
  page.value += 1;
  await loadTeams();
  event.target.complete();
}

function onSearchChange() {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    page.value = 1;
    isInfiniteDisabled.value = false;
    loadTeams(true);
  }, 400);
}

function openCreateModal() {
  editingTeam.value = null;
  Object.assign(form, { name: '', city: '', conference: 'AFC', image: '' });
  showModal.value = true;
}

function openEditModal(team) {
  editingTeam.value = team;
  Object.assign(form, { name: team.name, city: team.city, conference: team.conference, image: team.image });
  showModal.value = true;
}

function closeModal() {
  showModal.value = false;
}

async function handleSubmit() {
  if (editingTeam.value) {
    await updateTeam(editingTeam.value.id, { ...form });
  } else {
    await createTeam({ ...form });
  }
  closeModal();
  page.value = 1;
  isInfiniteDisabled.value = false;
  loadTeams(true);
}

async function confirmDelete(team) {
  const alert = await alertController.create({
    header: 'Eliminar equipo',
    message: `¿Seguro que quieres eliminar ${team.name}?`,
    buttons: [
      { text: 'Cancelar', role: 'cancel' },
      {
        text: 'Eliminar',
        role: 'destructive',
        handler: async () => {
          await deleteTeam(team.id);
          page.value = 1;
          isInfiniteDisabled.value = false;
          loadTeams(true);
        },
      },
    ],
  });
  await alert.present();
}

onMounted(() => loadTeams(true));
</script>