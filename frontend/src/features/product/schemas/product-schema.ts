import { z } from "zod";

export const productSchema = z
  .object({
    name: z
      .string()
      .min(1, "Nama produk wajib diisi")
      .max(150, "Nama produk maksimal 150 karakter"),

    categoryId: z.string().min(1, "Kategori wajib dipilih"),

    type: z.enum(["MENU", "MERCHANDISE"]),

    sku: z.string().max(100, "SKU maksimal 100 karakter").optional(),

    unit: z
      .string()
      .min(1, "Satuan wajib diisi")
      .max(30, "Satuan maksimal 30 karakter"),

    sellingPrice: z
      .number()
      .min(0, "Harga jual tidak boleh kurang dari 0")
      .optional(),

    hpp: z.number().min(0, "Hpp tidak boleh kurang dari 0").optional(),
    image: z.instanceof(File).optional().nullable(),
  })
  .superRefine((data, ctx) => {
    if (
      (data.type === "MENU" || data.type === "MERCHANDISE") &&
      data.sellingPrice === undefined
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["sellingPrice"],
        message: "Harga jual wajib diisi untuk Menu dan Barang Dagangan",
      });
    }
  });

export type ProductFormValues = z.infer<typeof productSchema>;
