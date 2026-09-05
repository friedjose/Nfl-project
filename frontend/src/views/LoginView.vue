<template>
  <div class="auth-view">
    <h1>Bienvenido de nuevo</h1>
    <form @submit.prevent="handleLogin">
      <label>
        Email
        <input v-model="username" type="text" placeholder="tu@email.com" required />
      </label>
      <label>
        Contraseña
        <input v-model="password" type="password" required />
      </label>
      <p v-if="error" class="error">{{ error }}</p>
      <button type="submit">Iniciar sesión</button>
    </form>
    <p>¿No tienes cuenta? <router-link to="/register">Regístrate aquí</router-link></p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { login } from '../services/auth';
import { useAuth } from '../composables/useAuth';

const username = ref('');
const password = ref('');
const error = ref('');
const router = useRouter();
const { setToken } = useAuth();

async function handleLogin() {
  error.value = '';
  try {
    const { access_token } = await login(username.value, password.value);
    setToken(access_token);
    router.push('/');
  } catch (err) {
    error.value = 'Usuario o contraseña incorrectos';
  }
}
</script>