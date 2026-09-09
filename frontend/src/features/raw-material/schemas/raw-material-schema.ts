import { z } from "zod";

export const rawMaterialConversionSchema = z.object({
  unitId: z.string().min(1, "Pilih satuan"),
  factor: z.number().positive("Konversi harus lebih dari 0"),
});

export const rawMaterialSchema = z.object({
  name: z
    .string()
    .min(1, "Nama bahan baku wajib diisi")
    .max(150, "Nama bahan baku maksimal 150 karakter"),
  sku: z.string().max(100, "SKU maksimal 100 karakter").optional(),

  unitId: z.string().min(1, "Unit bahan baku wajib di isi"),
  averageCost: z.number().min(0, "Biaya tidak boleh kurang dari 0").optional(),
  minimumStock: z
    .number()
    .min(0, "Minimal stok tidak boleh kurang dari 0")
    .optional(),

  conversions: z.array(rawMaterialConversionSchema),
});

export type RawMaterialFormValues = z.infer<typeof rawMaterialSchema>;
