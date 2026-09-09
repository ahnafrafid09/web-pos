"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import type { PaginationState } from "@tanstack/react-table";
import { getErrorMessage } from "@/lib/utils";

import { SupplierEditDialog } from "./supplier-edit-dialog";

import { DataTableFilterCombobox } from "@/components/dashboard/filter/filter-combobox";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { SupplierFormValues } from "../schemas/supplier-schemas";
import { Supplier, SupplierListResponse } from "../types/supplier-types";
import { supplierService } from "../services/supplier.service";
import { SupplierCreateDialog } from "./supplier-create-dialog";
import { SupplierColumns } from "./supplier-columns";

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

export function SupplierPage() {
  const [result, setResult] = useState<SupplierListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
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
    const loadSuppliers = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await supplierService.findAll({
          page: pagination.pageIndex + 1,
          limit: pagination.pageSize,
          search: debouncedSearch || undefined,
          status,
        });

        setResult(response);
      } catch (err) {
        console.error(err);
        setError("Gagal memuat data supplier");
      } finally {
        setLoading(false);
      }
    };

    loadSuppliers();
  }, [pagination, debouncedSearch, status, refreshKey]);

  const handleCreate = async (data: SupplierFormValues) => {
    await supplierService.create(data);
    setRefreshKey((k) => k + 1);
  };

  const handleUpdate = async (id: string, data: SupplierFormValues) => {
    await supplierService.update(id, data);
    setRefreshKey((k) => k + 1);
  };

  const handleUpdateStatus = async (supplier: Supplier) => {
    try {
      await supplierService.updateStatus(supplier.id, {
        status: !supplier.status,
      });

      toast.success(
        supplier.status
          ? "Supplier berhasil dinonaktifkan"
          : "Supplier berhasil diaktifkan",
      );

      setRefreshKey((k) => k + 1);
    } catch (error) {
      toast.error(getErrorMessage(error, "Gagal memperbarui status supplier"));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 border-b pb-5 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Master Supplier</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Kelola supplier, atau toko langganan untuk melakukan pembelian.
          </p>
        </div>

        <SupplierCreateDialog onCreate={handleCreate} />
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
        columns={SupplierColumns(setEditingSupplier, handleUpdateStatus)}
        data={result?.data ?? []}
        loading={loading}
        pagination={pagination}
        pageCount={result?.meta.totalPages ?? 1}
        total={result?.meta.total ?? 0}
        totalLabel="produk"
        onPaginationChange={setPagination}
        emptyMessage="Produk tidak ditemukan"
      />

      <SupplierEditDialog
        supplier={editingSupplier}
        open={editingSupplier !== null}
        onOpenChange={(open) => {
          if (!open) setEditingSupplier(null);
        }}
        onUpdate={handleUpdate}
      />
    </div>
  );
}
