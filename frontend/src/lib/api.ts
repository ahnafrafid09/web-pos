import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

type RetryableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

api.interceptors.response.use(
  (response) => response,

  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableRequestConfig | undefined;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    // Hanya handle 401
    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }

    const url = originalRequest.url || "";

    /**
     * Endpoint auth yang TIDAK boleh memicu refresh.
     */
    const isAuthEndpoint =
      url.includes("/auth/login") ||
      url.includes("/auth/register-tenant") ||
      url.includes("/auth/refresh") ||
      url.includes("/auth/logout");

    if (isAuthEndpoint) {
      return Promise.reject(error);
    }

    /**
     * Request sudah pernah dicoba setelah refresh.
     */
    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      console.log("[AUTH] Access token expired → refresh");

      await api.post("/auth/refresh");

      console.log("[AUTH] Refresh berhasil");

      return api(originalRequest);
    } catch (refreshError) {
      console.log("[AUTH] Refresh gagal");

      return Promise.reject(refreshError);
    }
  },
);
