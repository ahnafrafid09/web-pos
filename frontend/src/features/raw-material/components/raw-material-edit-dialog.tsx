"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { getErrorMessage } from "@/lib/utils";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { RawMaterialForm } from "./raw-material-form";

import type { RawMaterialFormValues } from "../schemas/raw-material-schema";
import type { RawMaterial } from "../types/raw-material-types";
import type { Unit } from "@/global/unit";

interface RawMaterialEditDialogProps {
  rawMaterial: RawMaterial | null;

  units: Unit[];

  open: boolean;

  onOpenChange: (open: boolean) => void;

  onUpdate: (id: string, data: RawMaterialFormValues) => Promise<void>;
  onGetDetail: (id: string) => Promise<RawMaterial>;
}

export function RawMaterialEditDialog({
  rawMaterial,
  units,
  open,
  onOpenChange,
  onUpdate,
  onGetDetail,
}: RawMaterialEditDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);

  const [detail, setDetail] = useState<RawMaterial | null>(null);

  useEffect(() => {
    if (!open || !rawMaterial?.id) {
      return;
    }

    let cancelled = false;

    const fetchDetail = async () => {
      try {
        setIsLoadingDetail(true);

        const result = await onGetDetail(rawMaterial.id);

        if (!cancelled) {
          setDetail(result);
        }
      } catch (error) {
        if (!cancelled) {
          toast.error(
            getErrorMessage(error, "Gagal mengambil detail bahan baku"),
          );

          onOpenChange(false);
        }
      } finally {
        if (!cancelled) {
          setIsLoadingDetail(false);
        }
      }
    };

    fetchDetail();

    return () => {
      cancelled = true;
    };
  }, [open, rawMaterial?.id, onGetDetail, onOpenChange]);

  useEffect(() => {
    if (!open) {
      setDetail(null);
    }
  }, [open]);

  // ============================================================
  // SUBMIT
  // ============================================================

  const handleSubmit = async (data: RawMaterialFormValues) => {
    if (!detail) {
      return;
    }

    try {
      setIsLoading(true);

      await onUpdate(detail.id, data);

      toast.success("Bahan baku berhasil diperbarui");

      onOpenChange(false);
    } catch (error) {
      toast.error(getErrorMessage(error, "Gagal memperbarui bahan baku"));
    } finally {
      setIsLoading(false);
    }
  };

  // ============================================================
  // DEFAULT VALUES
  // ============================================================

  const defaultValues: Partial<RawMaterialFormValues> | undefined = detail
    ? {
        name: detail.name,
        sku: detail.sku ?? "",
        unitId: detail.unitId ?? "",
        averageCost: Number(detail.averageCost ?? 0),
        minimumStock: Number(detail.minimumStock ?? 0),
        conversions: (detail.conversions ?? []).map((conversion) => ({
          unitId: conversion.unit?.id ?? conversion.unitId ?? "",

          factor: Number(conversion.factor),
        })),
      }
    : undefined;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Bahan Baku</DialogTitle>
        </DialogHeader>

        {/* LOADING DETAIL */}

        {isLoadingDetail && (
          <div className="flex min-h-[300px] items-center justify-center">
            <p className="text-sm text-muted-foreground">
              Mengambil detail bahan baku...
            </p>
          </div>
        )}

        {/* FORM */}

        {!isLoadingDetail && detail && (
          <RawMaterialForm
            key={detail.id}
            units={units}
            defaultValues={defaultValues}
            onSubmit={handleSubmit}
            submitLabel="Simpan Perubahan"
            isLoading={isLoading}
            onCancel={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
