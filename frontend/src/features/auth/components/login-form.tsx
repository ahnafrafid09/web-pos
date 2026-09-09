"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { motion } from "framer-motion";
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
  Utensils,
  Package,
  BarChart3,
} from "lucide-react";

import { authService } from "@/features/auth/services/auth.services";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "../provider/auth-provider";

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

  const { refreshMe } = useAuth();

  const onSubmit = async (data: LoginFormData) => {
    try {
      setError(null);

      await authService.login({
        email: data.email,
        password: data.password,
      });

      const user = await refreshMe();

      if (!user) {
        throw new Error("Session login tidak ditemukan");
      }

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
    <main className="flex min-h-screen flex-col bg-[#F8F7F4] lg:flex-row">
      {/* ============================================================
          LEFT - HERO DESKTOP
      ============================================================ */}
      <section className="relative hidden min-h-screen overflow-hidden lg:flex lg:w-[52%] xl:w-[55%]">
        <motion.img
          src="/src/image/bg-login.webp"
          alt="Hidangan makanan Indonesia"
          initial={{
            scale: 1.08,
            opacity: 0,
          }}
          animate={{
            scale: 1,
            opacity: 1,
          }}
          transition={{
            duration: 1.2,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="absolute inset-0 h-full w-full object-cover"
        />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 1,
            delay: 0.2,
          }}
          className="absolute inset-0 bg-black/40"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/10" />

        {/* BRAND */}
        <motion.div
          initial={{
            opacity: 0,
            y: -15,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.6,
            delay: 0.35,
          }}
          className="absolute left-6 top-6 z-20 flex items-center gap-3 xl:left-10 xl:top-10"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#4A5D23] shadow-xl xl:h-11 xl:w-11">
            <Store className="h-5 w-5" />
          </div>

          <div>
            <p className="text-base font-bold tracking-tight text-white xl:text-lg">
              WartegPOS
            </p>

            <p className="text-[11px] text-white/60 xl:text-xs">
              Sistem manajemen usaha
            </p>
          </div>
        </motion.div>

        {/* STATUS */}
        <motion.div
          initial={{
            opacity: 0,
            y: -15,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.6,
            delay: 0.45,
          }}
          className="absolute right-6 top-6 z-20 hidden xl:right-10 xl:top-10 xl:block"
        >
          <div className="rounded-full border border-white/15 bg-black/20 px-4 py-2 text-xs text-white/80 backdrop-blur-md">
            Sistem kasir & manajemen usaha
          </div>
        </motion.div>

        {/* HERO CONTENT */}
        <div className="relative z-10 mt-auto w-full p-6 xl:p-14">
          <motion.div
            initial={{
              opacity: 0,
              y: 30,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.8,
              delay: 0.55,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="max-w-2xl"
          >
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-2 text-[11px] text-white/90 backdrop-blur-md xl:mb-5 xl:px-4 xl:text-xs">
              <Utensils className="h-3.5 w-3.5 text-[#E8A93A]" />
              Untuk usaha kuliner Indonesia
            </div>

            <h1 className="text-4xl font-bold leading-[1.08] tracking-tight text-white xl:text-6xl">
              Kelola usaha.
              <br />
              <span className="text-[#E8A93A]">Sajikan lebih banyak.</span>
            </h1>

            <p className="mt-5 max-w-xl text-sm leading-6 text-white/70 xl:mt-6 xl:text-base xl:leading-7">
              Kelola transaksi, stok bahan, pembelian, dan laporan usaha dalam
              satu sistem yang sederhana dan mudah digunakan.
            </p>

            <div className="mt-6 flex flex-wrap gap-2.5 xl:mt-8 xl:gap-3">
              <div className="flex items-center gap-2 rounded-full border border-white/15 bg-black/20 px-3 py-2 text-[11px] text-white/90 backdrop-blur-md xl:px-4 xl:py-2.5 xl:text-xs">
                <Utensils className="h-4 w-4 text-[#E8A93A]" />
                Kasir
              </div>

              <div className="flex items-center gap-2 rounded-full border border-white/15 bg-black/20 px-3 py-2 text-[11px] text-white/90 backdrop-blur-md xl:px-4 xl:py-2.5 xl:text-xs">
                <Package className="h-4 w-4 text-[#E8A93A]" />
                Stok
              </div>

              <div className="flex items-center gap-2 rounded-full border border-white/15 bg-black/20 px-3 py-2 text-[11px] text-white/90 backdrop-blur-md xl:px-4 xl:py-2.5 xl:text-xs">
                <BarChart3 className="h-4 w-4 text-[#E8A93A]" />
                Laporan
              </div>
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-[#4A5D23] via-[#E8A93A] to-[#C1440E]" />
      </section>

      {/* ============================================================
          MOBILE HERO
      ============================================================ */}
      <section className="relative h-[190px] shrink-0 overflow-hidden sm:h-[220px] md:h-[250px] lg:hidden">
        <motion.img
          src="/src/image/bg-login.webp"
          alt="Hidangan makanan Indonesia"
          initial={{
            scale: 1.08,
            opacity: 0,
          }}
          animate={{
            scale: 1,
            opacity: 1,
          }}
          transition={{
            duration: 1,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-black/50" />

        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/70" />

        {/* MOBILE BRAND */}
        <motion.div
          initial={{
            opacity: 0,
            y: -10,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.6,
            delay: 0.25,
          }}
          className="relative z-10 flex items-center gap-2.5 px-4 py-4 sm:px-6 sm:py-5"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-[#4A5D23] shadow-lg sm:h-10 sm:w-10">
            <Store className="h-4 w-4 sm:h-5 sm:w-5" />
          </div>

          <div>
            <p className="text-sm font-bold text-white sm:text-base">
              WartegPOS
            </p>

            <p className="text-[10px] text-white/60 sm:text-xs">
              Sistem manajemen usaha
            </p>
          </div>
        </motion.div>

        {/* MOBILE HERO TEXT */}
        <motion.div
          initial={{
            opacity: 0,
            y: 15,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.7,
            delay: 0.4,
          }}
          className="absolute bottom-5 left-4 right-4 z-10 sm:bottom-6 sm:left-6 sm:right-6"
        >
          <h1 className="text-xl font-bold leading-tight text-white sm:text-2xl md:text-3xl">
            Kelola usaha lebih mudah.
          </h1>

          <p className="mt-1 max-w-lg text-[11px] leading-5 text-white/70 sm:text-xs sm:leading-5">
            Kasir, stok, pembelian dan laporan dalam satu sistem.
          </p>
        </motion.div>
      </section>

      {/* ============================================================
          RIGHT - LOGIN
      ============================================================ */}
      <section className="flex flex-1 items-center justify-center px-4 py-8 sm:px-6 sm:py-10 md:px-8 lg:min-h-screen lg:w-[48%] lg:px-10 xl:w-[45%] xl:px-12">
        <div className="w-full max-w-[430px]">
          {/* HEADER */}
          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.7,
              delay: 0.2,
            }}
            className="mb-6 sm:mb-8"
          >
            <div className="mb-5 hidden h-11 w-11 items-center justify-center rounded-xl bg-[#4A5D23] text-white lg:flex">
              <Store className="h-5 w-5" />
            </div>

            <h2 className="text-2xl font-bold tracking-tight text-[#24211B] sm:text-3xl">
              Selamat datang 👋
            </h2>

            <p className="mt-2 max-w-md text-xs leading-5 text-muted-foreground sm:text-sm sm:leading-6">
              Masuk ke akun WartegPOS Anda untuk mulai mengelola usaha.
            </p>
          </motion.div>

          {/* LOGIN CARD */}
          <motion.div
            initial={{
              opacity: 0,
              y: 25,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.7,
              delay: 0.3,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="rounded-2xl border bg-white p-5 shadow-[0_20px_60px_rgba(0,0,0,0.07)] sm:p-7 md:p-8"
          >
            <div className="mb-6 sm:mb-7">
              <h3 className="text-base font-semibold text-[#24211B] sm:text-lg">
                Masuk ke akun
              </h3>

              <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
                Gunakan email dan password Anda.
              </p>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4 sm:space-y-5"
            >
              {/* EMAIL */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs sm:text-sm">
                  Email
                </Label>

                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground sm:left-3.5" />

                  <Input
                    id="email"
                    type="email"
                    placeholder="nama@email.com"
                    className="h-11 rounded-xl pl-9 text-sm sm:h-12 sm:pl-10"
                    autoComplete="email"
                    {...register("email")}
                  />
                </div>

                {errors.email && (
                  <p className="text-[11px] text-destructive sm:text-xs">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* PASSWORD */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-xs sm:text-sm">
                    Password
                  </Label>

                  <button
                    type="button"
                    className="text-[11px] font-medium text-[#4A5D23] hover:underline sm:text-xs"
                  >
                    Lupa password?
                  </button>
                </div>

                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground sm:left-3.5" />

                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Masukkan password"
                    className="h-11 rounded-xl px-9 text-sm sm:h-12 sm:px-10"
                    autoComplete="current-password"
                    {...register("password")}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground sm:right-3.5"
                    aria-label={
                      showPassword
                        ? "Sembunyikan password"
                        : "Tampilkan password"
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
                  <p className="text-[11px] text-destructive sm:text-xs">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* ERROR */}
              {error && (
                <Alert variant="destructive" className="rounded-xl px-3 py-2.5">
                  <AlertCircle className="h-4 w-4" />

                  <AlertDescription className="text-xs">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              {/* LOGIN BUTTON */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-11 w-full cursor-pointer rounded-xl bg-primary text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary/95 hover:shadow-md sm:h-12"
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

              {/* REGISTER */}
              <div className="border-t pt-4 text-center sm:pt-5">
                <p className="text-xs text-muted-foreground sm:text-sm">
                  Belum memiliki akun usaha?
                </p>

                <Link
                  href="/register"
                  className="mt-1.5 inline-block text-xs font-semibold text-[#4A5D23] hover:underline sm:mt-2 sm:text-sm"
                >
                  Daftar usaha sekarang
                </Link>
              </div>
            </form>
          </motion.div>

          {/* FOOTER */}
          <motion.p
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            transition={{
              duration: 0.5,
              delay: 0.8,
            }}
            className="mt-5 text-center text-[10px] text-muted-foreground sm:mt-7 sm:text-xs"
          >
            © 2026 WartegPOS · Sistem manajemen usaha
          </motion.p>
        </div>
      </section>
    </main>
  );
}
