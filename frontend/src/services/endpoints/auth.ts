import api from "@/services/api";

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
