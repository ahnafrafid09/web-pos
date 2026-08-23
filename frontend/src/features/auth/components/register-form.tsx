"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  LockKeyhole,
  Store,
  UserRound,
} from "lucide-react";

import { authService } from "@/features/auth/services/auth.services";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { createSlug } from "@/lib/utils/slug";

const registerSchema = z
  .object({
    tenantName: z.string().min(3, "Nama usaha minimal 3 karakter"),

    name: z.string().min(3, "Nama minimal 3 karakter"),

    username: z.string().min(3, "Username minimal 3 karakter"),

    email: z.string().email("Format email tidak valid"),

    password: z.string().min(8, "Password minimal 8 karakter"),

    confirmPassword: z
      .string()
      .min(8, "Konfirmasi password minimal 8 karakter"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Konfirmasi password tidak sama",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setError(null);

      const tenantSlug = createSlug(data.tenantName);

      await authService.register({
        tenantName: data.tenantName,
        tenantSlug: tenantSlug,
        ownerName: data.name,
        username: data.username,
        email: data.email,
        password: data.password,
      });

      router.push("/login");
    } catch (error: any) {
      const message = error.response?.data?.message;

      setError(
        Array.isArray(message)
          ? message.join(", ")
          : message || "Terjadi kesalahan saat melakukan pendaftaran",
      );
    }
  };

  return (
    <div className="min-h-screen bg-muted/40">
      <div className="mx-auto flex min-h-screen max-w-7xl items-center p-4 lg:p-8">
        <div className="grid w-full overflow-hidden rounded-lg border bg-background shadow-xl lg:grid-cols-5">
          {/* LEFT - BRANDING */}
          <div className="relative hidden overflow-hidden bg-primary p-10 text-primary-foreground lg:col-span-2 lg:flex lg:flex-col lg:justify-between">
            {/* Background decoration */}
            <div className="absolute -right-20 -top-20 h-64 w-64 rotate-12 border-40 border-white/10" />

            <div className="absolute -bottom-24 -left-24 h-72 w-72 -rotate-12 border-40 border-white/10" />

            <div className="relative">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-md bg-background text-primary shadow-lg">
                  <Store className="h-6 w-6" />
                </div>

                <div>
                  <h1 className="text-xl font-bold">WartegPOS</h1>
                  <p className="text-sm text-primary-foreground/70">
                    Sistem kasir untuk usaha Anda
                  </p>
                </div>
              </div>

              <div className="mt-20">
                <p className="text-sm font-medium text-primary-foreground/70">
                  MULAI KELOLA USAHA
                </p>

                <h2 className="mt-4 text-4xl font-bold leading-tight">
                  Kelola warung lebih mudah dalam satu sistem.
                </h2>

                <p className="mt-5 max-w-md text-base leading-7 text-primary-foreground/75">
                  Kelola produk, stok, transaksi, HPP, dan keuntungan usaha Anda
                  dengan lebih praktis.
                </p>
              </div>
            </div>

            <div className="relative space-y-4">
              <FeatureItem text="Kelola stok dan bahan baku" />
              <FeatureItem text="Catat transaksi dengan mudah" />
              <FeatureItem text="Pantau HPP dan keuntungan" />
              <FeatureItem text="Akses untuk Owner, Admin, dan Cashier" />
            </div>
          </div>

          {/* RIGHT - FORM */}
          <div className="lg:col-span-3">
            <Card className="border-0 shadow-none">
              <CardHeader className="px-6 pt-8 sm:px-10 sm:pt-10">
                {/* Mobile logo */}
                <div className="mb-6 flex items-center gap-3 lg:hidden">
                  <div className="flex h-11 w-11 items-center justify-center rounded-md bg-primary text-primary-foreground">
                    <Store className="h-5 w-5" />
                  </div>

                  <span className="text-lg font-bold">WartegPOS</span>
                </div>

                <CardTitle className="text-2xl sm:text-3xl">
                  Buat akun usaha
                </CardTitle>

                <CardDescription className="text-sm sm:text-base">
                  Daftarkan usaha Anda dan buat akun Owner untuk mulai
                  menggunakan sistem.
                </CardDescription>
              </CardHeader>

              <CardContent className="px-6 pb-8 sm:px-10 sm:pb-10">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                  {/* DATA USAHA */}
                  <div>
                    <div className="mb-5 flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 text-primary">
                        <Store className="h-4 w-4" />
                      </div>

                      <div>
                        <h3 className="font-semibold">Data Usaha</h3>
                        <p className="text-sm text-muted-foreground">
                          Informasi usaha yang akan Anda kelola.
                        </p>
                      </div>
                    </div>

                    <FormField
                      label="Nama Usaha"
                      htmlFor="tenantName"
                      error={errors.tenantName?.message}
                    >
                      <Input
                        id="tenantName"
                        placeholder="Contoh: Warteg Bahari"
                        {...register("tenantName")}
                      />
                    </FormField>
                  </div>

                  <Separator />

                  {/* DATA OWNER */}
                  <div>
                    <div className="mb-5 flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 text-primary">
                        <UserRound className="h-4 w-4" />
                      </div>

                      <div>
                        <h3 className="font-semibold">Data Owner</h3>
                        <p className="text-sm text-muted-foreground">
                          Akun ini memiliki akses penuh ke usaha Anda.
                        </p>
                      </div>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                      <FormField
                        label="Nama Lengkap"
                        htmlFor="name"
                        error={errors.name?.message}
                      >
                        <Input
                          id="name"
                          placeholder="Masukkan nama"
                          {...register("name")}
                        />
                      </FormField>

                      <FormField
                        label="Username"
                        htmlFor="username"
                        error={errors.username?.message}
                      >
                        <Input
                          id="username"
                          placeholder="Masukkan username"
                          {...register("username")}
                        />
                      </FormField>

                      <FormField
                        label="Email"
                        htmlFor="email"
                        error={errors.email?.message}
                        className="sm:col-span-2"
                      >
                        <Input
                          id="email"
                          type="email"
                          placeholder="email@example.com"
                          {...register("email")}
                        />
                      </FormField>

                      <FormField
                        label="Password"
                        htmlFor="password"
                        error={errors.password?.message}
                      >
                        <Input
                          id="password"
                          type="password"
                          placeholder="Minimal 6 karakter"
                          {...register("password")}
                        />
                      </FormField>

                      <FormField
                        label="Konfirmasi Password"
                        htmlFor="confirmPassword"
                        error={errors.confirmPassword?.message}
                      >
                        <Input
                          id="confirmPassword"
                          type="password"
                          placeholder="Masukkan ulang password"
                          {...register("confirmPassword")}
                        />
                      </FormField>
                    </div>
                  </div>

                  {/* ERROR */}
                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />

                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  {/* SECURITY INFO */}
                  <div className="flex gap-3 rounded-md border bg-muted/40 p-4">
                    <LockKeyhole className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />

                    <p className="text-sm text-muted-foreground">
                      Dengan mendaftar, Anda akan membuat satu usaha dan akun
                      pertama sebagai <strong>Owner</strong>.
                    </p>
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Mendaftarkan..." : "Buat Akun Usaha"}

                    {!isSubmitting && <ArrowRight className="ml-2 h-4 w-4" />}
                  </Button>

                  <p className="text-center text-sm text-muted-foreground">
                    Sudah memiliki akun?{" "}
                    <Link
                      href="/login"
                      className="font-semibold text-primary hover:underline"
                    >
                      Masuk sekarang
                    </Link>
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function FormField({
  label,
  htmlFor,
  error,
  className,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`space-y-2 ${className ?? ""}`}>
      <Label htmlFor={htmlFor}>{label}</Label>

      {children}

      {error && <p className="text-sm font-medium text-destructive">{error}</p>}
    </div>
  );
}

function FeatureItem({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3 text-sm">
      <CheckCircle2 className="h-5 w-5 shrink-0" />
      <span>{text}</span>
    </div>
  );
}
