"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  productSchema,
  type ProductFormValues,
} from "../schemas/product-schema";

import { productTypeOptions } from "../constants/product-constants";
import type { Category } from "@/features/category/types/category-types";
import { formatRupiahInput, parseRupiah } from "@/lib/utils/currency";

interface ProductFormProps {
  categories: Category[];
  defaultValues?: Partial<ProductFormValues>;
  onSubmit: (data: ProductFormValues) => void | Promise<void>;
  submitLabel?: string;
  isLoading?: boolean;
  onCancel?: () => void;
}

export function ProductForm({
  categories,
  defaultValues,
  onSubmit,
  submitLabel = "Simpan",
  isLoading = false,
  onCancel,
}: ProductFormProps) {
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      categoryId: "",
      type: "MENU",
      sku: "",
      unit: "",
      sellingPrice: undefined,
      ...defaultValues,
    },
  });

  const type = form.watch("type");

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      {/* Nama Produk */}
      <div className="space-y-2">
        <label htmlFor="name">Nama Produk</label>

        <Input
          id="name"
          placeholder="Masukkan nama produk"
          {...form.register("name")}
        />

        {form.formState.errors.name && (
          <p className="text-sm text-destructive">
            {form.formState.errors.name.message}
          </p>
        )}
      </div>

      {/* SKU */}
      <div className="space-y-2">
        <label htmlFor="sku">
          SKU <span className="text-muted-foreground">(Opsional)</span>
        </label>

        <Input
          id="sku"
          placeholder="Contoh: BRS-001"
          {...form.register("sku")}
        />

        {form.formState.errors.sku && (
          <p className="text-sm text-destructive">
            {form.formState.errors.sku.message}
          </p>
        )}
      </div>

      {/* Kategori */}
      <div className="space-y-2">
        <label htmlFor="categoryId">Kategori</label>

        <select
          id="categoryId"
          className="border-input bg-background h-9 w-full rounded-md border px-3 text-sm"
          {...form.register("categoryId")}
        >
          <option value="">Pilih kategori</option>

          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>

        {form.formState.errors.categoryId && (
          <p className="text-sm text-destructive">
            {form.formState.errors.categoryId.message}
          </p>
        )}
      </div>

      {/* Tipe Produk */}
      <div className="space-y-2">
        <label htmlFor="type">Tipe Produk</label>

        <select
          id="type"
          className="border-input bg-background h-9 w-full rounded-md border px-3 text-sm"
          {...form.register("type")}
        >
          {productTypeOptions.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      {/* Satuan */}
      <div className="space-y-2">
        <label htmlFor="unit">Satuan</label>

        <Input
          id="unit"
          placeholder="Contoh: kg, pcs, porsi"
          {...form.register("unit")}
        />

        {form.formState.errors.unit && (
          <p className="text-sm text-destructive">
            {form.formState.errors.unit.message}
          </p>
        )}
      </div>

      {/* Harga Jual */}
      <div className="space-y-2">
        <label htmlFor="sellingPrice">Harga Jual</label>

        <Input
          id="sellingPrice"
          type="text"
          inputMode="numeric"
          placeholder="Masukkan harga jual"
          value={formatRupiahInput(form.watch("sellingPrice"))}
          onChange={(e) => {
            form.setValue("sellingPrice", parseRupiah(e.target.value), {
              shouldValidate: true,
              shouldDirty: true,
            });
          }}
        />

        {form.formState.errors.sellingPrice && (
          <p className="text-sm text-destructive">
            {form.formState.errors.sellingPrice.message}
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
