"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { LogOut, Menu, Settings, Store, User } from "lucide-react";

import type { MeResponse } from "@/features/auth/types/auth.types";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth/provider/auth-provider";

interface DashboardHeaderProps {
  user: MeResponse | null;
  onOpenMobile: () => void;
}

export function DashboardHeader({ user, onOpenMobile }: DashboardHeaderProps) {
  const router = useRouter();

  const { logout } = useAuth();

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (isLoggingOut) return;

    try {
      setIsLoggingOut(true);

      await logout();

      router.replace("/login");
    } catch (error) {
      console.error("[AUTH] Logout gagal", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const getInitial = () => {
    return user?.user?.name?.charAt(0).toUpperCase() || "U";
  };

  return (
    <header className="sticky top-0 z-30 flex h-14 sm:h-16 items-center justify-between border-b bg-background/95 backdrop-blur">
      {/* LEFT */}
      <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-6">
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 shrink-0 lg:hidden"
          onClick={onOpenMobile}
        >
          <Menu className="h-5 w-5" />
        </Button>

        <div className="min-w-0 flex-1">
          <h1 className="truncate text-sm font-semibold sm:text-base">
            {user?.tenant?.name || "Dashboard"}
          </h1>

          <p className="hidden text-[10px] sm:text-xs text-muted-foreground sm:block">
            Kelola usaha Anda dari satu tempat
          </p>
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-6">
        {/* BUSINESS - Compact on mobile */}
        <div className="hidden items-center gap-1.5 border-r pr-3 sm:pr-4 md:flex">
          <Store className="h-4 w-4 text-muted-foreground shrink-0" />

          <span className="max-w-[150px] lg:max-w-[200px] truncate text-sm">
            {user?.tenant?.name || "Memuat..."}
          </span>
        </div>

        {/* USER - Compact avatar on mobile */}
        <div className="group relative">
          <button
            type="button"
            className="flex items-center gap-2 border px-2 py-1.5 transition-colors hover:bg-muted"
          >
            <div className="flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-md bg-primary text-xs sm:text-sm font-bold text-primary-foreground">
              {getInitial()}
            </div>

            <div className="hidden text-left sm:block">
              <p className="max-w-[120px] lg:max-w-[150px] truncate text-xs sm:text-sm font-semibold">
                {user?.user?.name || "Memuat..."}
              </p>

              <p className="hidden text-[10px] sm:text-xs text-muted-foreground sm:block">
                {user?.user?.role || ""}
              </p>
            </div>
          </button>

          {/* DROPDOWN */}
          <div className="invisible absolute right-0 top-full mt-2 w-48 sm:w-52 border bg-popover p-1 opacity-0 shadow-lg transition-all group-focus-within:visible group-focus-within:opacity-100 hover:visible hover:opacity-100 z-50">
            <button
              type="button"
              className="flex w-full items-center gap-3 px-3 py-2 text-left text-sm hover:bg-muted"
            >
              <User className="h-4 w-4" />
              Profil
            </button>

            <button
              type="button"
              className="flex w-full items-center gap-3 px-3 py-2 text-left text-sm hover:bg-muted"
            >
              <Settings className="h-4 w-4" />
              Pengaturan
            </button>

            <div className="my-1 border-t" />

            <button
              type="button"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="flex w-full items-center gap-3 px-3 py-2 text-left text-sm text-destructive hover:bg-destructive/10 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <LogOut className="h-4 w-4" />

              {isLoggingOut ? "Keluar..." : "Keluar"}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
