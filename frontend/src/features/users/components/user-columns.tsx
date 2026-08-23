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

import { User } from "../types/user-types";

function getProductType(role: User["role"]) {
  const roles = {
    ADMIN: "Admin",
    OWNER: "Owner",
    CASHIER: "Kasir",
  };

  return roles[role];
}
export function UserColumns(
  onEdit: (category: User) => void,
  onUpdateStatus: (category: User) => void,
): Array<ColumnDef<typeof stockFeatures, User>> {
  return [
    {
      accessorKey: "name",
      header: "User",
    },
    {
      accessorKey: "username",
      header: "Username",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => (
        <Badge variant="secondary">{getProductType(row.original.role)}</Badge>
      ),
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
        const user = row.original;
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
              <DropdownMenuItem onClick={() => onEdit(user)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit {user.name}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onUpdateStatus(user)}>
                <Power className="mr-2 h-4 w-4" />
                {user.status ? "Nonaktifkan Pengguna" : "Aktifkan Pengguna"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
}
