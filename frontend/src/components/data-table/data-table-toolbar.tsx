"use client";

import type { ReactNode } from "react";
import { Input } from "@/components/ui/input";

export interface DataTableSearch {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

interface DataTableToolbarProps {
  search?: DataTableSearch;
  filters?: ReactNode;
  className?: string;
}

export function DataTableToolbar({
  search,
  filters,
  className,
}: DataTableToolbarProps) {
  return (
    <div
      className={`flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between ${className ?? ""}`}
    >
      {search && (
        <div className="w-full sm:max-w-sm sm:flex-1">
          <Input
            value={search.value}
            onChange={(event) => search.onChange(event.target.value)}
            placeholder={search.placeholder ?? "Cari..."}
            className="w-full"
          />
        </div>
      )}

      {filters && (
        <div className="grid w-full grid-cols-1 gap-2 sm:flex sm:w-auto sm:flex-wrap">
          {filters}
        </div>
      )}
    </div>
  );
}
