<!-- src/views/RegisterView.vue -->
<template>
  <div class="auth-view">
    <h1>Crear cuenta</h1>
    <form @submit.prevent="handleRegister">
      <label>
        Usuario
        <input v-model="username" type="text" required />
      </label>
      <label>
        Contraseña
        <input v-model="password" type="password" required />
      </label>
      <p v-if="error" class="error">{{ error }}</p>
      <button type="submit">Registrarme</button>
    </form>
    <p>¿Ya tienes cuenta? <router-link to="/login">Inicia sesión</router-link></p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { register } from '../services/auth';

const username = ref('');
const password = ref('');
const error = ref('');
const router = useRouter();

async function handleRegister() {
  error.value = '';
  try {
    await register(username.value, password.value);
    router.push('/login');
  } catch (err) {
    error.value = 'No se pudo registrar (¿el usuario ya existe?)';
  }
}
</script>