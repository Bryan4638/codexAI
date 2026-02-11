import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

const API_URL = "http://localhost:3000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ─── Request interceptor: attach access token ──────────────────
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("codex-token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ─── Response interceptor: unwrap data + auto-refresh on 401 ───
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (v: unknown) => void;
  reject: (e: unknown) => void;
  config: InternalAxiosRequestConfig;
}> = [];

const processQueue = (error: unknown) => {
  failedQueue.forEach(({ resolve, reject, config }) => {
    if (error) {
      reject(error);
    } else {
      resolve(api(config));
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response.data,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Auto-refresh on 401
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry
    ) {
      const refreshToken = localStorage.getItem("codex-refresh-token");
      if (!refreshToken) {
        authApi.logout();
        return Promise.reject(error.response?.data || error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject, config: originalRequest });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Call refresh directly with axios to avoid interceptors
        const res = await axios.post(`${API_URL}/auth/refresh`, {
          refreshToken,
        });
        const { accessToken, refreshToken: newRefresh } = res.data;
        localStorage.setItem("codex-token", accessToken);
        localStorage.setItem("codex-refresh-token", newRefresh);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        processQueue(null);
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);
        authApi.logout();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    if (error.response?.data) {
      return Promise.reject(error.response.data);
    }
    return Promise.reject(error);
  },
);

// ─── Auth API ──────────────────────────────────────────────────
export const authApi = {
  /** Paso 1: solicitar código OTP al email */
  async requestCode(email: string): Promise<{ message: string }> {
    return api.post("/auth/email/request", { email }) as any;
  },

  /** Paso 2: verificar código y obtener tokens */
  async verifyCode(
    email: string,
    code: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const data = (await api.post("/auth/email/verify", {
      email,
      code,
    })) as any;
    if (data.accessToken) {
      localStorage.setItem("codex-token", data.accessToken);
    }
    if (data.refreshToken) {
      localStorage.setItem("codex-refresh-token", data.refreshToken);
    }
    return data;
  },

  /** Obtener perfil del usuario autenticado */
  async getMe(): Promise<any> {
    return api.get("/auth/me");
  },

  /** Cerrar sesión */
  logout() {
    localStorage.removeItem("codex-token");
    localStorage.removeItem("codex-refresh-token");
  },

  /** ¿Hay sesión activa? */
  isLoggedIn() {
    return !!localStorage.getItem("codex-token");
  },

  /** URLs de OAuth (redirigen al backend) */
  getGoogleAuthUrl() {
    return `${API_URL}/auth/google`;
  },

  getGithubAuthUrl() {
    return `${API_URL}/auth/github`;
  },
};

export const exerciseApi = {
  async getAll(params: Record<string, any> = {}): Promise<any> {
    return api.get("/exercises", { params });
  },

  async getById(id: string): Promise<any> {
    return api.get(`/exercises/${id}`);
  },

  async validate(exerciseId: string, answer: any): Promise<any> {
    return api.post("/exercises/validate", { exerciseId, answer });
  },
};

export const badgeApi = {
  async getAll(): Promise<any> {
    return api.get("/badges");
  },

  async getUserBadges(): Promise<any> {
    return api.get("/badges/user");
  },

  async getProgress(): Promise<any> {
    return api.get("/badges/progress");
  },
};

export const leaderboardApi = {
  async getLeaderboard(): Promise<any> {
    return api.get("/leaderboard");
  },

  async getUserProfile(userId: string): Promise<any> {
    return api.get(`/leaderboard/profile/${userId}`);
  },

  async updateProfile(profileData: any): Promise<any> {
    return api.put("/leaderboard/profile", profileData);
  },
};

export const challengeApi = {
  async getAll(params: Record<string, any> = {}): Promise<any> {
    return api.get("/challenges", { params });
  },

  async create(challenge: any): Promise<any> {
    return api.post("/challenges", challenge);
  },

  async toggleReaction(id: string): Promise<any> {
    return api.post(`/challenges/${id}/react`);
  },

  async delete(id: string): Promise<any> {
    return api.delete(`/challenges/${id}`);
  },
};

export default { authApi, exerciseApi, badgeApi, leaderboardApi, challengeApi };
