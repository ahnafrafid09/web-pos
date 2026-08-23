import { z } from "zod";

export const categorySchema = z.object({
  name: z
    .string()
    .min(1, "Nama produk wajib diisi")
    .max(150, "Nama produk maksimal 150 karakter"),
});

export type CategoryFormValues = z.infer<typeof categorySchema>;
