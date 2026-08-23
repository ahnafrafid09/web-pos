"use client";

import { useRouter } from "next/navigation";

import { LogOut, Menu, Settings, Store, User } from "lucide-react";

import type { MeResponse } from "@/features/auth/types/auth.types";
import { authStorage } from "@/features/auth/lib/auth-storage";

import { Button } from "@/components/ui/button";
import { authService } from "@/features/auth/services/auth.services";
import { useState } from "react";

interface DashboardHeaderProps {
  user: MeResponse | null;
  onOpenMobile: () => void;
}

export function DashboardHeader({ user, onOpenMobile }: DashboardHeaderProps) {
  const router = useRouter();

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);

      await authService.logout();
    } catch (error) {
      console.error("Gagal logout dari server", error);
    } finally {
      // Tetap hapus token dari browser
      // meskipun request API gagal
      authStorage.clear();

      router.replace("/login");

      setIsLoggingOut(false);
    }
  };

  const getInitial = () => {
    return user?.user?.name?.charAt(0).toUpperCase() || "U";
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/95 px-4 backdrop-blur sm:px-6">
      {/* LEFT */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={onOpenMobile}
        >
          <Menu className="h-5 w-5" />
        </Button>

        <div>
          <h1 className="text-sm font-semibold sm:text-base">
            {user?.tenant?.name || "Dashboard"}
          </h1>

          <p className="hidden text-xs text-muted-foreground sm:block">
            Kelola usaha Anda dari satu tempat
          </p>
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-3">
        {/* BUSINESS */}
        <div className="hidden items-center gap-2 border-r pr-4 md:flex">
          <Store className="h-4 w-4 text-muted-foreground" />

          <span className="max-w-[180px] truncate text-sm">
            {user?.tenant?.name || "Memuat..."}
          </span>
        </div>

        {/* USER DROPDOWN SEDERHANA */}
        <div className="group relative">
          <button
            type="button"
            className="flex items-center gap-3 border px-2 py-1.5 transition-colors hover:bg-muted"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-sm font-bold text-primary-foreground">
              {getInitial()}
            </div>

            <div className="hidden text-left sm:block">
              <p className="max-w-[150px] truncate text-sm font-semibold">
                {user?.user?.name || "Memuat..."}
              </p>

              <p className="text-xs text-muted-foreground">
                {user?.user?.role || ""}
              </p>
            </div>
          </button>

          {/* DROPDOWN */}
          <div className="invisible absolute right-0 top-full mt-2 w-52 border bg-popover p-1 opacity-0 shadow-lg transition-all group-focus-within:visible group-focus-within:opacity-100 hover:visible hover:opacity-100">
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
              className="flex w-full items-center gap-3 px-3 py-2 text-left text-sm text-destructive hover:bg-destructive/10"
            >
              <LogOut className="h-4 w-4" />
              Keluar
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
