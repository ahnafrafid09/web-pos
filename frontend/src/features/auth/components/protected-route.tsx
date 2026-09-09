"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import type { ModuleCode } from "@/features/auth/types/auth.types";
import { hasModule } from "@/features/auth/utils/module-access";
import { useAuth } from "../provider/auth-provider";

interface ProtectedRouteProps {
  children: React.ReactNode;
  module?: ModuleCode;
}

export function ProtectedRoute({ children, module }: ProtectedRouteProps) {
  const router = useRouter();

  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace("/login");
      return;
    }

    if (module && !hasModule(user, module)) {
      router.replace("/dashboard");
    }
  }, [user, loading, module, router]);

  if (loading) {
    return null;
  }

  if (!user) {
    return null;
  }

  if (module && !hasModule(user, module)) {
    return null;
  }

  return <>{children}</>;
}
