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

import { CategoryForm } from "./category-form";
import { CategoryFormValues } from "../schemas/category-schemas";

interface CategoryCreateDialogProps {
  onCreate: (data: CategoryFormValues) => Promise<void>;
}

export function ProductCreateDialog({ onCreate }: CategoryCreateDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: CategoryFormValues) => {
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

        <CategoryForm
          onSubmit={handleSubmit}
          submitLabel="Tambah Produk"
          isLoading={isLoading}
          onCancel={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
