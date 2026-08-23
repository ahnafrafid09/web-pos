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

import { UserForm } from "./user-form";
import { UserFormValues } from "../schemas/user-schemas";

interface UserCreateDialogProps {
  onCreate: (data: UserFormValues) => Promise<void>;
}

export function UserCreateDialog({ onCreate }: UserCreateDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: UserFormValues) => {
    try {
      setIsLoading(true);

      await onCreate(data);

      toast.success("Pengguna berhasil ditambahkan");

      setOpen(false);
    } catch (error) {
      toast.error(getErrorMessage(error, "Gagal menambahkan pengguna"));
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
            Tambah Pengguna
          </Button>
        }
      />

      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Tambah Pengguna</DialogTitle>
        </DialogHeader>

        <UserForm
          mode="create"
          onSubmit={handleSubmit}
          submitLabel="Tambah Pengguna"
          isLoading={isLoading}
          onCancel={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
