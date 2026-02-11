import { create } from "zustand";
import { authApi } from "../services/api";

interface User {
  id: string;
  username: string;
  email: string;
  role?: string;
  current_level?: number;
  level?: number;
  avatarUrl?: string;
  [key: string]: any;
}

type AuthStep = "email" | "code";

interface AuthState {
  user: User | null;
  loading: boolean;
  authStep: AuthStep;
  authEmail: string;

  setUser: (user: User | null) => void;
  updateUser: (updates: Partial<User>) => void;

  // OTP flow
  requestCode: (email: string) => Promise<void>;
  verifyCode: (email: string, code: string) => Promise<void>;
  resetAuthFlow: () => void;

  logout: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  authStep: "email",
  authEmail: "",

  setUser: (user) => set({ user }),

  updateUser: (updates) => {
    set((state) => ({
      user: state.user ? { ...state.user, ...updates } : null,
    }));
  },

  requestCode: async (email: string) => {
    await authApi.requestCode(email);
    set({ authStep: "code", authEmail: email });
  },

  verifyCode: async (email: string, code: string) => {
    await authApi.verifyCode(email, code);
    // Tokens are saved by api.ts, now fetch user profile
    const user = await authApi.getMe();
    set({ user, authStep: "email", authEmail: "" });
  },

  resetAuthFlow: () => {
    set({ authStep: "email", authEmail: "" });
  },

  logout: () => {
    authApi.logout();
    set({ user: null, authStep: "email", authEmail: "" });
  },

  checkAuth: async () => {
    if (authApi.isLoggedIn()) {
      try {
        const data = await authApi.getMe();
        // Backend returns the user directly from GET /auth/me
        set({ user: data });
      } catch (error) {
        console.error("Error verificando auth:", error);
        authApi.logout();
        set({ user: null });
      }
    } else {
      set({ user: null });
    }
    set({ loading: false });
  },
}));

// Initialize auth check
useAuthStore.getState().checkAuth();
