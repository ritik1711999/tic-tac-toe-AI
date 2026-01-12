import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface User {
  _id: string;
  email: string;
  name?: string;
  avatar?: string;
  authProvider?: "local" | "google";
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  initializeAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      setAuth: (user: User, token: string) => {
        localStorage.setItem("auth_token", token);
        localStorage.setItem("auth_user", JSON.stringify(user));
        set({ user, token, isAuthenticated: true });
      },

      logout: () => {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("auth_user");
        set({ user: null, token: null, isAuthenticated: false });
      },

      initializeAuth: () => {
        const token = localStorage.getItem("auth_token");
        const userStr = localStorage.getItem("auth_user");

        if (token && userStr) {
          try {
            const user = JSON.parse(userStr);
            set({ user, token, isAuthenticated: true });
          } catch {
            localStorage.removeItem("auth_token");
            localStorage.removeItem("auth_user");
            set({ user: null, token: null, isAuthenticated: false });
          }
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
