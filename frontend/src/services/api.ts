import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 15000,
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('carbonsense_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('carbonsense_token');
      window.location.href = '/auth';
    }
    return Promise.reject(err);
  }
);

// Auth
export const authApi = {
  register: (data: { name: string; email: string; password: string }) => api.post('/auth/register', data),
  login: (data: { email: string; password: string }) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

// Assessment
export const assessmentApi = {
  submit: (data: object) => api.post('/assessment', data),
  getHistory: () => api.get('/assessment/history'),
  getLatest: () => api.get('/assessment/latest'),
};

// Actions
export const actionsApi = {
  getCatalog: () => api.get('/actions/catalog'),
  logAction: (action_key: string) => api.post('/actions/log', { action_key }),
  getToday: () => api.get('/actions/today'),
  getHistory: (limit?: number) => api.get(`/actions/history?limit=${limit || 30}`),
};

// Challenges
export const challengesApi = {
  getAll: () => api.get('/challenges'),
  join: (id: string) => api.post(`/challenges/${id}/join`),
  updateProgress: (id: string) => api.post(`/challenges/${id}/progress`),
};

// Teams
export const teamsApi = {
  list: () => api.get('/teams'),
  create: (data: { name: string; description?: string }) => api.post('/teams', data),
  join: (inviteCode: string) => api.post(`/teams/join/${inviteCode}`),
  getTeam: (id: string) => api.get(`/teams/${id}`),
};

// Leaderboard
export const leaderboardApi = {
  individual: () => api.get('/leaderboard/individual'),
  team: () => api.get('/leaderboard/team'),
};

// AI
export const aiApi = {
  getCoach: (goals?: string) => api.post('/ai/coach', { goals }),
  getWeeklyReport: () => api.get('/ai/weekly-report'),
};

export default api;
