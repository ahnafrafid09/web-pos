"use client";
import { stockFeatures, type ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Pencil, Power } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import type { RawMaterial } from "../types/raw-material-types";
import { formatRupiah } from "@/lib/utils/currency";

// function getProductType(type: Product["type"]) {
//   const types = {
//     RAW_MATERIAL: "Bahan Baku",
//     MENU: "Menu",
//     MERCHANDISE: "Merchandise",
//   };

//   return types[type];
// }

export function rawMaterialColumns(
  onEdit: (rawMaterial: RawMaterial) => void,
  onUpdateStatus: (rawMaterial: RawMaterial) => void,
): Array<ColumnDef<typeof stockFeatures, RawMaterial>> {
  return [
    {
      accessorKey: "name",
      header: "Bahan Baku",
      cell: ({ row }) => {
        const rawMaterial = row.original;

        return (
          <div>
            <p className="font-medium">{rawMaterial.name}</p>
            {rawMaterial.sku && (
              <p className="text-xs text-muted-foreground">
                SKU: {rawMaterial.sku}
              </p>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "unit",
      header: "Satuan",
      cell: ({ row }) => {
        const unit = row.original.unit;
        return (
          <div>
            <p className="font-medium">{unit.name}</p>
            {unit.code && (
              <p className="text-xs text-muted-foreground">Code: {unit.code}</p>
            )}
          </div>
        );
      },
    },

    {
      accessorKey: "avarageCost",
      header: "Rata Rata biaya",
      cell: ({ row }) => {
        const rawMaterial = row.original;
        return formatRupiah(Number(rawMaterial.averageCost));
      },
    },
    {
      id: "minimumStock",
      accessorFn: (row) => row.stock?.minimumStock ?? 0,
      header: "Minimal Stok",
    },

    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status;
        return (
          <Badge variant={status ? "default" : "secondary"}>
            {status ? "Aktif" : "Nonaktif"}
          </Badge>
        );
      },
    },

    {
      id: "actions",
      header: "",
      cell: ({ row }) => {
        const rawMaterial = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              }
            />

            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(rawMaterial)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit {rawMaterial.name}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onUpdateStatus(rawMaterial)}>
                <Power className="mr-2 h-4 w-4" />
                {rawMaterial.status ? "Nonaktifkan Produk" : "Aktifkan Produk"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
}
