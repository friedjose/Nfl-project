<template>
  <form @submit.prevent="handleSubmit" class="team-form">
    <h2>{{ isEditing ? 'Gestionar Equipo' : 'Nuevo Equipo' }}</h2>

    <label>
      Team Name
      <input v-model="form.name" required placeholder="e.g. Chiefs" />
    </label>

    <label>
      City
      <input v-model="form.city" required placeholder="e.g. Kansas City" />
    </label>

    <label>
      Conference
      <select v-model="form.conference" required>
        <option value="AFC">AFC</option>
        <option value="NFC">NFC</option>
      </select>
    </label>

    <label>
      Image URL
      <input v-model="form.image" required placeholder="https://..." />
    </label>

    <div class="actions">
      <button type="button" @click="$emit('cancel')">Cancelar</button>
      <button type="submit">Guardar Equipo</button>
    </div>
  </form>
</template>

<script setup>
import { reactive, watch } from 'vue';

const props = defineProps({
  team: { type: Object, default: null },
});
const emit = defineEmits(['submit', 'cancel']);

const isEditing = !!props.team;

const form = reactive({
  name: props.team?.name ?? '',
  city: props.team?.city ?? '',
  conference: props.team?.conference ?? 'AFC',
  image: props.team?.image ?? '',
});

function handleSubmit() {
  emit('submit', { ...form });
}
</script>

<style scoped>
.team-form {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-width: 400px;
  margin: 1rem 0;
}
.actions {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
}
</style>