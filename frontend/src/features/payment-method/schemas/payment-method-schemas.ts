import { z } from "zod";

export const paymentMethodSchema = z.object({
  name: z
    .string()
    .min(1, "Nama payment method wajib diisi")
    .max(150, "Nama payment method maksimal 150 karakter"),
  code: z.string().min(1, "Code wajib diisi"),
  usageType: z.enum(["PURCHASE", "TRANSACTION", "BOTH"], {
    required_error: "Usage type wajib dipilih",
  }),
});

export type PaymentMethodFormValues = z.infer<typeof paymentMethodSchema>;
