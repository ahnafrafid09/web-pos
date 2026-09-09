"use client";

import { useState } from "react";
import { toast } from "sonner";

import { getErrorMessage } from "@/lib/utils";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { PaymentMethodForm } from "./payment-method-form";
import type { PaymentMethodFormValues } from "../schemas/payment-method-schemas";
import { PaymentMethod } from "../types/payment-method-types";

interface PaymentMethodEditDialogProps {
  paymentMethod: PaymentMethod | null;

  open: boolean;

  onOpenChange: (open: boolean) => void;

  onUpdate: (id: string, data: PaymentMethodFormValues) => Promise<void>;
}

export function PaymentMethodEditDialog({
  paymentMethod,
  open,
  onOpenChange,
  onUpdate,
}: PaymentMethodEditDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: PaymentMethodFormValues) => {
    if (!paymentMethod) return;

    try {
      setIsLoading(true);

      await onUpdate(paymentMethod.id, data);

      toast.success("Payment method berhasil diperbarui");

      onOpenChange(false);
    } catch (error) {
      toast.error(getErrorMessage(error, "Gagal memperbarui payment method"));
    } finally {
      setIsLoading(false);
    }
  };

  if (!paymentMethod) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Payment Method</DialogTitle>
        </DialogHeader>

        <PaymentMethodForm
          key={paymentMethod.id}
          defaultValues={{
            name: paymentMethod.name,
            code: paymentMethod.code,
            usageType: paymentMethod.usageType,
          }}
          onSubmit={handleSubmit}
          submitLabel="Simpan Perubahan"
          isLoading={isLoading}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
