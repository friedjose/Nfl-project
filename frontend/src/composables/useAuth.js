import { ref } from 'vue';

const token = ref(localStorage.getItem('token'));

export function useAuth() {
  function setToken(newToken) {
    token.value = newToken;
    localStorage.setItem('token', newToken);
  }

  function logout() {
    token.value = null;
    localStorage.removeItem('token');
  }

  function isAuthenticated() {
    return !!token.value;
  }

  function authHeader() {
    return token.value ? { Authorization: `Bearer ${token.value}` } : {};
  }

  return { token, setToken, logout, isAuthenticated, authHeader };
}