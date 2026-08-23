import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getErrorMessage(
  error: unknown,
  fallback = "Terjadi kesalahan",
): string {
  if (typeof error === "object" && error !== null) {
    const data = (
      error as {
        response?: { data?: { message?: string | string[] } };
      }
    ).response?.data;

    const message = data?.message;

    if (Array.isArray(message)) return message.join(", ");
    if (typeof message === "string" && message.length > 0) return message;
  }

  return fallback;
}
