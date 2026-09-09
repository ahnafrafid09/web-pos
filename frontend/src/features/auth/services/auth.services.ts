import { api } from "@/lib/api";

import type {
  LoginDto,
  LoginResponse,
  MeResponse,
  RegisterDto,
} from "@/features/auth/types/auth.types";

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
    const response = await api.post("/auth/logout");

    return response.data;
  },
};
