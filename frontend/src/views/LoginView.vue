<template>
  <div class="auth-page">
    <div class="auth-card">
      <h1>Bienvenido de nuevo</h1>
      <p class="hint">Inicia sesión para acceder a tu archivo.</p>

      <form @submit.prevent="handleLogin">
        <label>
          Usuario
          <input v-model="username" type="text" placeholder="tu-usuario" required />
        </label>
        <label>
          Contraseña
          <input v-model="password" type="password" required />
        </label>
        <p v-if="error" class="error">{{ error }}</p>
        <button type="submit" class="primary full">Iniciar sesión</button>
      </form>

      <p class="switch">¿No tienes una cuenta? <router-link to="/register">Regístrate aquí</router-link></p>
    </div>
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