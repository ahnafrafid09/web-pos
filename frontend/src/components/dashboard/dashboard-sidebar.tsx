"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import {
  BarChart3,
  Boxes,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  LayoutDashboard,
  Package,
  ReceiptText,
  Settings,
  ShoppingCart,
  Store,
  Truck,
  Users,
  WalletCards,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import type { MeResponse, ModuleCode } from "@/features/auth/types/auth.types";

import { hasModule } from "@/features/auth/utils/module-access";

// ============================================================
// MENU TYPES
// ============================================================

type MenuItem = {
  title: string;
  href: string;
  icon: React.ElementType;

  /**
   * Role yang diperbolehkan mengakses menu.
   */
  roles?: string[];

  /**
   * Module yang diperlukan agar menu tampil.
   *
   * Tidak diisi = menu selalu tersedia.
   */
  module?: ModuleCode;

  badge?: string;
};

type MenuGroup = {
  title: string;
  items: MenuItem[];
};

// ============================================================
// MENU CONFIGURATION
// ============================================================

const menuGroups: MenuGroup[] = [
  // ==========================================================
  // TRANSAKSI
  // ==========================================================

  {
    title: "TRANSAKSI",

    items: [
      {
        title: "Penjualan",
        href: "/dashboard/sales",
        icon: ShoppingCart,

        module: "SALES",
      },

      {
        title: "Pembelian",
        href: "/dashboard/purchases",
        icon: ReceiptText,

        module: "PURCHASE",
      },
    ],
  },

  // ==========================================================
  // OPERASIONAL
  // ==========================================================

  {
    title: "OPERASIONAL",

    items: [
      {
        title: "Stok",
        href: "/dashboard/inventory",
        icon: Boxes,

        module: "INVENTORY",
      },

      {
        title: "Pergerakan Stok",
        href: "/dashboard/inventory/movements",
        icon: ClipboardList,

        module: "INVENTORY",
      },

      {
        title: "Penyesuaian Stok",
        href: "/dashboard/inventory/adjustments",
        icon: ClipboardList,

        module: "INVENTORY",
      },
    ],
  },

  // ==========================================================
  // DATA MASTER
  // ==========================================================

  /**
   * MASTER TIDAK MENGGUNAKAN MODULE.
   *
   * Karena Master merupakan core system:
   * - Product
   * - Category
   * - Raw Material
   * - Supplier
   * - Payment Method
   *
   * Jadi tidak perlu:
   *
   * module: "MASTER"
   */

  {
    title: "DATA MASTER",

    items: [
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
        title: "Bahan Baku",
        href: "/dashboard/raw-materials",
        icon: Package,
        module: "INVENTORY",
      },

      {
        title: "Supplier",
        href: "/dashboard/suppliers",
        icon: Truck,
      },

      {
        title: "Metode Pembayaran",
        href: "/dashboard/payment-methods",
        icon: WalletCards,
      },
    ],
  },

  // ==========================================================
  // MANAJEMEN
  // ==========================================================

  {
    title: "MANAJEMEN",

    items: [
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

        module: "REPORTING",
      },

      {
        title: "Pengaturan",
        href: "/dashboard/settings",
        icon: Settings,

        roles: ["OWNER", "ADMIN"],
      },
    ],
  },
];

// ============================================================
// PROPS
// ============================================================

interface DashboardSidebarProps {
  user: MeResponse | null;

  collapsed: boolean;

  mobileOpen: boolean;

  onToggleCollapse: () => void;

  onCloseMobile: () => void;
}

// ============================================================
// COMPONENT
// ============================================================

