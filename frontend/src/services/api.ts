import axios, { AxiosError } from "axios";

const API_URL = "http://localhost:3001/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("codex-token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response.data,
  (error: AxiosError) => {
    // Return the response data if possible, otherwise the error
    if (error.response && error.response.data) {
      return Promise.reject(error.response.data);
    }
    return Promise.reject(error);
  },
);

export const authApi = {
  async register(
    username: string,
    email: string,
    password: string,
  ): Promise<any> {
    const data = (await api.post("/auth/register", {
      username,
      email,
      password,
    })) as any;
    if (data.token) localStorage.setItem("codex-token", data.token);
    return data;
  },

  async login(email: string, password: string): Promise<any> {
    const data = (await api.post("/auth/login", { email, password })) as any;
    if (data.token) localStorage.setItem("codex-token", data.token);
    return data;
  },

  async getMe(): Promise<any> {
    return api.get("/auth/me");
  },

  logout() {
    localStorage.removeItem("codex-token");
  },

  isLoggedIn() {
    return !!localStorage.getItem("codex-token");
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
