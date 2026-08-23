"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  categorySchema,
  type CategoryFormValues,
} from "../schemas/category-schemas";

interface CategoryFormProps {
  defaultValues?: Partial<CategoryFormValues>;
  onSubmit: (data: CategoryFormValues) => void | Promise<void>;
  submitLabel?: string;
  isLoading?: boolean;
  onCancel?: () => void;
}

export function CategoryForm({
  defaultValues,
  onSubmit,
  submitLabel = "Simpan",
  isLoading = false,
  onCancel,
}: CategoryFormProps) {
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      ...defaultValues,
    },
  });

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      {/* Nama Produk */}
      <div className="space-y-2">
        <label htmlFor="name">Nama Category</label>

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
