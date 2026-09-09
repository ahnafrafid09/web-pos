import { z } from "zod";

export const supplierSchema = z.object({
  name: z
    .string()
    .min(1, "Nama supplier wajib diisi")
    .max(150, "Nama supplier maksimal 150 karakter"),
  code: z.string().min(1, "Code wajib diiisi"),
});

export type SupplierFormValues = z.infer<typeof supplierSchema>;
