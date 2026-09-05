const API_URL = import.meta.env.VITE_API_URL;

export async function getTeams(page = 1, limit = 6, search = '') {
  const params = new URLSearchParams({ page, limit, search });
  const res = await fetch(`${API_URL}/teams?${params}`);
  if (!res.ok) throw new Error('Error al obtener los equipos');
  return res.json();
}

export async function getTeam(id) {
  const res = await fetch(`${API_URL}/teams/${id}`);
  if (!res.ok) throw new Error('Equipo no encontrado');
  return res.json();
}

export async function createTeam(data) {
  const res = await fetch(`${API_URL}/teams`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Error al crear el equipo');
  return res.json();
}

export async function updateTeam(id, data) {
  const res = await fetch(`${API_URL}/teams/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Error al actualizar el equipo');
  return res.json();
}

export async function deleteTeam(id) {
  const res = await fetch(`${API_URL}/teams/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Error al eliminar el equipo');
  return res.json();
}