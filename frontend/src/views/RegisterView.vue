<template>
  <div class="auth-page">
    <div class="auth-card">
      <h1>Crear cuenta</h1>
      <p class="hint">Regístrate para empezar a gestionar equipos.</p>

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
        <button type="submit" class="primary full">Registrarme</button>
      </form>

      <p class="switch">¿Ya tienes cuenta? <router-link to="/login">Inicia sesión</router-link></p>
    </div>
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

<style scoped>
.auth-page {
  display: flex;
  justify-content: center;
  background-image:
    linear-gradient(rgba(10, 10, 15, 0.75), rgba(10, 10, 15, 0.85)),
    url('https://images.unsplash.com/photo-1566577739112-5180d4bf9390?auto=format&fit=crop&w=1920&q=80');
  padding: 4rem 1rem;
}
.auth-card {
  background: #111117;
  border: 1px solid #22222c;
  border-radius: 10px;
  padding: 2rem;
  width: 100%;
  max-width: 380px;
  text-align: center;
}
.hint {
  color: #8a8a95;
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
}
form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  text-align: left;
}
label {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  font-size: 0.85rem;
  color: #b0b0ba;
}
.primary.full {
  background: #2563eb;
  color: #fff;
  padding: 0.7rem;
}
.error {
  color: #ff8a8a;
  font-size: 0.85rem;
  margin: 0;
}
.switch {
  margin-top: 1.5rem;
  font-size: 0.85rem;
  color: #8a8a95;
}
</style>