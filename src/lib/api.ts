const API_URL = '/api';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };
};

const handleResponse = async (response: Response) => {
  if (response.status === 401) {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }
  
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.indexOf("application/json") !== -1) {
    return response.json();
  } else {
    const text = await response.text();
    console.error("Non-JSON response received:", text);
    throw new Error("O servidor retornou uma resposta inválida. Verifique se o backend está rodando.");
  }
};

export const api = {
  async get(path: string) {
    try {
      const response = await fetch(`${API_URL}${path}`, {
        headers: getHeaders(),
      });
      return handleResponse(response);
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
      return handleResponse(response);
    } catch (error) {
      console.error(`POST ${path} failed:`, error);
      throw error;
    }
  },

  async put(path: string, data: any) {
    try {
      const response = await fetch(`${API_URL}${path}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
      return handleResponse(response);
    } catch (error) {
      console.error(`PUT ${path} failed:`, error);
      throw error;
    }
  },

  async delete(path: string) {
    try {
      const response = await fetch(`${API_URL}${path}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      if (response.status === 204) return true;
      return handleResponse(response);
    } catch (error) {
      console.error(`DELETE ${path} failed:`, error);
      throw error;
    }
  },
};