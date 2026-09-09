"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { authService } from "@/features/auth/services/auth.services";
import type { MeResponse, ModuleCode } from "@/features/auth/types/auth.types";

interface AuthContextValue {
  user: MeResponse | null;
  loading: boolean;
  loggingOut: boolean;
  isAuthenticated: boolean;

  refreshMe: () => Promise<MeResponse | null>;

  hasModule: (module: ModuleCode) => boolean;

  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<MeResponse | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);

  const [loading, setLoading] = useState(true);
  const refreshMe = useCallback(async () => {
    try {
      const response = await authService.me();

      setUser(response);

      return response;
    } catch (error) {
      console.error("[AUTH] Gagal mengambil user", error);

      setUser(null);

      return null;
    }
  }, []);
  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        const response = await authService.me();

        if (!mounted) return;

        setUser(response);
      } catch {
        if (!mounted) return;

        setUser(null);
      } finally {
        if (!mounted) return;

        setLoading(false);
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
    };
  }, []);

  const hasModule = useCallback(
    (moduleCode: ModuleCode) => {
      if (!user?.modules) {
        return false;
      }

      return user.modules.some(
        (module) => module.code === moduleCode && module.status === "ACTIVE",
      );
    },
    [user],
  );

  const logout = useCallback(async () => {
    setLoggingOut(true);

    try {
      await authService.logout();
    } catch (error) {
      console.error("[AUTH] Logout gagal", error);
    } finally {
      setUser(null);
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      loggingOut,
      isAuthenticated: !!user,

      refreshMe,
      hasModule,
      logout,
    }),
    [user, loading, loggingOut, refreshMe, hasModule, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth harus digunakan di dalam AuthProvider");
  }

  return context;
}
