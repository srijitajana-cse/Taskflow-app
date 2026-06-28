const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const handleResponse = async (res) => {
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || `HTTP ${res.status}`);
  }
  return data;
};

const api = {
  getTasks: async (params = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') query.set(k, v);
    });
    const res = await fetch(`${BASE_URL}/tasks?${query}`);
    return handleResponse(res);
  },

  getTask: async (id) => {
    const res = await fetch(`${BASE_URL}/tasks/${id}`);
    return handleResponse(res);
  },

  createTask: async (taskData) => {
    const res = await fetch(`${BASE_URL}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(taskData),
    });
    return handleResponse(res);
  },

  updateTask: async (id, taskData) => {
    const res = await fetch(`${BASE_URL}/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(taskData),
    });
    return handleResponse(res);
  },

  updateTaskStatus: async (id, status) => {
    const res = await fetch(`${BASE_URL}/tasks/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    return handleResponse(res);
  },

  deleteTask: async (id) => {
    const res = await fetch(`${BASE_URL}/tasks/${id}`, { method: 'DELETE' });
    return handleResponse(res);
  },
};

export default api;
