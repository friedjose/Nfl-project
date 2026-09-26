import { ref } from 'vue';
import { Preferences } from '@capacitor/preferences';

const token = ref(null);

async function loadToken() {
  const { value } = await Preferences.get({ key: 'token' });
  token.value = value;
}
loadToken();

export function useAuth() {
  async function setToken(newToken) {
    token.value = newToken;
    await Preferences.set({ key: 'token', value: newToken });
  }

  async function logout() {
    token.value = null;
    await Preferences.remove({ key: 'token' });
  }

  function isAuthenticated() {
    return !!token.value;
  }

  function authHeader() {
    return token.value ? { Authorization: `Bearer ${token.value}` } : {};
  }

  return { token, setToken, logout, isAuthenticated, authHeader };
}