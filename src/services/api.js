const API_BASE = '/api';

export const getStoredToken = () => {
  return localStorage.getItem('token');
};

export const setStoredToken = (token) => {
  localStorage.setItem('token', token);
};

export const removeStoredToken = () => {
  localStorage.removeItem('token');
};

async function request(endpoint, options = {}) {
  const token = getStoredToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({
    success: false,
    message: 'Failed to parse JSON response from server',
  }));

  if (!response.ok) {
    if (response.status === 401) {
      removeStoredToken();
      window.dispatchEvent(new CustomEvent('auth:expired'));
    }
    const errMessage = data.message || (data.errors ? data.errors.join(', ') : 'An unexpected error occurred');
    throw new Error(errMessage);
  }

  return data;
}

export const api = {
  // Auth API
  auth: {
    register: (userData) =>
      request('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      }),

    login: (credentials) =>
      request('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      }),

    getMe: () => request('/auth/me'),

    logout: () =>
      request('/auth/logout', {
        method: 'POST',
      }),
  },

  // Task API
  tasks: {
    getAll: (filters) => {
      const params = new URLSearchParams();
      if (filters?.search) params.append('search', filters.search);
      if (filters?.status && filters.status !== 'All') params.append('status', filters.status);
      if (filters?.priority && filters.priority !== 'All') params.append('priority', filters.priority);
      if (filters?.overdue) params.append('overdue', 'true');
      if (filters?.sortBy) params.append('sortBy', filters.sortBy);
      if (filters?.order) params.append('order', filters.order);

      const query = params.toString() ? `?${params.toString()}` : '';
      return request(`/tasks${query}`);
    },

    getStats: () => request('/tasks/stats'),

    getById: (id) => request(`/tasks/${id}`),

    create: (taskData) =>
      request('/tasks', {
        method: 'POST',
        body: JSON.stringify(taskData),
      }),

    update: (id, updates) =>
      request(`/tasks/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      }),

    delete: (id) =>
      request(`/tasks/${id}`, {
        method: 'DELETE',
      }),

    seed: () =>
      request('/tasks/seed', {
        method: 'POST',
      }),
  },

  // Health and System Status
  health: () => request('/health'),
};
