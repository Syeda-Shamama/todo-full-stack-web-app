import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const apiClient = axios.create({
  baseURL: API_URL,
});

// Add token interceptor
apiClient.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('Request URL:', `${config.baseURL || ''}${config.url}`); // Debug
    console.log('Token:', token ? token.substring(0, 20) + '...' : 'None'); // Debug
  }
  return config;
});

export const api = {
  // Auth - Use full URL directly
  login: (email: string, password: string) =>
    axios.post(`${API_URL}/api/token`, 
      new URLSearchParams({ username: email, password }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    ),

  // Tasks - All use apiClient (which has baseURL)
  getTasks: () => apiClient.get('/api/tasks'),
  
  createTask: (title: string, description: string) =>
    apiClient.post('/api/tasks', { title, description }),
  
  updateTask: (id: number, title: string, description: string) =>
    apiClient.put(`/api/tasks/${id}`, { title, description }),
  
  deleteTask: (id: number) =>
    apiClient.delete(`/api/tasks/${id}`),
  
  toggleTask: (id: number, completed: boolean) =>
    apiClient.patch(`/api/tasks/${id}/complete`, { completed }),
};