export function DashboardSidebar({
  user,
  collapsed,
  mobileOpen,
  onToggleCollapse,
  onCloseMobile,
}: DashboardSidebarProps) {
  const pathname = usePathname();

  // ==========================================================
  // GROUP STATE
  // ==========================================================

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    OPERASIONAL: true,
    "DATA MASTER": true,
  });

  // ==========================================================
  // ACTIVE MENU
  // ==========================================================

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === href;
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  // ==========================================================
  // ACTIVE GROUP
  // ==========================================================

  const isGroupActive = (group: MenuGroup) => {
    return group.items.some((item) => isActive(item.href));
  };

  // ==========================================================
  // TOGGLE GROUP
  // ==========================================================

  const toggleGroup = (title: string) => {
    setOpenGroups((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  // ==========================================================
  // AUTO OPEN ACTIVE GROUP
  // ==========================================================

  useEffect(() => {
    const activeGroups: Record<string, boolean> = {};

    menuGroups.forEach((group) => {
      if (isGroupActive(group)) {
        activeGroups[group.title] = true;
      }
    });

    if (Object.keys(activeGroups).length > 0) {
      setOpenGroups((prev) => ({
        ...prev,
        ...activeGroups,
      }));
    }
  }, [pathname]);

  // ==========================================================
  // FILTER MENU
  // ==========================================================

  const visibleGroups = useMemo(() => {
    return (
      menuGroups

        .map((group) => ({
          ...group,

          items: group.items.filter((item) => {
            // ==================================================
            // ROLE CHECK
            // ==================================================

            if (item.roles && !item.roles.includes(user?.user?.role ?? "")) {
              return false;
            }

            // ==================================================
            // MODULE CHECK
            // ==================================================

            if (item.module && !hasModule(user, item.module)) {
              return false;
            }

            // ==================================================
            // ALLOW
            // ==================================================

            return true;
          }),
        }))

        // ======================================================
        // HAPUS GROUP KOSONG
        // ======================================================

        .filter((group) => group.items.length > 0)
    );
  }, [user]);

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <>
      {/* ===================================================== */}
      {/* MOBILE OVERLAY */}
      {/* ===================================================== */}

      {mobileOpen && (
        <button
          type="button"
          aria-label="Tutup menu"
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-[2px] lg:hidden"
        />
      )}

      {/* ===================================================== */}
      {/* SIDEBAR */}
      {/* ===================================================== */}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col",
          "border-r bg-background",
          "transition-[width,transform] duration-300 ease-in-out",

          collapsed ? "w-[76px]" : "w-[270px]",

          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        {/* =================================================== */}
        {/* BRAND */}
        {/* =================================================== */}

        <div
          className={cn(
            "flex h-[68px] shrink-0 items-center",
            "border-b",

            collapsed ? "justify-center" : "px-5",
          )}
        >
          <Link
            href="/dashboard"
            onClick={onCloseMobile}
            className="group flex items-center gap-3"
          >
            <div
              className={cn(
                "flex h-10 w-10 shrink-0 items-center justify-center",
                "rounded-xl bg-primary text-primary-foreground",
                "shadow-sm",
                "transition-transform duration-200",
                "group-hover:scale-105",
              )}
            >
              <Store className="h-5 w-5" />
            </div>

            {!collapsed && (
              <div className="min-w-0">
                <p className="truncate text-[15px] font-bold tracking-tight">
                  WartegPOS
                </p>

                <p className="mt-0.5 text-[11px] text-muted-foreground">
                  Point of Sale
                </p>
              </div>
            )}

            {!collapsed && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onCloseMobile}
                className="ml-auto lg:hidden"
              >
                <X className="h-5 w-5" />
              </Button>
            )}
          </Link>
        </div>

        {/* =================================================== */}
        {/* BUSINESS CARD */}
        {/* =================================================== */}

        {!collapsed ? (
          <div className="border-b p-4">
            <div
              className={cn(
                "group rounded-xl border bg-muted/20 p-3",
                "transition-colors hover:bg-muted/40",
              )}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Store className="h-4 w-4" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">
                    {user?.tenant?.name || "Memuat usaha..."}
                  </p>

                  <div className="mt-1 flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

                    <p className="text-[11px] text-muted-foreground">
                      {user?.user?.role || "User"}
                    </p>
                  </div>
                </div>

                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex justify-center border-b py-4">
            <div
              title={user?.tenant?.name || "Usaha"}
              className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary"
            >
              <Store className="h-4 w-4" />

              <span className="absolute right-0 top-0 h-2 w-2 rounded-full border-2 border-background bg-emerald-500" />
            </div>
          </div>
        )}

        {/* =================================================== */}
        {/* NAVIGATION */}
        {/* =================================================== */}

        <nav className="flex-1 overflow-y-auto px-3 py-5">
          {/* ================================================= */}
          {/* MENU UTAMA */}
          {/* ================================================= */}

          {!collapsed && (
            <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground/70">
              Menu Utama
            </p>
          )}

          <Link
            href="/dashboard"
            onClick={onCloseMobile}
            title={collapsed ? "Dashboard" : undefined}
            className={cn(
              "group relative flex items-center rounded-lg",
              "text-sm font-medium",
              "transition-all duration-150",

              collapsed ? "h-11 justify-center" : "h-10 gap-3 px-3",

              isActive("/dashboard")
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted/70 hover:text-foreground",
            )}
          >
            {isActive("/dashboard") && (
              <span className="absolute left-0 h-5 w-0.5 rounded-full bg-primary" />
            )}

            <LayoutDashboard
              className={cn(
                "h-[18px] w-[18px] shrink-0",

                isActive("/dashboard")
                  ? "text-primary"
                  : "text-muted-foreground",
              )}
            />

            {!collapsed && "Dashboard"}
          </Link>

          {/* ================================================= */}
          {/* GROUPS */}
          {/* ================================================= */}

          <div className="mt-7 space-y-6">
            {visibleGroups.map((group) => {
              const groupActive = isGroupActive(group);

              const groupOpen = openGroups[group.title];

              return (
                <div key={group.title}>
                  {/* ========================================= */}
                  {/* GROUP TITLE */}
                  {/* ========================================= */}

                  {!collapsed && (
                    <button
                      type="button"
                      onClick={() => toggleGroup(group.title)}
                      className={cn(
                        "mb-2 flex w-full items-center justify-between",
                        "px-3 text-[10px] font-semibold uppercase",
                        "tracking-[0.12em]",
                        "transition-colors",

                        groupActive
                          ? "text-primary"
                          : "text-muted-foreground/70 hover:text-muted-foreground",
                      )}
                    >
                      <span>{group.title}</span>

                      <ChevronDown
                        className={cn(
                          "h-3.5 w-3.5 transition-transform duration-200",

                          groupOpen && "rotate-180",
                        )}
                      />
                    </button>
                  )}

                  {/* ========================================= */}
                  {/* COLLAPSED GROUP */}
                  {/* ========================================= */}

                  {collapsed ? (
                    <div className="relative flex flex-col items-center gap-2">
                      {group.items.map((item) => {
                        const Icon = item.icon;

                        const active = isActive(item.href);

                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={onCloseMobile}
                            title={item.title}
                            className={cn(
                              "relative flex h-11 w-11 items-center justify-center rounded-lg",
                              "transition-colors",

                              active
                                ? "bg-primary/10 text-primary"
                                : "text-muted-foreground hover:bg-muted/70 hover:text-foreground",
                            )}
                          >
                            {active && (
                              <span className="absolute left-0 h-5 w-0.5 rounded-full bg-primary" />
                            )}

                            <Icon className="h-[18px] w-[18px]" />
                          </Link>
                        );
                      })}
                    </div>
                  ) : (
                    /* ======================================= */
                    /* EXPANDED CHILDREN */
                    /* ======================================= */

                    groupOpen && (
                      <div className="space-y-1">
                        {group.items.map((item) => {
                          const Icon = item.icon;

                          const active = isActive(item.href);

                          return (
                            <Link
                              key={item.href}
                              href={item.href}
                              onClick={onCloseMobile}
                              className={cn(
                                "group relative flex h-10 items-center gap-3",
                                "rounded-lg px-3 pl-4",
                                "text-sm font-medium",
                                "transition-all duration-150",

                                active
                                  ? "bg-primary/10 text-primary"
                                  : "text-muted-foreground hover:bg-muted/70 hover:text-foreground",
                              )}
                            >
                              {active && (
                                <span className="absolute left-0 h-5 w-0.5 rounded-full bg-primary" />
                              )}

                              <Icon
                                className={cn(
                                  "h-[17px] w-[17px] shrink-0",

                                  active
                                    ? "text-primary"
                                    : "text-muted-foreground",
                                )}
                              />

                              <span className="truncate">{item.title}</span>

                              {item.badge && (
                                <span className="ml-auto rounded-full bg-destructive/10 px-2 py-0.5 text-[10px] font-semibold text-destructive">
                                  {item.badge}
                                </span>
                              )}
                            </Link>
                          );
                        })}
                      </div>
                    )
                  )}
                </div>
              );
            })}
          </div>
        </nav>

        {/* =================================================== */}
        {/* USER / FOOTER */}
        {/* =================================================== */}

        <div className="shrink-0 border-t p-3">
          {!collapsed ? (
            <div className="flex items-center gap-3 rounded-xl p-2.5 transition-colors hover:bg-muted/60">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                {user?.user?.username?.slice(0, 2).toUpperCase() || "US"}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">
                  {user?.user?.username || "User"}
                </p>

                <p className="truncate text-[11px] text-muted-foreground">
                  {user?.user?.role || ""}
                </p>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={onToggleCollapse}
                className="h-8 w-8"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleCollapse}
              title="Buka sidebar"
              className="h-11 w-full"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}

          {/* ================================================= */}
          {/* MOBILE */}
          {/* ================================================= */}

          <Button
            variant="ghost"
            onClick={onCloseMobile}
            className="mt-2 flex w-full justify-start gap-3 lg:hidden"
          >
            <X className="h-4 w-4" />
            Tutup Menu
          </Button>
        </div>
      </aside>
    </>
  );
}
