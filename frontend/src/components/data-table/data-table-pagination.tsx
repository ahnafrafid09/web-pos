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
    <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
      {/* Mobile: Compact layout */}
      <div className="flex w-full flex-col items-center gap-2 sm:flex-row sm:items-center sm:gap-4">
        <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
          <p className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">
            {total ?? 0} {totalLabel}
          </p>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] sm:text-xs text-muted-foreground whitespace-nowrap hidden sm:inline">
              Baris per halaman
            </span>

            <Select
              value={String(pagination.pageSize)}
              onValueChange={(value) => {
                table.setPageSize(Number(value));
              }}
            >
              <SelectTrigger className="h-7 w-[60px] sm:h-8 sm:w-[70px]">
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
      </div>

      {/* Pagination buttons - simplified on mobile */}
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon"
          className="h-7 w-7 sm:h-8 sm:w-8"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <ChevronLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        </Button>

        {/* Show fewer page numbers on mobile */}
        <div className="flex items-center gap-0.5 overflow-x-auto max-w-[200px] sm:max-w-none sm:overflow-visible">
          {pageNumbers.map((page, index) =>
            page === "..." ? (
              <span
                key={`ellipsis-${index}`}
                className="px-1.5 text-xs sm:text-sm text-muted-foreground"
              >
                ...
              </span>
            ) : (
              <Button
                key={page}
                variant={page === currentPage ? "default" : "outline"}
                size="icon"
                className="h-7 w-7 sm:h-8 sm:w-8 text-xs"
                onClick={() => onPageChange(page)}
              >
                {page}
              </Button>
            ),
          )}
        </div>

        <Button
          variant="outline"
          size="icon"
          className="h-7 w-7 sm:h-8 sm:w-8"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        </Button>
      </div>
    </div>
  );
}
