"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { userSchema, type UserFormValues } from "../schemas/user-schemas";

import { userRoleOptions } from "../constants/user-contants";

interface UserFormProps {
  mode: "create" | "edit";
  defaultValues?: Partial<UserFormValues>;
  onSubmit: (data: UserFormValues) => void | Promise<void>;
  submitLabel?: string;
  isLoading?: boolean;
  onCancel?: () => void;
}

export function UserForm({
  mode,
  defaultValues,
  onSubmit,
  submitLabel = "Simpan",
  isLoading = false,
  onCancel,
}: UserFormProps) {
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
      role: "CASHIER",
      ...defaultValues,
    },
  });

  const handleSubmit = (data: UserFormValues) => {
    if (mode === "create" && !data.password) {
      form.setError("password", {
        message: "Password wajib diisi",
      });

      return;
    }

    if (data.password && data.password.length < 8) {
      form.setError("password", {
        message: "Password minimal 8 karakter",
      });

      return;
    }

    return onSubmit(data);
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="name">Nama Pengguna</label>

        <Input
          id="name"
          placeholder="Masukkan nama pengguna"
          {...form.register("name")}
        />

        {form.formState.errors.name && (
          <p className="text-sm text-destructive">
            {form.formState.errors.name.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="username">Username Pengguna</label>

        <Input
          id="username"
          placeholder="Masukkan username"
          {...form.register("username")}
        />

        {form.formState.errors.username && (
          <p className="text-sm text-destructive">
            {form.formState.errors.username.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="email">Email Pengguna</label>

        <Input
          id="email"
          type="email"
          placeholder="Masukkan email"
          {...form.register("email")}
        />

        {form.formState.errors.email && (
          <p className="text-sm text-destructive">
            {form.formState.errors.email.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="password">Password Pengguna</label>

        <Input
          id="password"
          type="password"
          placeholder={
            mode === "edit"
              ? "Kosongkan jika tidak ingin mengubah password"
              : "Masukkan password"
          }
          {...form.register("password")}
        />

        {form.formState.errors.password && (
          <p className="text-sm text-destructive">
            {form.formState.errors.password.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="role">Role Pengguna</label>

        <select
          id="role"
          className="border-input bg-background h-9 w-full rounded-md border px-3 text-sm"
          {...form.register("role")}
        >
          {userRoleOptions.map((role) => (
            <option key={role.value} value={role.value}>
              {role.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            Batal
          </Button>
        )}

        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Menyimpan..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}
