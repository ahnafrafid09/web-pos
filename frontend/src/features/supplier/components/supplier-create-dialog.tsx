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

import { SupplierForm } from "./supplier-form";
import { SupplierFormValues } from "../schemas/supplier-schemas";

interface SupplierCreateDialogProps {
  onCreate: (data: SupplierFormValues) => Promise<void>;
}

export function SupplierCreateDialog({ onCreate }: SupplierCreateDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: SupplierFormValues) => {
    try {
      setIsLoading(true);

      await onCreate(data);

      toast.success("Supplier berhasil ditambahkan");

      setOpen(false);
    } catch (error) {
      toast.error(getErrorMessage(error, "Gagal menambahkan supplier"));
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
            Tambah Supplier
          </Button>
        }
      />

      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Tambah Supplier</DialogTitle>
        </DialogHeader>

        <SupplierForm
          onSubmit={handleSubmit}
          submitLabel="Tambah Supplier"
          isLoading={isLoading}
          onCancel={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
