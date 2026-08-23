"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import type { PaginationState } from "@tanstack/react-table";
import { getErrorMessage } from "@/lib/utils";

import type { Product, ProductListResponse } from "../types/product-types";
import type { Category } from "@/features/category/types/category-types";
import type { ProductFormValues } from "../schemas/product-schema";
import { ProductCreateDialog } from "./product-create-dialog";
import { ProductEditDialog } from "./product-edit-dialog";
import { productService } from "../services/product.service";
import { DataTableFilterCombobox } from "@/components/dashboard/filter/filter-combobox";
import { DataTable } from "@/components/data-table/data-table";
import { productColumns } from "./product-columns";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { categoryService } from "@/features/category/services/category.service";

const productType = [
  {
    label: "Menu",
    value: "MENU",
  },
  {
    label: "Barang Tambahan",
    value: "MERCHANDISE",
  },
];

const statusOption = [
  {
    label: "Aktif",
    value: true,
  },
  {
    label: "Non Aktif",
    value: false,
  },
];

function useDebounce<T>(value: T, delay: number = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

export function ProductPage() {
  const [result, setResult] = useState<ProductListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [status, setStatus] = useState<boolean | undefined>(undefined);
  const [categories, setCategories] = useState<Category[]>([]);

  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    setPagination((p) => ({ ...p, pageIndex: 0 }));
  }, [debouncedSearch, type, categoryId, status]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await productService.findAll({
          page: pagination.pageIndex + 1,
          limit: pagination.pageSize,
          search: debouncedSearch || undefined,
          type: type || undefined,
          categoryId: categoryId || undefined,
          status,
        });

        setResult(response);
      } catch (err) {
        console.error(err);
        setError("Gagal memuat data produk");
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [pagination, debouncedSearch, type, categoryId, status, refreshKey]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await categoryService.findAll({
          limit: 100,
        });
        setCategories(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    loadCategories();
  }, []);

  const handleCreate = async (data: ProductFormValues) => {
    await productService.createProduct(data);
    setRefreshKey((k) => k + 1);
  };

  const handleUpdate = async (id: string, data: ProductFormValues) => {
    await productService.updateProduct(id, data);
    setRefreshKey((k) => k + 1);
  };

  const handleUpdateStatus = async (product: Product) => {
    try {
      await productService.updateStatus(product.id, {
        status: !product.status,
      });

      toast.success(
        product.status
          ? "Produk berhasil dinonaktifkan"
          : "Produk berhasil diaktifkan",
      );

      setRefreshKey((k) => k + 1);
    } catch (error) {
      toast.error(getErrorMessage(error, "Gagal memperbarui status produk"));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 border-b pb-5 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Master Produk</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Kelola menu, bahan baku, dan produk lainnya.
          </p>
        </div>

        <ProductCreateDialog categories={categories} onCreate={handleCreate} />
      </div>

      <DataTableToolbar
        search={{
          value: search,
          onChange: setSearch,
          placeholder: "Cari nama / SKU...",
        }}
        filters={
          <>
            <DataTableFilterCombobox
              options={categories.map((category) => ({
                label: category.name,
                value: category.id,
              }))}
              value={categoryId}
              onChange={(value) => setCategoryId(value ?? "")}
              allLabel="Semua Kategori"
              searchPlaceholder="Cari kategori..."
              emptyMessage="Kategori tidak ditemukan."
            />

            <DataTableFilterCombobox
              options={productType}
              value={type}
              onChange={(value) => setType(value ?? "")}
              allLabel="Semua Tipe Produk"
              searchPlaceholder="Cari tipe produk..."
            />

            <DataTableFilterCombobox
              options={statusOption}
              value={status}
              onChange={setStatus}
              allLabel="Semua Status"
              searchPlaceholder="Cari status..."
            />
          </>
        }
      />

      {error && (
        <div className="border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      <DataTable
        columns={productColumns(setEditingProduct, handleUpdateStatus)}
        data={result?.data ?? []}
        loading={loading}
        pagination={pagination}
        pageCount={result?.meta.totalPages ?? 1}
        total={result?.meta.total ?? 0}
        totalLabel="produk"
        onPaginationChange={setPagination}
        emptyMessage="Produk tidak ditemukan"
      />

      <ProductEditDialog
        product={editingProduct}
        categories={categories}
        open={editingProduct !== null}
        onOpenChange={(open) => {
          if (!open) setEditingProduct(null);
        }}
        onUpdate={handleUpdate}
      />
    </div>
  );
}
