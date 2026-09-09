"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/provider/auth-provider";
import { CashierPage as CashierComponent } from "@/features/cashier/components/cashier-page";

export default function CashierRoute() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
      return;
    }

    if (
      !loading &&
      user?.user &&
      !["CASHIER", "SUPER_ADMIN", "OWNER", "ADMIN"].includes(user.user.role)
    ) {
      router.replace("/dashboard");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-muted-foreground">
            Memuat halaman kasir...
          </p>
        </div>
      </div>
    );
  }

  return <CashierComponent />;
}
