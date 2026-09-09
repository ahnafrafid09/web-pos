"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  SupplierFormValues,
  supplierSchema,
} from "../schemas/supplier-schemas";

interface SupplierFormProps {
  defaultValues?: Partial<SupplierFormValues>;
  onSubmit: (data: SupplierFormValues) => void | Promise<void>;
  submitLabel?: string;
  isLoading?: boolean;
  onCancel?: () => void;
}

export function SupplierForm({
  defaultValues,
  onSubmit,
  submitLabel = "Simpan",
  isLoading = false,
  onCancel,
}: SupplierFormProps) {
  const form = useForm<SupplierFormValues>({
    resolver: zodResolver(supplierSchema),
    defaultValues: {
      name: "",
      ...defaultValues,
    },
  });

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      {/* Nama Produk */}
      <div className="space-y-2">
        <label htmlFor="name">Nama Supplier</label>

        <Input
          id="name"
          placeholder="Masukkan nama Category"
          {...form.register("name")}
        />

        {form.formState.errors.name && (
          <p className="text-sm text-destructive">
            {form.formState.errors.name.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="code">Code Supplier</label>

        <Input id="code" placeholder="Supp-100" {...form.register("code")} />

        {form.formState.errors.code && (
          <p className="text-sm text-destructive">
            {form.formState.errors.code.message}
          </p>
        )}
      </div>

      <div className="flex justify-end gap-2 pt-2">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            Batal
          </Button>
        )}

        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Menyimpan..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}
