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

import type { UserFormValues } from "../schemas/user-schemas";
import { User } from "../types/user-types";
import { UserForm } from "./user-form";

interface UserEditDialogProps {
  user: User | null;

  open: boolean;

  onOpenChange: (open: boolean) => void;

  onUpdate: (id: string, data: UserFormValues) => Promise<void>;
}

export function UserEditDialog({
  user,
  open,
  onOpenChange,
  onUpdate,
}: UserEditDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: UserFormValues) => {
    if (!user) return;

    try {
      setIsLoading(true);

      await onUpdate(user.id, data);

      toast.success("Kategori berhasil diperbarui");

      onOpenChange(false);
    } catch (error) {
      toast.error(getErrorMessage(error, "Gagal memperbarui kategori"));
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Kategori</DialogTitle>
        </DialogHeader>

        <UserForm
          mode="edit"
          key={user.id}
          defaultValues={{
            name: user.name,
            username: user.username,
            email: user.email,
            role: user.role,
            password: "",
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
