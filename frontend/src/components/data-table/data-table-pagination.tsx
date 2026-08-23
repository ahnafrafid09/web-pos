"use client";

import {
  stockFeatures,
  type PaginationState,
  type RowData,
  type Table,
} from "@tanstack/react-table";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DataTablePaginationProps<TData extends RowData> {
  table: Table<typeof stockFeatures, TData>;
  pagination: PaginationState;
  pageNumbers: (number | "...")[];
  currentPage: number;
  total?: number;

  totalLabel?: string;
  onPageChange: (page: number) => void;
}

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

export function DataTablePagination<TData extends RowData>({
  table,
  pagination,
  pageNumbers,
  currentPage,
  total,
  totalLabel = "data",
  onPageChange,
}: DataTablePaginationProps<TData>) {
  return (
    <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <p className="text-sm text-muted-foreground whitespace-nowrap">
            {total ?? 0} {totalLabel}
          </p>
          <p className="text-sm text-muted-foreground whitespace-nowrap">
            Baris per halaman
          </p>

          <Select
            value={String(pagination.pageSize)}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue />
            </SelectTrigger>

            <SelectContent side="top">
              {PAGE_SIZE_OPTIONS.map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {pageNumbers.map((page, index) =>
          page === "..." ? (
            <span
              key={`ellipsis-${index}`}
              className="px-2 text-sm text-muted-foreground"
            >
              ...
            </span>
          ) : (
            <Button
              key={page}
              variant={page === currentPage ? "default" : "outline"}
              size="icon"
              className="h-8 w-8"
              onClick={() => onPageChange(page)}
            >
              {page}
            </Button>
          ),
        )}

        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
