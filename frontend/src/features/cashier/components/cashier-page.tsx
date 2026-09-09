"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "@/features/auth/provider/auth-provider";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { productService } from "@/features/product/services/product.service";
import { categoryService } from "@/features/category/services/category.service";

import type { Product, Category } from "../types/cashier-types";

import { CashierProductCard } from "./cashier-product-card";
import { CashierCart } from "./cashier-cart";
import { CashierPaymentModal } from "./cashier-payment-modal";
import { CashierSplitBillModal } from "./cashier-split-bill-modal";

import { useCashierStore } from "../store/cashier.store";
import { cashierService } from "../services/cashier.service";

import {
  SearchIcon,
  XIcon,
  ShoppingBagIcon,
  AlertCircleIcon,
  PackageOpenIcon,
} from "lucide-react";

import { toast } from "sonner";

export function CashierPage() {
  const { user, loading: authLoading } = useAuth();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [loading, setLoading] = useState(true);
  const [paginating, setPaginating] = useState(false);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const [error, setError] = useState<string | null>(null);

  // Infinite scroll sentinel
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  // Prevent duplicate pagination request
  const fetchingRef = useRef(false);

  // Prevent stale request from updating state
  const requestIdRef = useRef(0);

  const isAuthorized =
    user?.user.role === "CASHIER" ||
    user?.user.role === "SUPER_ADMIN" ||
    user?.user.role === "OWNER" ||
    user?.user.role === "ADMIN";

  /**
   * ============================================================
   * FETCH CATEGORIES
   * ============================================================
   */
  const fetchCategories = useCallback(async () => {
    try {
      const response = await categoryService.findAll({
        status: true,
        limit: 100,
      });

      setCategories(response.data.filter((category) => category.status));
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    }
  }, []);

  const fetchProducts = useCallback(
    async (currentPage: number, requestId: number) => {
      try {
        const query: any = {
          page: currentPage,
          limit: 20,
        };

        if (search.trim()) {
          query.search = search.trim();
        }

        if (selectedCategory) {
          query.categoryId = selectedCategory;
        }

        const response = await cashierService.listProduct(query);

        if (requestId !== requestIdRef.current) {
          return;
        }

        if (currentPage === 1) {
          setProducts(response.data);
        } else {
          setProducts((prev) => {
            // Prevent duplicate product
            const existingIds = new Set(prev.map((item) => item.id));

            const newProducts = response.data.filter(
              (item) => !existingIds.has(item.id),
            );

            return [...prev, ...newProducts];
          });
        }

        setHasMore(currentPage < response.meta.totalPages);
        setError(null);
      } catch (err) {
        if (requestId !== requestIdRef.current) {
          return;
        }

        console.error("Failed to fetch products:", err);
        setError("Gagal memuat produk");
      }
    },
    [search, selectedCategory],
  );

  /**
   * ============================================================
   * INITIAL CATEGORY FETCH
   * ============================================================
   */
  useEffect(() => {
    if (authLoading) return;

    fetchCategories();
  }, [authLoading, fetchCategories]);

  /**
   * ============================================================
   * SEARCH / CATEGORY FILTER
   * ============================================================
   */
  useEffect(() => {
    if (authLoading) return;

    const timer = setTimeout(async () => {
      const requestId = ++requestIdRef.current;

      // Reset pagination
      setPage(1);
      setHasMore(true);
      setLoading(true);
      setError(null);

      // Reset fetching state
      fetchingRef.current = false;

      try {
        await fetchProducts(1, requestId);
      } finally {
        if (requestId === requestIdRef.current) {
          setLoading(false);
        }
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [search, selectedCategory, authLoading, fetchProducts]);

  /**
   * ============================================================
   * LOAD MORE
   * ============================================================
   */
  useEffect(() => {
    if (authLoading) return;
    if (page === 1) return;
    if (!hasMore) return;

    const requestId = requestIdRef.current;

    const loadMore = async () => {
      if (fetchingRef.current) return;

      fetchingRef.current = true;
      setPaginating(true);

      try {
        await fetchProducts(page, requestId);
      } finally {
        fetchingRef.current = false;

        if (requestId === requestIdRef.current) {
          setPaginating(false);
        }
      }
    };

    loadMore();
  }, [page, hasMore, authLoading, fetchProducts]);

  /**
   * ============================================================
   * INTERSECTION OBSERVER
   * ============================================================
   */
  useEffect(() => {
    const node = loadMoreRef.current;

    if (!node) return;
    if (!hasMore) return;
    if (loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0];

        if (!firstEntry.isIntersecting) return;
        if (fetchingRef.current) return;
        if (!hasMore) return;

        setPage((prev) => prev + 1);
      },
      {
        root: null,
        rootMargin: "300px",
        threshold: 0,
      },
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [hasMore, loading, products.length]);

  /**
   * ============================================================
   * CHECKOUT
   * ============================================================
   */
  async function handleCheckout() {
    const store = useCashierStore.getState();

    const cart = store.cart;
    const paymentSplits = store.paymentSplits;

    if (cart.length === 0) return;

    const payload = {
      items: cart.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
      })),

      payments: paymentSplits.map((split) => ({
        paymentMethodId: split.paymentMethodId,
        amount: split.amount,
      })),
    };

    try {
      await cashierService.checkout(payload);

      toast.success("Pembayaran berhasil!");

      store.resetTransaction();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Pembayaran gagal");
    }
  }

  /**
   * ============================================================
   * AUTH LOADING
   * ============================================================
   */
  if (authLoading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-muted/20">
        <div className="w-full max-w-xs px-6">
          <div className="space-y-3">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />

            <div className="space-y-1 text-center">
              <p className="text-sm font-medium">Memuat halaman kasir</p>
              <p className="text-xs text-muted-foreground">
                Menyiapkan data...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /**
   * ============================================================
   * UNAUTHORIZED
   * ============================================================
   */
  if (!isAuthorized) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center bg-muted/20 px-4">
        <div className="flex max-w-md flex-col items-center text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-md border bg-background">
            <AlertCircleIcon className="h-6 w-6 text-destructive" />
          </div>

          <h2 className="text-lg font-semibold text-foreground">
            Akses Ditolak
          </h2>

          <p className="mt-1.5 text-sm text-muted-foreground">
            Hanya pengguna dengan role CASHIER yang dapat mengakses halaman ini.
          </p>
        </div>
      </div>
    );
  }

  /**
   * ============================================================
   * MAIN CASHIER PAGE
   * ============================================================
   */
  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-muted/20 lg:h-full lg:flex-row">
      {/* ========================================================
          PRODUCT AREA
      ======================================================== */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* ======================================================
            HEADER
        ====================================================== */}
        <header className="shrink-0 border-b bg-background">
          <div className="space-y-3 p-3 sm:p-4">
            {/* TOP BAR */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-2.5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/10">
                  <ShoppingBagIcon className="h-4 w-4 text-primary" />
                </div>

                <div className="min-w-0">
                  <h1 className="truncate text-base font-semibold leading-none sm:text-lg">
                    Kasir
                  </h1>

                  <p className="mt-1 hidden text-[11px] text-muted-foreground sm:block">
                    Pilih produk untuk membuat transaksi
                  </p>
                </div>
              </div>

              {user?.user && (
                <Badge
                  variant="secondary"
                  className="max-w-[180px] shrink-0 rounded-md border px-2.5 py-1 text-[11px] font-medium"
                >
                  <span className="truncate">
                    {user.user.name} · {user.user.role}
                  </span>
                </Badge>
              )}
            </div>

            {/* SEARCH */}
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                placeholder="Cari produk..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-10 rounded-md border bg-muted/30 pl-9 pr-9 text-sm shadow-none transition-colors focus:bg-background"
              />

              {search && (
                <Button
                  type="button"
                  size="icon-xs"
                  variant="ghost"
                  className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 rounded-sm text-muted-foreground hover:text-foreground"
                  onClick={() => setSearch("")}
                >
                  <XIcon className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>

            {/* CATEGORY */}
            <div className="-mx-1 overflow-x-auto px-1 pb-0.5 scrollbar-thin">
              <div className="flex min-w-max gap-1.5">
                <Button
                  type="button"
                  variant={selectedCategory ? "outline" : "default"}
                  size="sm"
                  onClick={() => setSelectedCategory("")}
                  className="h-8 shrink-0 rounded-md px-3 text-xs font-medium shadow-none"
                >
                  Semua
                </Button>

                {categories.map((category) => {
                  const isSelected = selectedCategory === category.id;

                  return (
                    <Button
                      key={category.id}
                      type="button"
                      variant={isSelected ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(category.id)}
                      className="h-8 shrink-0 rounded-md px-3 text-xs font-medium shadow-none"
                    >
                      {category.name}
                    </Button>
                  );
                })}
              </div>
            </div>
          </div>
        </header>

        {/* ======================================================
            ERROR
        ====================================================== */}
        {error && (
          <div className="flex shrink-0 items-center gap-2 border-b bg-destructive/5 px-4 py-2.5 text-sm text-destructive">
            <AlertCircleIcon className="h-4 w-4 shrink-0" />

            <span>{error}</span>
          </div>
        )}

        {/* ======================================================
            PRODUCTS
        ====================================================== */}
        <main className="min-h-0 flex-1 overflow-y-auto">
          <div className="p-3 sm:p-4">
            {loading && products.length === 0 ? (
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 lg:grid-cols-4 xl:grid-cols-5">
                {Array.from({ length: 10 }).map((_, index) => (
                  <Card
                    key={index}
                    className="overflow-hidden rounded-md border bg-background shadow-none"
                  >
                    <div className="aspect-square animate-pulse bg-muted" />
                    <CardContent className="space-y-2.5 p-3">
                      <div className="h-4 w-[85%] animate-pulse rounded-sm bg-muted" />
                      <div className="h-3 w-[55%] animate-pulse rounded-sm bg-muted" />
                      <div className="h-4 w-[65%] animate-pulse rounded-sm bg-muted" />
                      <div className="mt-3 h-8 w-full animate-pulse rounded-md bg-muted" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : products.length === 0 && !loading ? (
              <div className="flex min-h-90 items-center justify-center">
                <div className="flex max-w-sm flex-col items-center text-center">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-md border bg-background">
                    <PackageOpenIcon className="h-6 w-6 text-muted-foreground/50" />
                  </div>

                  <p className="text-sm font-semibold">Tidak ada produk</p>

                  {search || selectedCategory ? (
                    <p className="mt-1 max-w-sm text-xs leading-relaxed text-muted-foreground">
                      Tidak ada produk yang sesuai dengan pencarian atau filter
                      yang dipilih.
                    </p>
                  ) : (
                    <p className="mt-1 text-xs text-muted-foreground">
                      Belum ada produk yang tersedia.
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 lg:grid-cols-4 xl:grid-cols-5">
                  {products.map((product) => (
                    <CashierProductCard key={product.id} product={product} />
                  ))}
                </div>

                {hasMore && (
                  <div ref={loadMoreRef} className="mt-3">
                    {paginating && (
                      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 lg:grid-cols-4 xl:grid-cols-5">
                        {Array.from({ length: 5 }).map((_, index) => (
                          <Card
                            key={index}
                            className="overflow-hidden rounded-md border bg-background shadow-none"
                          >
                            <div className="aspect-square animate-pulse bg-muted" />

                            <CardContent className="space-y-2.5 p-3">
                              <div className="h-4 w-[85%] animate-pulse rounded-sm bg-muted" />

                              <div className="h-3 w-[55%] animate-pulse rounded-sm bg-muted" />

                              <div className="h-4 w-[65%] animate-pulse rounded-sm bg-muted" />

                              <div className="mt-3 h-8 w-full animate-pulse rounded-md bg-muted" />
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* ==================================================
                    END OF PRODUCTS
                ================================================== */}
                {!hasMore && products.length > 0 && (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-md border bg-background">
                      <PackageOpenIcon className="h-4 w-4 text-muted-foreground/50" />
                    </div>

                    <p className="text-xs font-medium text-muted-foreground">
                      Semua produk telah dimuat
                    </p>

                    <p className="mt-0.5 text-[11px] text-muted-foreground/70">
                      {products.length} produk tersedia
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>

      <aside
        className="
          w-full shrink-0
          border-t bg-background
          lg:h-full lg:w-[380px] lg:border-l lg:border-t-0
          xl:w-[420px]
        "
      >
        <div className="flex h-[55vh] flex-col lg:h-full lg:overflow-hidden">
          <CashierCart />
        </div>
      </aside>

      <CashierPaymentModal />

      <CashierSplitBillModal />
    </div>
  );
}
