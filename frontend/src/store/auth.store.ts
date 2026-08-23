import { create } from "zustand";

import type { User } from "@/features/auth/types/auth.types";

interface AuthState {
  user: User | null;
  accessToken: string | null;

  setAuth: (user: User, accessToken: string) => void;
  setUser: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,

  setAuth: (user, accessToken) => {
    set({
      user,
      accessToken,
    });
  },

  setUser: (user) => {
    set({
      user,
    });
  },

  logout: () => {
    set({
      user: null,
      accessToken: null,
    });
  },
}));
