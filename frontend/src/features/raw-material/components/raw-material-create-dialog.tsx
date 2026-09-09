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

import type { RawMaterialFormValues } from "../schemas/raw-material-schema";

import type { Unit } from "@/global/unit";
import { RawMaterialForm } from "./raw-material-form";

interface RawMaterialCreateDialogProps {
  units: Unit[];

  onCreate: (data: RawMaterialFormValues) => Promise<void>;
}

export function RawMaterialCreateDialog({
  units,
  onCreate,
}: RawMaterialCreateDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: RawMaterialFormValues) => {
    try {
      setIsLoading(true);

      await onCreate(data);

      toast.success("Bahan baku berhasil ditambahkan");

      setOpen(false);
    } catch (error) {
      toast.error(getErrorMessage(error, "Gagal menambahkan bahan baku"));
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
            Tambah Bahan Baku
          </Button>
        }
      />

      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Tambah Bahan Baku</DialogTitle>
        </DialogHeader>

        <RawMaterialForm
          units={units}
          onSubmit={handleSubmit}
          submitLabel="Tambah Bahan Baku"
          isLoading={isLoading}
          onCancel={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
