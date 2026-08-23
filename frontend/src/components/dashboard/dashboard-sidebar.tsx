"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  BarChart3,
  Boxes,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  LayoutDashboard,
  Menu,
  Package,
  ReceiptText,
  Settings,
  ShoppingCart,
  Store,
  Users,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { MeResponse } from "@/features/auth/types/auth.types";

const menuItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Transaksi",
    href: "/dashboard/transactions",
    icon: ShoppingCart,
  },
  {
    title: "Produk",
    href: "/dashboard/products",
    icon: Package,
  },
  {
    title: "Kategori",
    href: "/dashboard/categories",
    icon: Boxes,
  },
  {
    title: "Stok",
    href: "/dashboard/stock",
    icon: ClipboardList,
  },
  {
    title: "Pembelian",
    href: "/dashboard/purchases",
    icon: ReceiptText,
  },
];

const managementItems = [
  {
    title: "Pengguna",
    href: "/dashboard/users",
    icon: Users,
    roles: ["OWNER", "ADMIN"],
  },
  {
    title: "Laporan",
    href: "/dashboard/reports",
    icon: BarChart3,
    roles: ["OWNER", "ADMIN"],
  },
  {
    title: "Pengaturan",
    href: "/dashboard/settings",
    icon: Settings,
    roles: ["OWNER", "ADMIN"],
  },
];

interface DashboardSidebarProps {
  user: MeResponse | null;
  collapsed: boolean;
  mobileOpen: boolean;
  onToggleCollapse: () => void;
  onCloseMobile: () => void;
}

export function DashboardSidebar({
  user,
  collapsed,
  mobileOpen,
  onToggleCollapse,
  onCloseMobile,
}: DashboardSidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === href;
    }

    return pathname.startsWith(href);
  };

  const visibleManagementItems = managementItems.filter((item) => {
    if (!item.roles) return true;

    return user && item.roles.includes(user.user.role);
  });

  return (
    <>
      {/* MOBILE OVERLAY */}
      {mobileOpen && (
        <button
          type="button"
          aria-label="Tutup menu"
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col border-r bg-background transition-all duration-300",
          collapsed ? "w-[72px]" : "w-64",

          "lg:translate-x-0",

          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        {/* BRAND */}
        <div
          className={cn(
            "flex h-16 items-center border-b",
            collapsed ? "justify-center px-3" : "justify-between px-5",
          )}
        >
          <Link
            href="/dashboard"
            onClick={onCloseMobile}
            className="flex min-w-0 items-center gap-3"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Store className="h-5 w-5" />
            </div>

            {!collapsed && (
              <div className="min-w-0">
                <p className="truncate font-bold leading-none">WartegPOS</p>

                <p className="mt-1 text-xs text-muted-foreground">
                  Point of Sale
                </p>
              </div>
            )}
          </Link>

          {/* MOBILE CLOSE */}
          {!collapsed && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onCloseMobile}
              className="lg:hidden"
            >
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>

        {/* TENANT */}
        {!collapsed && (
          <div className="border-b p-4">
            <div className="border bg-muted/30 p-3">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <Store className="h-4 w-4" />
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">
                    {user?.tenant?.name || "Memuat usaha..."}
                  </p>

                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {user?.user?.role || ""}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* COLLAPSED TENANT ICON */}
        {collapsed && (
          <div className="flex justify-center border-b p-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 text-primary">
              <Store className="h-4 w-4" />
            </div>
          </div>
        )}

        {/* NAVIGATION */}
        <nav className="flex-1 overflow-y-auto py-5">
          {!collapsed && (
            <p className="mb-2 px-6 text-[11px] font-semibold tracking-wider text-muted-foreground">
              MENU UTAMA
            </p>
          )}

          <div className="space-y-1 px-3">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={collapsed ? item.title : undefined}
                  onClick={onCloseMobile}
                  className={cn(
                    "flex items-center border-l-2 text-sm font-medium transition-colors",
                    collapsed
                      ? "justify-center px-2 py-3"
                      : "gap-3 px-3 py-2.5",

                    active
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-transparent text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />

                  {!collapsed && item.title}
                </Link>
              );
            })}
          </div>

          <div className="mx-3 my-6 border-t" />

          {!collapsed && (
            <p className="mb-2 px-6 text-[11px] font-semibold tracking-wider text-muted-foreground">
              MANAJEMEN
            </p>
          )}

          <div className="space-y-1 px-3">
            {visibleManagementItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={collapsed ? item.title : undefined}
                  onClick={onCloseMobile}
                  className={cn(
                    "flex items-center border-l-2 text-sm font-medium transition-colors",
                    collapsed
                      ? "justify-center px-2 py-3"
                      : "gap-3 px-3 py-2.5",

                    active
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-transparent text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />

                  {!collapsed && item.title}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* BOTTOM */}
        <div className="border-t p-3">
          <Button
            variant="ghost"
            onClick={onToggleCollapse}
            className={cn(
              "hidden w-full lg:flex",
              collapsed ? "justify-center px-2" : "justify-start gap-3",
            )}
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <>
                <ChevronLeft className="h-4 w-4" />
                Sembunyikan Menu
              </>
            )}
          </Button>

          {/* Mobile close */}
          <Button
            variant="ghost"
            onClick={onCloseMobile}
            className="flex w-full justify-start gap-3 lg:hidden"
          >
            <X className="h-4 w-4" />
            Tutup Menu
          </Button>
        </div>
      </aside>
    </>
  );
}
