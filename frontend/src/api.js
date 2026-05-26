const API_URL = 'http://localhost:8000/api';

// ─── Helper to get stored token ───
function getToken() {
  return localStorage.getItem('auth_token');
}

// ─── Helper to build headers with optional auth ───
function authHeaders(extra = {}) {
  const token = getToken();
  const headers = { 'Content-Type': 'application/json', ...extra };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

// ══════════════════════════════════
//  AUTH ENDPOINTS
// ══════════════════════════════════

export async function loginUsuario({ email, password }) {
  const res = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.detail || 'Credenciales inválidas');
  }
  return res.json();
}

export async function registrarUsuario({ nombre, email, edad, password }) {
  const res = await fetch(`${API_URL}/registro`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nombre, email, edad, password }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.detail || 'Error al registrar usuario');
  }
  return res.json();
}

export async function verificarSesion() {
  const token = getToken();
  if (!token) throw new Error('No hay token');

  const res = await fetch(`${API_URL}/me`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Sesión inválida');
  return res.json();
}

// ══════════════════════════════════
//  TAREAS ENDPOINTS
// ══════════════════════════════════

export async function fetchTareas() {
  const res = await fetch(`${API_URL}/tareas`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error('Error al obtener tareas');
  return res.json();
}

export async function crearTarea({ titulo, descripcion, prioridad }) {
  const res = await fetch(`${API_URL}/tareas`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ titulo, descripcion, prioridad }),
  });
  if (!res.ok) throw new Error('Error al crear tarea');
  return res.json();
}

export async function eliminarTarea(id) {
  const res = await fetch(`${API_URL}/tareas/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error('Error al eliminar tarea');
  return res.json();
}

export async function actualizarEstado(id, estado) {
  const res = await fetch(`${API_URL}/tareas/${id}/estado`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify({ estado }),
  });
  if (!res.ok) throw new Error('Error al actualizar estado');
  return res.json();
}
