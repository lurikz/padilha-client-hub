const API_URL = import.meta.env.VITE_API_URL || (typeof window !== 'undefined' ? (window.location.port ? `${window.location.protocol}//${window.location.hostname}:3001/api` : '/api') : 'http://localhost:3001/api');

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };
};

export const api = {
  async get(path: string) {
    try {
      const response = await fetch(`${API_URL}${path}`, {
        headers: getHeaders(),
      });
      if (response.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
      return response.json();
    } catch (error) {
      console.error(`GET ${path} failed:`, error);
      throw error;
    }
  },

  async post(path: string, data: any) {
    try {
      const response = await fetch(`${API_URL}${path}`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
      if (response.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
      return response.json();
    } catch (error) {
      console.error(`POST ${path} failed:`, error);
      throw error;
    }
  },

  async put(path: string, data: any) {
    const response = await fetch(`${API_URL}${path}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return response.json();
  },

  async delete(path: string) {
    const response = await fetch(`${API_URL}${path}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    if (response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    if (response.status === 204) return true;
    return response.json();
  },
};
