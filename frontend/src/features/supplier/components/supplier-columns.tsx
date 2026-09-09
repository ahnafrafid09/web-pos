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

import { Supplier } from "../types/supplier-types";

export function SupplierColumns(
  onEdit: (supplier: Supplier) => void,
  onUpdateStatus: (supplier: Supplier) => void,
): Array<ColumnDef<typeof stockFeatures, Supplier>> {
  return [
    {
      accessorKey: "name",
      header: "Supplier",
    },
    {
      accessorKey: "code",
      header: "Code",
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
        const supplier = row.original;
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
              <DropdownMenuItem onClick={() => onEdit(supplier)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit {supplier.name}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onUpdateStatus(supplier)}>
                <Power className="mr-2 h-4 w-4" />
                {supplier.status ? "Nonaktifkan supplier" : "Aktifkan supplier"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
}
