"use client";

import { useState } from "react";
import { toast } from "sonner";

import { getErrorMessage } from "@/lib/utils";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { SupplierForm } from "./supplier-form";
import type { SupplierFormValues } from "../schemas/supplier-schemas";
import { Supplier } from "../types/supplier-types";

interface SupplierEditDialogProps {
  supplier: Supplier | null;

  open: boolean;

  onOpenChange: (open: boolean) => void;

  onUpdate: (id: string, data: SupplierFormValues) => Promise<void>;
}

export function SupplierEditDialog({
  supplier,
  open,
  onOpenChange,
  onUpdate,
}: SupplierEditDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: SupplierFormValues) => {
    if (!supplier) return;

    try {
      setIsLoading(true);

      await onUpdate(supplier.id, data);

      toast.success("Supplier berhasil diperbarui");

      onOpenChange(false);
    } catch (error) {
      toast.error(getErrorMessage(error, "Gagal memperbarui supplier"));
    } finally {
      setIsLoading(false);
    }
  };

  if (!supplier) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Supplier</DialogTitle>
        </DialogHeader>

        <SupplierForm
          key={supplier.id}
          defaultValues={{
            name: supplier.name,
            code: supplier.code,
          }}
          onSubmit={handleSubmit}
          submitLabel="Simpan Perubahan"
          isLoading={isLoading}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
