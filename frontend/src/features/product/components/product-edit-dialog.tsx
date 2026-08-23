"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { getErrorMessage } from "@/lib/utils";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { ProductForm } from "./product-form";

import type { ProductFormValues } from "../schemas/product-schema";

import type { Product } from "../types/product-types";
import type { Category } from "@/features/category/types/category-types";

interface ProductEditDialogProps {
  product: Product | null;

  categories: Category[];

  open: boolean;

  onOpenChange: (open: boolean) => void;

  onUpdate: (id: string, data: ProductFormValues) => Promise<void>;
}

export function ProductEditDialog({
  product,
  categories,
  open,
  onOpenChange,
  onUpdate,
}: ProductEditDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  if (!product) {
    return null;
  }

  const handleSubmit = async (data: ProductFormValues) => {
    try {
      setIsLoading(true);

      await onUpdate(product.id, data);

      toast.success("Produk berhasil diperbarui");

      onOpenChange(false);
    } catch (error) {
      toast.error(getErrorMessage(error, "Gagal memperbarui produk"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Produk</DialogTitle>
        </DialogHeader>

        <ProductForm
          key={product.id}
          categories={categories}
          defaultValues={{
            name: product.name,
            categoryId: product.categoryId,
            type: product.type,
            sku: product.sku ?? "",
            unit: product.unit,
            sellingPrice: product.sellingPrice ?? undefined,
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
