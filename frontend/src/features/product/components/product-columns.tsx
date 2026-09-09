"use client";
import { stockFeatures, type ColumnDef } from "@tanstack/react-table";
import {
  MoreHorizontal,
  Pencil,
  Power,
  Receipt,
  ReceiptText,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import type { Product } from "../types/product-types";
import { formatRupiah } from "@/lib/utils/currency";
import { hasModule } from "@/features/auth/utils/module-access";
import { MeResponse } from "@/features/auth/types/auth.types";

function getProductType(type: Product["type"]) {
  const types = {
    RAW_MATERIAL: "Bahan Baku",
    MENU: "Menu",
    MERCHANDISE: "Merchandise",
  };

  return types[type];
}

export function productColumns(
  onEdit: (product: Product) => void,
  onUpdateStatus: (product: Product) => void,
  onRecipe: (product: Product) => void,
  user: MeResponse | null,
): Array<ColumnDef<typeof stockFeatures, Product>> {
  const canUseRecipe = hasModule(user, "RECIPE");
  return [
    {
      accessorKey: "name",
      header: "Produk",
      cell: ({ row }) => {
        const product = row.original;

        return (
          <div>
            <p className="font-medium">{product.name}</p>
            {product.sku && (
              <p className="text-xs text-muted-foreground">
                SKU: {product.sku}
              </p>
            )}
          </div>
        );
      },
    },

    {
      id: "category",
      accessorFn: (row) => row.category?.name ?? "-",
      header: "Kategori",
    },

    {
      accessorKey: "type",
      header: "Jenis",
      cell: ({ row }) => (
        <Badge variant="secondary">{getProductType(row.original.type)}</Badge>
      ),
    },

    {
      accessorKey: "unit",
      header: "Satuan",
    },

    {
      accessorKey: "sellingPrice",
      header: "Harga Jual",
      cell: ({ row }) => {
        const product = row.original;
        return formatRupiah(Number(product.sellingPrice));
      },
    },

    {
      accessorKey: "hpp",
      header: "Hpp",
      cell: ({ row }) => {
        const hpp = row.original.hpp;

        if (hpp > 0) {
          return formatRupiah(Number(hpp));
        } else {
          <Badge variant="default">Hpp belum di input, harap input</Badge>;
        }
      },
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
        const product = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <MoreHorizontal className="h-5 w-5" />
                </Button>
              }
            />

            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={() => onEdit(product)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit {product.name}
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => onUpdateStatus(product)}>
                <Power className="mr-2 h-4 w-4" />
                {product.status ? "Nonaktifkan Produk" : "Aktifkan Produk"}
              </DropdownMenuItem>
              {canUseRecipe && (
                <DropdownMenuItem onClick={() => onRecipe(product)}>
                  <ReceiptText className="mr-2 h-4 w-4" />
                  Buat Resep
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
}
