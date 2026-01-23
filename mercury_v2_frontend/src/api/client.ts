import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor
apiClient.interceptors.request.use(
  (config) => {
    // 1. Attach Token
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // 2. Debug Logging (Dev only)
    if (import.meta.env.DEV) {
      console.groupCollapsed(`🚀 Request: ${config.method?.toUpperCase()} ${config.url}`);
      console.log('Headers:', config.headers);
      console.log('Data:', config.data);
      console.log('Params:', config.params);
      console.groupEnd();
    }

    return config;
  },
  (error) => {
    if (import.meta.env.DEV) {
      console.error('❌ Request Error:', error);
    }
    return Promise.reject(error);
  }
);

// Response Interceptor
apiClient.interceptors.response.use(
  (response) => {
    // Debug Logging
    if (import.meta.env.DEV) {
      console.groupCollapsed(`✅ Response: ${response.status} ${response.config.url}`);
      console.log('Data:', response.data);
      console.groupEnd();
    }
    return response;
  },
  (error) => {
    // Debug Logging
    if (import.meta.env.DEV) {
      console.groupCollapsed(`🚨 Response Error: ${error.response?.status} ${error.config?.url}`);
      console.log('Details:', error.response?.data);
      console.groupEnd();
    }

    // Global Error Handling
    if (error.response?.status === 401) {
      // Clear token and potentially redirect (or let React Query handle it)
      localStorage.removeItem('accessToken');
      // Optional: window.location.href = '/login'; 
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
