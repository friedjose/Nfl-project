import { useAuth } from '../composables/useAuth';

const API_URL = import.meta.env.VITE_API_URL;
const { authHeader } = useAuth();

export async function toggleFavorite(teamId) {
  const res = await fetch(`${API_URL}/favorites/${teamId}`, {
    method: 'POST',
    headers: { ...authHeader() },
  });
  if (!res.ok) throw new Error('Error al marcar favorito');
  return res.json(); 
}

export async function getMyFavorites() {
  const res = await fetch(`${API_URL}/favorites`, {
    headers: { ...authHeader() },
  });
  if (!res.ok) throw new Error('Error al obtener favoritos');
  return res.json();
}