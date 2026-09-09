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
  Check,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  Store,
  UserRound,
} from "lucide-react";

import { authService } from "@/features/auth/services/auth.services";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      tenantName: "",
      name: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const password = watch("password");

  const passwordRules = [
    {
      label: "Minimal 8 karakter",
      valid: password?.length >= 8,
    },
    {
      label: "Mengandung huruf",
      valid: /[A-Za-z]/.test(password || ""),
    },
    {
      label: "Mengandung angka",
      valid: /\d/.test(password || ""),
    },
  ];

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setError(null);

      const tenantSlug = createSlug(data.tenantName);

      await authService.register({
        tenantName: data.tenantName,
        tenantSlug,
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
    <main className="min-h-screen bg-[#F8F7F4] lg:flex">
      <section className="relative hidden min-h-screen overflow-hidden lg:flex lg:w-[50%]">
        <motion.img
          src="https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=1800&q=90"
          alt="Hidangan makanan Indonesia"
          initial={{ scale: 1.08 }}
          animate={{ scale: 1 }}
          transition={{
            duration: 1.6,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-black/40" />

        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/10" />

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.6,
          }}
          className="absolute left-10 top-10 z-20 flex items-center gap-3"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-[#4A5D23] shadow-xl">
            <Store className="h-5 w-5" />
          </div>

          <div>
            <p className="text-lg font-bold text-white">WartegPOS</p>

            <p className="text-xs text-white/60">Sistem manajemen usaha</p>
          </div>
        </motion.div>

        {/* CONTENT */}

        <div className="relative z-10 mt-auto w-full p-10 xl:p-14">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.2,
            }}
            className="max-w-lg"
          >
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#E8A93A]">
              Mulai dari sini
            </p>

            <h1 className="mt-4 text-4xl font-bold leading-[1.1] text-white xl:text-6xl">
              Bangun usaha
              <br />
              <span className="text-[#E8A93A]">lebih teratur.</span>
            </h1>

            <p className="mt-6 max-w-md text-sm leading-7 text-white/70 xl:text-base">
              Daftarkan usaha Anda dan mulai kelola kasir, stok, pembelian, HPP,
              hingga laporan dalam satu sistem.
            </p>

            {/* FEATURES */}

            <div className="mt-8 space-y-3">
              <FeatureItem text="Kelola transaksi dengan mudah" />

              <FeatureItem text="Pantau stok bahan baku" />

              <FeatureItem text="Hitung HPP dan keuntungan" />

              <FeatureItem text="Satu akun untuk mengelola usaha" />
            </div>
          </motion.div>
        </div>

        {/* ACCENT */}

        <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-[#4A5D23] via-[#E8A93A] to-[#C1440E]" />
      </section>

      {/* ============================================================
          MOBILE HERO
      ============================================================ */}

      <section className="relative h-[230px] overflow-hidden lg:hidden">
        <motion.img
          src="https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=1200&q=85"
          alt="Hidangan makanan Indonesia"
          initial={{ scale: 1.08 }}
          animate={{ scale: 1 }}
          transition={{
            duration: 1.3,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-black/50" />

        <div className="absolute inset-0 flex flex-col justify-between p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-[#4A5D23]">
              <Store className="h-5 w-5" />
            </div>

            <div>
              <p className="font-bold text-white">WartegPOS</p>

              <p className="text-xs text-white/60">Sistem manajemen usaha</p>
            </div>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-[#E8A93A]">
              Mulai dari sini
            </p>

            <h1 className="mt-1 text-2xl font-bold text-white">
              Daftarkan usaha Anda.
            </h1>
          </div>
        </div>
      </section>

      {/* ============================================================
          RIGHT — REGISTER
      ============================================================ */}

      <section className="flex flex-1 items-center justify-center px-5 py-10 sm:px-8 lg:w-[50%] lg:px-12 lg:py-12">
        <div className="w-full max-w-[560px]">
          {/* HEADER */}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.6,
            }}
            className="mb-8"
          >
            {/* Desktop logo */}

            <div className="mb-6 hidden h-11 w-11 items-center justify-center rounded-xl bg-[#4A5D23] text-white lg:flex">
              <Store className="h-5 w-5" />
            </div>

            <h2 className="text-3xl font-bold tracking-tight text-[#24211B]">
              Buat akun usaha
            </h2>

            <p className="mt-2 max-w-lg text-sm leading-6 text-muted-foreground">
              Daftarkan usaha Anda dan buat akun Owner untuk mulai menggunakan
              WartegPOS.
            </p>
          </motion.div>

          {/* FORM CARD */}

          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.7,
              delay: 0.1,
            }}
            className="rounded-2xl border bg-white p-6 shadow-[0_20px_60px_rgba(0,0,0,0.06)] sm:p-8"
          >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-7">
              {/* ======================================================
                  DATA USAHA
              ====================================================== */}

              <div>
                <SectionHeader
                  icon={<Store className="h-4 w-4" />}
                  title="Informasi usaha"
                  description="Masukkan informasi usaha yang akan Anda kelola."
                />

                <div className="mt-5">
                  <FormField
                    label="Nama Usaha"
                    htmlFor="tenantName"
                    error={errors.tenantName?.message}
                  >
                    <Input
                      id="tenantName"
                      placeholder="Contoh: Warteg Bahari"
                      className="h-12 rounded-xl"
                      {...register("tenantName")}
                    />
                  </FormField>
                </div>
              </div>

              {/* DIVIDER */}

              <div className="h-px bg-black/5" />

              {/* ======================================================
                  OWNER
              ====================================================== */}

              <div>
                <SectionHeader
                  icon={<UserRound className="h-4 w-4" />}
                  title="Akun Owner"
                  description="Akun ini akan memiliki akses penuh ke usaha Anda."
                />

                <div className="mt-5 grid gap-5 sm:grid-cols-2">
                  <FormField
                    label="Nama Lengkap"
                    htmlFor="name"
                    error={errors.name?.message}
                  >
                    <Input
                      id="name"
                      placeholder="Nama lengkap"
                      className="h-12 rounded-xl"
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
                      placeholder="Username"
                      className="h-12 rounded-xl"
                      {...register("username")}
                    />
                  </FormField>

                  <FormField
                    label="Email"
                    htmlFor="email"
                    error={errors.email?.message}
                    className="sm:col-span-2"
                  >
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                      <Input
                        id="email"
                        type="email"
                        placeholder="nama@email.com"
                        className="h-12 rounded-xl pl-10"
                        autoComplete="email"
                        {...register("email")}
                      />
                    </div>
                  </FormField>

                  {/* PASSWORD */}

                  <FormField
                    label="Password"
                    htmlFor="password"
                    error={errors.password?.message}
                  >
                    <div className="relative">
                      <LockKeyhole className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Minimal 8 karakter"
                        className="h-12 rounded-xl px-10"
                        autoComplete="new-password"
                        {...register("password")}
                      />

                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
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
                  </FormField>

                  {/* CONFIRM PASSWORD */}

                  <FormField
                    label="Konfirmasi Password"
                    htmlFor="confirmPassword"
                    error={errors.confirmPassword?.message}
                  >
                    <div className="relative">
                      <LockKeyhole className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Ulangi password"
                        className="h-12 rounded-xl px-10"
                        autoComplete="new-password"
                        {...register("confirmPassword")}
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        aria-label={
                          showConfirmPassword
                            ? "Sembunyikan password"
                            : "Tampilkan password"
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </FormField>
                </div>

                {/* PASSWORD RULES */}

                <div className="mt-4 grid gap-2 sm:grid-cols-3">
                  {passwordRules.map((rule) => (
                    <div
                      key={rule.label}
                      className={`flex items-center gap-2 text-xs ${
                        rule.valid ? "text-[#4A5D23]" : "text-muted-foreground"
                      }`}
                    >
                      <div
                        className={`flex h-4 w-4 items-center justify-center rounded-full border ${
                          rule.valid
                            ? "border-[#4A5D23] bg-[#4A5D23] text-white"
                            : "border-black/10"
                        }`}
                      >
                        {rule.valid && <Check className="h-2.5 w-2.5" />}
                      </div>

                      {rule.label}
                    </div>
                  ))}
                </div>
              </div>

              {/* ERROR */}

              {error && (
                <Alert variant="destructive" className="rounded-xl">
                  <AlertCircle className="h-4 w-4" />

                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* SECURITY */}

              <div className="flex gap-3 rounded-xl border bg-[#F8F7F4] p-4">
                <LockKeyhole className="mt-0.5 h-4 w-4 shrink-0 text-[#4A5D23]" />

                <p className="text-xs leading-5 text-muted-foreground">
                  Akun pertama yang dibuat akan otomatis menjadi{" "}
                  <strong className="text-foreground">Owner</strong> dan
                  memiliki akses penuh untuk mengelola usaha.
                </p>
              </div>

              {/* SUBMIT */}

              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-12 w-full rounded-xl bg-[#4A5D23] font-semibold text-white shadow-sm transition-all hover:bg-[#3d4d1c] hover:shadow-md"
              >
                {isSubmitting ? (
                  "Mendaftarkan usaha..."
                ) : (
                  <>
                    Buat Akun Usaha
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>

              {/* LOGIN */}

              <div className="border-t pt-5 text-center">
                <p className="text-sm text-muted-foreground">
                  Sudah memiliki akun?
                </p>

                <Link
                  href="/login"
                  className="mt-2 inline-block text-sm font-semibold text-[#4A5D23] hover:underline"
                >
                  Masuk ke WartegPOS
                </Link>
              </div>
            </form>
          </motion.div>

          {/* FOOTER */}

          <p className="mt-7 text-center text-xs text-muted-foreground">
            © 2026 WartegPOS · Sistem manajemen usaha
          </p>
        </div>
      </section>
    </main>
  );
}

/* ================================================================
   SECTION HEADER
================================================================ */

function SectionHeader({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#4A5D23]/10 text-[#4A5D23]">
        {icon}
      </div>

      <div>
        <h3 className="font-semibold text-[#24211B]">{title}</h3>

        <p className="mt-0.5 text-xs leading-5 text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  );
}

/* ================================================================
   FORM FIELD
================================================================ */

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

      {error && <p className="text-xs font-medium text-destructive">{error}</p>}
    </div>
  );
}

/* ================================================================
   FEATURE
================================================================ */

function FeatureItem({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3 text-sm text-white/80">
      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-white/15">
        <Check className="h-3 w-3 text-[#E8A93A]" />
      </div>

      <span>{text}</span>
    </div>
  );
}
