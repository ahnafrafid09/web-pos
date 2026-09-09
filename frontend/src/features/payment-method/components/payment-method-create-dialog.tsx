"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { getErrorMessage } from "@/lib/utils";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { PaymentMethodForm } from "./payment-method-form";
import { PaymentMethodFormValues } from "../schemas/payment-method-schemas";

interface PaymentMethodCreateDialogProps {
  onCreate: (data: PaymentMethodFormValues) => Promise<void>;
}

export function PaymentMethodCreateDialog({
  onCreate,
}: PaymentMethodCreateDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: PaymentMethodFormValues) => {
    try {
      setIsLoading(true);

      await onCreate(data);

      toast.success("Payment method berhasil ditambahkan");

      setOpen(false);
    } catch (error) {
      toast.error(getErrorMessage(error, "Gagal menambahkan payment method"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Tambah Payment Method
          </Button>
        }
      />

      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Tambah Payment Method</DialogTitle>
        </DialogHeader>

        <PaymentMethodForm
          onSubmit={handleSubmit}
          submitLabel="Tambah Payment Method"
          isLoading={isLoading}
          onCancel={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
