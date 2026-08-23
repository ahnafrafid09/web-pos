"use client";

import { useEffect, useState } from "react";

import { DashboardHeader } from "./dashboard-header";
import { DashboardSidebar } from "./dashboard-sidebar";

import { authService } from "@/features/auth/services/auth.services";
import type { MeResponse } from "@/features/auth/types/auth.types";
import { authStorage } from "@/features/auth/lib/auth-storage";

import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart3, LockKeyhole, LogIn, Store } from "lucide-react";
import Link from "next/link";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

function DashboardPreviewCard({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="border bg-muted/20 p-4">
      <p className="text-xs text-muted-foreground">{title}</p>

      <p className="mt-3 text-xl font-bold tracking-tight text-muted-foreground">
        {value}
      </p>
    </div>
  );
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [user, setUser] = useState<MeResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = authStorage.getAccessToken();

        // Belum login → jangan redirect
        // Dashboard tetap ditampilkan sebagai guest
        if (!token) {
          return;
        }

        const response = await authService.me();

        setUser(response);
      } catch (error) {
        console.error("Gagal mengambil data user", error);

        // Token mungkin invalid / expired
        authStorage.clear();

        // Jangan redirect langsung
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/30">
        <div className="border bg-background px-6 py-4 text-sm text-muted-foreground shadow-sm">
          Memuat dashboard...
        </div>
      </div>
    );
  }

  // BELUM LOGIN
  if (!user) {
    return (
      <div className="relative flex min-h-screen overflow-hidden bg-background">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:48px_48px] opacity-40" />

        <div className="absolute -right-40 -top-40 h-[500px] w-[500px] border-[80px] border-primary/10" />
        <div className="absolute -bottom-48 -left-48 h-[500px] w-[500px] border-[80px] border-primary/5" />

        <main className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl items-center px-6 py-10 lg:px-10">
          <div className="grid w-full items-center gap-12 lg:grid-cols-2 lg:gap-20">
            {/* LEFT CONTENT */}
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-md bg-primary text-primary-foreground shadow-sm">
                  <Store className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-lg font-bold leading-none">WartegPOS</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Point of Sale System
                  </p>
                </div>
              </div>

              <div className="mt-14">
                <div className="mb-5 flex w-fit items-center gap-2 border border-primary/20 bg-primary/5 px-3 py-1.5 text-xs font-semibold text-primary">
                  <LockKeyhole className="h-3.5 w-3.5" />
                  AKSES DASHBOARD
                </div>

                <h1 className="max-w-xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                  Kelola usaha Anda dalam{" "}
                  <span className="text-primary">satu sistem.</span>
                </h1>

                <p className="mt-6 max-w-lg text-base leading-7 text-muted-foreground sm:text-lg">
                  Anda perlu masuk terlebih dahulu untuk mengakses dashboard,
                  mengelola produk, stok, transaksi, dan memantau perkembangan
                  usaha Anda.
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Button size="lg" className="sm:min-w-40">
                    <Link href="/login">Masuk ke Akun</Link>
                  </Button>

                  <Button variant="outline" size="lg" className="sm:min-w-40">
                    <Link href="/register">Buat Akun Usaha</Link>
                  </Button>
                </div>
              </div>
            </div>

            {/* RIGHT PANEL */}
            <div className="hidden border bg-card shadow-sm lg:block">
              {/* Panel header */}
              <div className="flex items-center justify-between border-b px-6 py-5">
                <div>
                  <p className="font-semibold">Dashboard Usaha</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Masuk untuk melihat data Anda
                  </p>
                </div>

                <div className="flex h-9 w-9 items-center justify-center border bg-muted">
                  <LockKeyhole className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>

              {/* Fake dashboard preview */}
              <div className="space-y-5 p-6">
                <div className="grid grid-cols-2 gap-4">
                  <DashboardPreviewCard
                    title="Penjualan Hari Ini"
                    value="Rp ••••••"
                  />

                  <DashboardPreviewCard
                    title="Total Transaksi"
                    value="•• transaksi"
                  />
                </div>

                <div className="border p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">Ringkasan Penjualan</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Data tersedia setelah Anda masuk
                      </p>
                    </div>

                    <BarChart3 className="h-5 w-5 text-muted-foreground" />
                  </div>

                  {/* Fake chart */}
                  <div className="mt-8 flex h-32 items-end gap-3">
                    {[45, 70, 55, 85, 60, 90, 75, 100].map((height, index) => (
                      <div
                        key={index}
                        className="flex-1 bg-primary/10"
                        style={{ height: `${height}%` }}
                      />
                    ))}
                  </div>
                </div>

                <div className="border p-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center bg-primary/10 text-primary">
                      <Store className="h-4 w-4" />
                    </div>

                    <div>
                      <p className="text-sm font-semibold">
                        Dashboard siap digunakan
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Masuk ke akun Anda untuk mulai mengelola usaha.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-muted/30">
      <DashboardSidebar
        user={user}
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onToggleCollapse={() => setCollapsed((value) => !value)}
        onCloseMobile={() => setMobileOpen(false)}
      />

      <div
        className={`min-h-screen transition-all duration-300 ${
          collapsed ? "lg:pl-[72px]" : "lg:pl-64"
        }`}
      >
        <DashboardHeader user={user} onOpenMobile={() => setMobileOpen(true)} />

        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
