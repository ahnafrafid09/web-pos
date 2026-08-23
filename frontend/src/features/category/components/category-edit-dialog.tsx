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

import type { Category } from "@/features/category/types/category-types";
import { CategoryForm } from "./category-form";
import type { CategoryFormValues } from "../schemas/category-schemas";

interface CategoryEditDialogProps {
  category: Category | null;

  open: boolean;

  onOpenChange: (open: boolean) => void;

  onUpdate: (id: string, data: CategoryFormValues) => Promise<void>;
}

export function CategoryEditDialog({
  category,
  open,
  onOpenChange,
  onUpdate,
}: CategoryEditDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: CategoryFormValues) => {
    if (!category) return;

    try {
      setIsLoading(true);

      await onUpdate(category.id, data);

      toast.success("Kategori berhasil diperbarui");

      onOpenChange(false);
    } catch (error) {
      toast.error(getErrorMessage(error, "Gagal memperbarui kategori"));
    } finally {
      setIsLoading(false);
    }
  };

  if (!category) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Kategori</DialogTitle>
        </DialogHeader>

        <CategoryForm
          key={category.id}
          defaultValues={{
            name: category.name,
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
