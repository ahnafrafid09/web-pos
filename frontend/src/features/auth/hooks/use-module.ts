"use client";

import type { MeResponse, ModuleCode } from "@/features/auth/types/auth.types";

import { hasModule } from "@/features/auth/utils/module-access";

export function useModule(user: MeResponse | null) {
  return {
    has: (module: ModuleCode) => hasModule(user, module),

    recipe: hasModule(user, "RECIPE"),

    sales: hasModule(user, "SALES"),

    inventory: hasModule(user, "INVENTORY"),

    purchase: hasModule(user, "PURCHASE"),

    reporting: hasModule(user, "REPORTING"),
  };
}
