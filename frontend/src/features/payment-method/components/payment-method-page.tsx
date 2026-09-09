"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import type { PaginationState } from "@tanstack/react-table";
import { getErrorMessage } from "@/lib/utils";

import { PaymentMethodEditDialog } from "./payment-method-edit-dialog";

import { DataTableFilterCombobox } from "@/components/dashboard/filter/filter-combobox";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { PaymentMethodFormValues } from "../schemas/payment-method-schemas";
import {
  PaymentMethod,
  PaymentMethodListResponse,
  UsageType,
} from "../types/payment-method-types";
import { paymentMethodService } from "../services/payment-method.service";
import { PaymentMethodCreateDialog } from "./payment-method-create-dialog";
import { PaymentMethodColumns } from "./payment-method-columns";

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

const usageTypeOption = [
  {
    label: "Purchase",
    value: "PURCHASE",
  },
  {
    label: "Transaction",
    value: "TRANSACTION",
  },
  {
    label: "Both",
    value: "BOTH",
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

export function PaymentMethodPage() {
  const [result, setResult] = useState<PaymentMethodListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingPaymentMethod, setEditingPaymentMethod] =
    useState<PaymentMethod | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [search, setSearch] = useState("");
  const [usageType, setUsageType] = useState<UsageType | undefined>(undefined);
  const [status, setStatus] = useState<boolean | undefined>(undefined);

  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    setPagination((p) => ({ ...p, pageIndex: 0 }));
  }, [debouncedSearch, usageType, status]);

  useEffect(() => {
    const loadPaymentMethods = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await paymentMethodService.findAll({
          page: pagination.pageIndex + 1,
          limit: pagination.pageSize,
          search: debouncedSearch || undefined,
          usageType,
          status,
        });

        setResult(response);
      } catch (err) {
        console.error(err);
        setError("Gagal memuat data payment method");
      } finally {
        setLoading(false);
      }
    };

    loadPaymentMethods();
  }, [pagination, debouncedSearch, usageType, status, refreshKey]);

  const handleCreate = async (data: PaymentMethodFormValues) => {
    await paymentMethodService.create(data);
    setRefreshKey((k) => k + 1);
  };

  const handleUpdate = async (id: string, data: PaymentMethodFormValues) => {
    await paymentMethodService.update(id, data);
    setRefreshKey((k) => k + 1);
  };

  const handleUpdateStatus = async (paymentMethod: PaymentMethod) => {
    try {
      await paymentMethodService.updateStatus(paymentMethod.id, {
        status: !paymentMethod.status,
      });

      toast.success(
        paymentMethod.status
          ? "Payment method berhasil dinonaktifkan"
          : "Payment method berhasil diaktifkan",
      );

      setRefreshKey((k) => k + 1);
    } catch (error) {
      toast.error(
        getErrorMessage(error, "Gagal memperbarui status payment method"),
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 border-b pb-5 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Master Payment Method
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Kelola metode pembayaran untuk transaksi dan pembelian.
          </p>
        </div>

        <PaymentMethodCreateDialog onCreate={handleCreate} />
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
              options={usageTypeOption.map((opt) => ({
                label: opt.label,
                value: opt.value,
              }))}
              value={usageType}
              onChange={(val) => setUsageType(val as UsageType | undefined)}
              allLabel="Semua Usage Type"
              searchPlaceholder="Cari usage type..."
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
        columns={PaymentMethodColumns(
          setEditingPaymentMethod,
          handleUpdateStatus,
        )}
        data={result?.data ?? []}
        loading={loading}
        pagination={pagination}
        pageCount={result?.meta.totalPages ?? 1}
        total={result?.meta.total ?? 0}
        totalLabel="payment method"
        onPaginationChange={setPagination}
        emptyMessage="Payment method tidak ditemukan"
      />

      <PaymentMethodEditDialog
        paymentMethod={editingPaymentMethod}
        open={editingPaymentMethod !== null}
        onOpenChange={(open: boolean) => {
          if (!open) setEditingPaymentMethod(null);
        }}
        onUpdate={handleUpdate}
      />
    </div>
  );
}
