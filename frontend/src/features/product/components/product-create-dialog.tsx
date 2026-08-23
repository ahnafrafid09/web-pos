"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { getErrorMessage } from "@/lib/utils";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { ProductForm } from "./product-form";

import type { ProductFormValues } from "../schemas/product-schema";

import type { Category } from "@/features/category/types/category-types";

interface ProductCreateDialogProps {
  categories: Category[];

  onCreate: (data: ProductFormValues) => Promise<void>;
}

export function ProductCreateDialog({
  categories,
  onCreate,
}: ProductCreateDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: ProductFormValues) => {
    try {
      setIsLoading(true);

      await onCreate(data);

      toast.success("Produk berhasil ditambahkan");

      setOpen(false);
    } catch (error) {
      toast.error(getErrorMessage(error, "Gagal menambahkan produk"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Tambah Produk
          </Button>
        }
      />

      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Tambah Produk</DialogTitle>
        </DialogHeader>

        <ProductForm
          categories={categories}
          onSubmit={handleSubmit}
          submitLabel="Tambah Produk"
          isLoading={isLoading}
          onCancel={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
