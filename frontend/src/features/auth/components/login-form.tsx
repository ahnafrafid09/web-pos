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
  Eye,
  EyeOff,
  Lock,
  Mail,
  Store,
} from "lucide-react";

import { authService } from "@/features/auth/services/auth.services";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authStorage } from "../lib/auth-storage";

const loginSchema = z.object({
  email: z.string().email("Format email tidak valid"),
  password: z.string().min(1, "Password wajib diisi"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();

  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setError(null);

      const response = await authService.login({
        email: data.email,
        password: data.password,
      });

      authStorage.setAccessToken(response.access_token);
      authStorage.setRefreshToken(response.refresh_token);
      authStorage.setUser(response.user);

      router.replace("/dashboard");
    } catch (error: any) {
      const message = error.response?.data?.message;

      setError(
        Array.isArray(message)
          ? message.join(", ")
          : message || "Email atau password salah",
      );
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-muted/30 px-4 py-8">
      {/* BACKGROUND ACCENT */}
      <div className="absolute inset-x-0 top-0 h-1 bg-primary" />

      <div className="relative w-full max-w-md">
        {/* BRAND */}
        <div className="mb-8 text-center">
          <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-md bg-primary text-primary-foreground shadow-lg">
            <Store className="h-7 w-7" />
          </div>

          <h1 className="text-2xl font-bold tracking-tight">WartegPOS</h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Sistem kasir untuk mengelola usaha Anda
          </p>
        </div>

        {/* LOGIN BOX */}
        <div className="border bg-background shadow-xl">
          {/* HEADER */}
          <div className="border-b px-6 py-6 sm:px-8">
            <h2 className="text-xl font-semibold">Masuk ke akun</h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Masukkan akun Anda untuk melanjutkan.
            </p>
          </div>

          {/* FORM */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5 px-6 py-6 sm:px-8 sm:py-8"
          >
            {/* EMAIL */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>

              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  id="email"
                  type="email"
                  placeholder="nama@email.com"
                  className="h-11 pl-10"
                  autoComplete="email"
                  {...register("email")}
                />
              </div>

              {errors.email && (
                <p className="text-sm text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* PASSWORD */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>

                <button
                  type="button"
                  className="text-xs font-medium text-primary hover:underline"
                >
                  Lupa password?
                </button>
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Masukkan password"
                  className="h-11 px-10"
                  autoComplete="current-password"
                  {...register("password")}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                  aria-label={
                    showPassword ? "Sembunyikan password" : "Tampilkan password"
                  }
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>

              {errors.password && (
                <p className="text-sm text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* ERROR */}
            {error && (
              <Alert variant="destructive" className="rounded-md">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* LOGIN BUTTON */}
            <Button
              type="submit"
              className="h-11 w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                "Sedang masuk..."
              ) : (
                <>
                  Masuk
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>

            <div className="border-t pt-5 text-center">
              <p className="text-sm text-muted-foreground">
                Belum memiliki akun usaha?
              </p>

              <Link
                href="/register"
                className="mt-2 inline-block text-sm font-semibold text-primary hover:underline"
              >
                Daftar usaha sekarang
              </Link>
            </div>
          </form>
        </div>

        {/* FOOTER */}
        <p className="mt-6 text-center text-xs text-muted-foreground">
          © 2026 WartegPOS · Sistem manajemen usaha
        </p>
      </div>
    </main>
  );
}
