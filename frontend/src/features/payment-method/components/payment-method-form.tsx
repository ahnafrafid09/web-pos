"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  PaymentMethodFormValues,
  paymentMethodSchema,
} from "../schemas/payment-method-schemas";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PaymentMethodFormProps {
  defaultValues?: Partial<PaymentMethodFormValues>;
  onSubmit: (data: PaymentMethodFormValues) => void | Promise<void>;
  submitLabel?: string;
  isLoading?: boolean;
  onCancel?: () => void;
}

export function PaymentMethodForm({
  defaultValues,
  onSubmit,
  submitLabel = "Simpan",
  isLoading = false,
  onCancel,
}: PaymentMethodFormProps) {
  const form = useForm<PaymentMethodFormValues>({
    resolver: zodResolver(paymentMethodSchema),
    defaultValues: {
      name: "",
      code: "",
      usageType: "PURCHASE",
      ...defaultValues,
    },
  });

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="name">Nama Payment Method</label>

        <Input
          id="name"
          placeholder="Masukkan nama Payment Method"
          {...form.register("name")}
        />

        {form.formState.errors.name && (
          <p className="text-sm text-destructive">
            {form.formState.errors.name.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="code">Code Payment Method</label>

        <Input id="code" placeholder="COD" {...form.register("code")} />

        {form.formState.errors.code && (
          <p className="text-sm text-destructive">
            {form.formState.errors.code.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="usageType">Usage Type</label>

        <Select
          onValueChange={(value) =>
            form.setValue(
              "usageType",
              value as "PURCHASE" | "TRANSACTION" | "BOTH",
            )
          }
          value={form.watch("usageType")}
        >
          <SelectTrigger>
            <SelectValue placeholder="Pilih usage type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="PURCHASE">Purchase</SelectItem>
            <SelectItem value="TRANSACTION">Transaction</SelectItem>
            <SelectItem value="BOTH">Both</SelectItem>
          </SelectContent>
        </Select>

        {form.formState.errors.usageType && (
          <p className="text-sm text-destructive">
            {form.formState.errors.usageType.message}
          </p>
        )}
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
