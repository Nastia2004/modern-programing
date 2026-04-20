const runtimeConfig = window.__APP_CONFIG__ || {};
const API_URL = runtimeConfig.API_URL || import.meta.env.VITE_API_URL || 'http://localhost:3000';

export class ApiError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
  }
}

async function request(path, options = {}) {
  const headers = {
    ...options.headers
  };

  if (options.body) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers
  });

  if (response.status === 204) {
    return null;
  }

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new ApiError(data?.error || 'Request failed', response.status);
  }

  return data;
}

export function createApiClient(token) {
  const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

  return {
    login(payload) {
      return request('/auth/login', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
    },
    me() {
      return request('/auth/me', {
        headers: authHeaders
      });
    },
    getUsers(query = '') {
      return request(`/users${query}`);
    },
    getProjects(query = '') {
      return request(`/projects${query}`);
    },
    getTasks(query = '') {
      return request(`/tasks${query}`);
    },
    createProject(payload) {
      return request('/projects', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
    },
    deleteProject(id) {
      return request(`/projects/${id}`, {
        method: 'DELETE'
      });
    },
    createTask(payload) {
      return request('/tasks', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
    },
    updateTask(id, payload) {
      return request(`/tasks/${id}`, {
        method: 'PUT',
        body: JSON.stringify(payload)
      });
    },
    deleteTask(id) {
      return request(`/tasks/${id}`, {
        method: 'DELETE'
      });
    }
  };
}
