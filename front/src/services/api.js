import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token de autenticação em cada requisição
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('sgppf-token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar erros globais (ex: 401 Unauthorized)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Redirecionar para login ou limpar estado se necessário
      console.warn('Sessão expirada ou não autorizada.');
    }
    return Promise.reject(error);
  }
);

export default api;

// Serviços por Módulo
export const pesquisadoresService = {
  getAll: (params) => api.get('/pesquisadores', { params }),
  getById: (id) => api.get(`/pesquisadores/${id}`),
  create: (data) => api.post('/pesquisadores', data),
  update: (id, data) => api.put(`/pesquisadores/${id}`, data),
  delete: (id) => api.delete(`/pesquisadores/${id}`),
};

export const projetosService = {
  getAll: (params) => api.get('/projetos', { params }),
  getById: (id) => api.get(`/projetos/${id}`),
  create: (data) => api.post('/projetos', data),
  update: (id, data) => api.put(`/projetos/${id}`, data),
  delete: (id) => api.delete(`/projetos/${id}`),
};

export const publicacoesService = {
  getAll: (params) => api.get('/publicacoes', { params }),
  getById: (id) => api.get(`/publicacoes/${id}`),
  create: (data) => api.post('/publicacoes', data),
  importByDoi: (doi) => api.post('/publicacoes/import/doi', { doi }),
  delete: (id) => api.delete(`/publicacoes/${id}`),
};

export const orientacoesService = {
  getAll: (params) => api.get('/orientacoes', { params }),
  create: (data) => api.post('/orientacoes', data),
  delete: (id) => api.delete(`/orientacoes/${id}`),
};

export const financiamentosService = {
  getAll: (params) => api.get('/financiamentos', { params }),
  create: (data) => api.post('/financiamentos', data),
  delete: (id) => api.delete(`/financiamentos/${id}`),
};

export const usuariosService = {
  getAll: (params) => api.get('/usuarios', { params }),
  create: (data) => api.post('/usuarios', data),
};

export const authService = {
  login: (email, password) => {
    const formData = new FormData();
    formData.append('username', email);
    formData.append('password', password);
    return api.post('/auth/login', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  register: (nome, email, password) => api.post('/auth/register', { nome, email, password }),
  socialLogin: (provider, data) => api.post(`/auth/social-login/${provider}`, data),
};

export const dashboardService = {
  getStats: () => api.get('/dashboard/stats'),
};
