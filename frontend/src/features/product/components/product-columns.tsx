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

import type { Product } from "../types/product-types";
import { formatRupiah } from "@/lib/utils/currency";
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
): Array<ColumnDef<typeof stockFeatures, Product>> {
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
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              }
            />

            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(product)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit {product.name}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onUpdateStatus(product)}>
                <Power className="mr-2 h-4 w-4" />
                {product.status ? "Nonaktifkan Produk" : "Aktifkan Produk"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
}
