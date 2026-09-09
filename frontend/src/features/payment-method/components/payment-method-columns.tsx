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

import { PaymentMethod, UsageType } from "../types/payment-method-types";

const usageTypeLabels: Record<UsageType, string> = {
  PURCHASE: "Purchase",
  TRANSACTION: "Transaction",
  BOTH: "Both",
};

export function PaymentMethodColumns(
  onEdit: (paymentMethod: PaymentMethod) => void,
  onUpdateStatus: (paymentMethod: PaymentMethod) => void,
): Array<ColumnDef<typeof stockFeatures, PaymentMethod>> {
  return [
    {
      accessorKey: "name",
      header: "Payment Method",
    },
    {
      accessorKey: "code",
      header: "Code",
    },
    {
      accessorKey: "usageType",
      header: "Usage Type",
      cell: ({ row }) => {
        const usageType = row.original.usageType;
        return <Badge variant="outline">{usageTypeLabels[usageType]}</Badge>;
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
        const paymentMethod = row.original;
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
              <DropdownMenuItem onClick={() => onEdit(paymentMethod)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit {paymentMethod.name}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onUpdateStatus(paymentMethod)}>
                <Power className="mr-2 h-4 w-4" />
                {paymentMethod.status
                  ? "Nonaktifkan payment method"
                  : "Aktifkan payment method"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
}
