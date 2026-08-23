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
    <div className={`flex flex-wrap items-center gap-2 ${className ?? ""}`}>
      {search && (
        <Input
          value={search.value}
          onChange={(event) => search.onChange(event.target.value)}
          placeholder={search.placeholder ?? "Cari..."}
          className="max-w-sm"
        />
      )}

      {filters}
    </div>
  );
}
