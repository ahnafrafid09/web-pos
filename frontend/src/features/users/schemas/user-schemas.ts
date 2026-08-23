import { z } from "zod";

export const userSchema = z.object({
  name: z
    .string()
    .min(1, "Nama wajib diisi")
    .max(150, "Nama maksimal 150 karakter"),

  username: z
    .string()
    .min(1, "Username wajib diisi")
    .max(50, "Username maksimal 50 karakter"),

  email: z.string().email("Email tidak valid").nonempty("Email wajib diisi"),

  password: z.string(),

  role: z.enum(["ADMIN", "CASHIER", "OWNER"]),
});

export type UserFormValues = z.infer<typeof userSchema>;
