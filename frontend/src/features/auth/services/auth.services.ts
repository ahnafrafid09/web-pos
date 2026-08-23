import { api } from "@/lib/api";

import type {
  LoginDto,
  LoginResponse,
  MeResponse,
  RegisterDto,
} from "@/features/auth/types/auth.types";
import { authStorage } from "../lib/auth-storage";

export const authService = {
  async register(data: RegisterDto) {
    const response = await api.post("/auth/register-tenant", data);

    return response.data;
  },

  async login(data: LoginDto): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>("/auth/login", data);

    return response.data;
  },

  async me(): Promise<MeResponse> {
    const response = await api.get<MeResponse>("/auth/me");

    return response.data;
  },

  async logout() {
    const refreshToken = authStorage.getRefreshToken();

    if (!refreshToken) {
      return;
    }

    await api.post("/auth/logout", {
      refreshToken,
    });
  },
};
