<template>
  <div class="form-panel">
    <h2>{{ isEditing ? 'Gestionar Equipo' : 'Nuevo Equipo' }}</h2>
    <p class="hint">Actualiza los detalles y la imagen del equipo.</p>

    <form @submit.prevent="handleSubmit">
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
        <button type="button" class="secondary" @click="$emit('cancel')">Cancelar</button>
        <button type="submit" class="primary">Guardar Equipo</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { reactive } from 'vue';

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
.form-panel {
  background: #111117;
  border: 1px solid #22222c;
  border-radius: 10px;
  padding: 1.5rem;
  max-width: 420px;
  margin: 1.5rem 0;
}
.hint {
  color: #8a8a95;
  font-size: 0.85rem;
  margin-top: -0.5rem;
}
form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
}
label {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  font-size: 0.85rem;
  color: #b0b0ba;
}
.actions {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
  margin-top: 0.5rem;
}
.primary {
  background: #2563eb;
  color: #fff;
}
.secondary {
  background: transparent;
  border: 1px solid #333;
  color: #ccc;
}
</style>