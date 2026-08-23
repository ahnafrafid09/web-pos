"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import type { PaginationState } from "@tanstack/react-table";
import { getErrorMessage } from "@/lib/utils";

import type {
  Category,
  CategoryListResponse,
} from "@/features/category/types/category-types";
import { ProductCreateDialog } from "./category-create-dialog";
import { CategoryEditDialog } from "./category-edit-dialog";

import { DataTableFilterCombobox } from "@/components/dashboard/filter/filter-combobox";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { categoryService } from "@/features/category/services/category.service";
import { CategoryColumns } from "./category-columns";
import { CategoryFormValues } from "../schemas/category-schemas";

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

export function CategoryPage() {
  const [result, setResult] = useState<CategoryListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<boolean | undefined>(undefined);

  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    setPagination((p) => ({ ...p, pageIndex: 0 }));
  }, [debouncedSearch, status]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await categoryService.findAll({
          page: pagination.pageIndex + 1,
          limit: pagination.pageSize,
          search: debouncedSearch || undefined,
          status,
        });

        setResult(response);
      } catch (err) {
        console.error(err);
        setError("Gagal memuat data category");
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, [pagination, debouncedSearch, status, refreshKey]);

  const handleCreate = async (data: CategoryFormValues) => {
    await categoryService.createCategory(data);
    setRefreshKey((k) => k + 1);
  };

  const handleUpdate = async (id: string, data: CategoryFormValues) => {
    await categoryService.updateCategory(id, data);
    setRefreshKey((k) => k + 1);
  };

  const handleUpdateStatus = async (category: Category) => {
    try {
      await categoryService.updateStatus(category.id, {
        status: !category.status,
      });

      toast.success(
        category.status
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

        <ProductCreateDialog onCreate={handleCreate} />
      </div>

      <DataTableToolbar
        search={{
          value: search,
          onChange: setSearch,
          placeholder: "Cari nama...",
        }}
        filters={
          <>
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
        columns={CategoryColumns(setEditingCategory, handleUpdateStatus)}
        data={result?.data ?? []}
        loading={loading}
        pagination={pagination}
        pageCount={result?.meta.totalPages ?? 1}
        total={result?.meta.total ?? 0}
        totalLabel="produk"
        onPaginationChange={setPagination}
        emptyMessage="Produk tidak ditemukan"
      />

      <CategoryEditDialog
        category={editingCategory}
        open={editingCategory !== null}
        onOpenChange={(open) => {
          if (!open) setEditingCategory(null);
        }}
        onUpdate={handleUpdate}
      />
    </div>
  );
}
