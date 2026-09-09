"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import type { PaginationState } from "@tanstack/react-table";
import { getErrorMessage } from "@/lib/utils";

import type {
  RawMaterial,
  RawMaterialListResponse,
} from "../types/raw-material-types";

import type { RawMaterialFormValues } from "../schemas/raw-material-schema";

import { RawMaterialCreateDialog } from "./raw-material-create-dialog";
import { RawMaterialEditDialog } from "./raw-material-edit-dialog";

import { rawMaterialService } from "../services/raw-material.service";

import { DataTableFilterCombobox } from "@/components/dashboard/filter/filter-combobox";
import { DataTable } from "@/components/data-table/data-table";
import { rawMaterialColumns } from "./raw-material-columns";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";

import { Unit, unitService } from "@/global/unit";

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

export function RawMaterialPage() {
  // ============================================================
  // LIST
  // ============================================================

  const [result, setResult] = useState<RawMaterialListResponse | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  const [refreshKey, setRefreshKey] = useState(0);

  // ============================================================
  // EDIT
  // ============================================================

  const [editingRawMaterial, setEditingRawMaterial] =
    useState<RawMaterial | null>(null);

  const [editOpen, setEditOpen] = useState(false);

  // ============================================================
  // UNITS
  // ============================================================

  const [units, setUnits] = useState<Unit[]>([]);

  // ============================================================
  // FILTER
  // ============================================================

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const [search, setSearch] = useState("");

  const [type, setType] = useState("");

  const [status, setStatus] = useState<boolean | undefined>(undefined);

  const debouncedSearch = useDebounce(search, 500);

  // ============================================================
  // RESET PAGINATION
  // ============================================================

  useEffect(() => {
    setPagination((p) => ({
      ...p,
      pageIndex: 0,
    }));
  }, [debouncedSearch, type, status]);

  // ============================================================
  // LOAD RAW MATERIALS
  // ============================================================

  useEffect(() => {
    const loadRawMaterials = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await rawMaterialService.findAll({
          page: pagination.pageIndex + 1,
          limit: pagination.pageSize,
          search: debouncedSearch || undefined,
          type: type || undefined,
          status,
        });

        setResult(response);
      } catch (err) {
        console.error(err);
        setError("Gagal memuat data bahan baku");
      } finally {
        setLoading(false);
      }
    };

    loadRawMaterials();
  }, [pagination, debouncedSearch, type, status, refreshKey]);

  // ============================================================
  // LOAD UNITS
  // ============================================================

  useEffect(() => {
    const loadUnits = async () => {
      try {
        const response = await unitService.findAll();

        setUnits(response);
      } catch (error) {
        console.error(error);
      }
    };

    loadUnits();
  }, []);

  // ============================================================
  // CREATE
  // ============================================================

  const handleCreate = async (data: RawMaterialFormValues) => {
    await rawMaterialService.createRawMaterial(data);

    setRefreshKey((k) => k + 1);
  };

  // ============================================================
  // UPDATE
  // ============================================================

  const handleUpdate = async (id: string, data: RawMaterialFormValues) => {
    await rawMaterialService.updateRawMaterial(id, data);

    setRefreshKey((k) => k + 1);
  };

  // ============================================================
  // UPDATE STATUS
  // ============================================================

  const handleUpdateStatus = async (rawMaterial: RawMaterial) => {
    try {
      await rawMaterialService.updateStatus(rawMaterial.id, {
        status: !rawMaterial.status,
      });

      toast.success(
        rawMaterial.status
          ? "Bahan baku berhasil dinonaktifkan"
          : "Bahan baku berhasil diaktifkan",
      );

      setRefreshKey((k) => k + 1);
    } catch (error) {
      toast.error(
        getErrorMessage(error, "Gagal memperbarui status bahan baku"),
      );
    }
  };

  // ============================================================
  // EDIT
  // ============================================================

  const handleEdit = (rawMaterial: RawMaterial) => {
    setEditingRawMaterial(rawMaterial);
    setEditOpen(true);
  };

  const getRawMaterialDetail = async (id: string) => {
    return await rawMaterialService.findOne(id);
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}

      <div className="flex flex-col justify-between gap-4 border-b pb-5 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Master Bahan Baku
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Kelola bahan baku.
          </p>
        </div>

        <RawMaterialCreateDialog units={units} onCreate={handleCreate} />
      </div>

      {/* FILTER */}

      <DataTableToolbar
        search={{
          value: search,
          onChange: setSearch,
          placeholder: "Cari nama / SKU...",
        }}
        filters={
          <DataTableFilterCombobox
            options={statusOption}
            value={status}
            onChange={setStatus}
            allLabel="Semua Status"
            searchPlaceholder="Cari status..."
          />
        }
      />

      {/* ERROR */}

      {error && (
        <div className="border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* TABLE */}

      <DataTable
        columns={rawMaterialColumns(handleEdit, handleUpdateStatus)}
        data={result?.data ?? []}
        loading={loading}
        pagination={pagination}
        pageCount={result?.meta.totalPages ?? 1}
        total={result?.meta.total ?? 0}
        totalLabel="bahan baku"
        onPaginationChange={setPagination}
        emptyMessage="Bahan baku tidak ditemukan"
      />

      {/* EDIT DIALOG */}

      <RawMaterialEditDialog
        rawMaterial={editingRawMaterial}
        units={units}
        open={editOpen}
        onOpenChange={setEditOpen}
        onGetDetail={getRawMaterialDetail}
        onUpdate={handleUpdate}
      />
    </div>
  );
}
