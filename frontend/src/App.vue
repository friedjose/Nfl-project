<template>
  <header class="navbar">
    <router-link to="/" class="logo">NFLboxd</router-link>
    <nav v-if="isAuthenticated()">
      <span class="user">{{ }} </span>
      <button @click="handleLogout">Logout</button>
    </nav>
    <router-link v-else to="/login" class="login-link">Login</router-link>
  </header>

  <main>
    <router-view />
  </main>

  <footer class="footer">
    <span>NFLboxd</span>
    <span>© 2026 NFLboxd. For the fans of the gridiron.</span>
  </footer>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useAuth } from './composables/useAuth';

const { isAuthenticated, logout } = useAuth();
const router = useRouter();

function handleLogout() {
  logout();
  router.push('/login');
}
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.2rem 2rem;
  border-bottom: 1px solid #1a1a22;
}
.logo {
  font-size: 1.4rem;
  font-weight: 700;
  color: #fff;
  text-decoration: none;
}
.login-link {
  background: #fff;
  color: #0a0a0f;
  padding: 0.5rem 1.2rem;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 600;
}
main {
  min-height: 80vh;
}
.footer {
  display: flex;
  justify-content: space-between;
  padding: 1.5rem 2rem;
  border-top: 1px solid #1a1a22;
  color: #6b6b76;
  font-size: 0.85rem;
}
</style>