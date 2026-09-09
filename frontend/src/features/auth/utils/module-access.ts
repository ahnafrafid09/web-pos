import type { MeResponse, ModuleCode } from "@/features/auth/types/auth.types";

/**
 * Mengecek apakah user memiliki akses
 * terhadap module tertentu.
 *
 * Digunakan untuk kebutuhan frontend:
 * - Sidebar
 * - Menu
 * - Route protection
 * - Feature visibility
 *
 * Security sebenarnya tetap dilakukan di backend.
 */
export function hasModule(user: MeResponse | null, code: ModuleCode): boolean {
  if (!user) {
    return false;
  }

  if (user.user.role === "SUPER_ADMIN") {
    return true;
  }

  const module = user.modules?.find((item) => item.code === code);

  if (!module) {
    return false;
  }
  if (module.status !== "ACTIVE") {
    return false;
  }

  if (module.expiredAt && new Date(module.expiredAt) <= new Date()) {
    return false;
  }

  return true;
}
