const API_URL = import.meta.env.VITE_API_URL;

export async function getTeams(page = 1, limit = 6, search = '') {
  const params = new URLSearchParams({ page, limit, search });
  const res = await fetch(`${API_URL}/teams?${params}`);
  if (!res.ok) throw new Error('Error al obtener los equipos');
  return res.json();
}