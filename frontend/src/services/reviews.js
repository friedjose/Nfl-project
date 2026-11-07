import { useAuth } from '../composables/useAuth';

const API_URL = import.meta.env.VITE_API_URL;
const { authHeader } = useAuth();

export async function getTeamReviews(teamId) {
  const res = await fetch(`${API_URL}/reviews/team/${teamId}`);
  if (!res.ok) throw new Error('Error al obtener las reseñas');
  return res.json();
}

export async function saveReview(teamId, rating, comment) {
  const res = await fetch(`${API_URL}/reviews`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify({ teamId, rating, comment }),
  });
  if (!res.ok) throw new Error('Error al guardar la reseña');
  return res.json();
}

export async function deleteReview(id) {
  const res = await fetch(`${API_URL}/reviews/${id}`, {
    method: 'DELETE',
    headers: { ...authHeader() },
  });
  if (!res.ok) throw new Error('Error al eliminar la reseña');
  return res.json();
}
export async function getTeamStats(teamId) {
  const res = await fetch(`${API_URL}/reviews/team/${teamId}/stats`);
  if (!res.ok) throw new Error('Error al obtener las estadísticas');
  return res.json();
}