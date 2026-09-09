"use client";

import {
  flexRender,
  RowData,
  stockFeatures,
  useTable,
  type ColumnDef,
  type PaginationState,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Skeleton } from "@/components/ui/skeleton";
import { DataTablePagination } from "./data-table-pagination";

interface DataTableProps<TData extends RowData> {
  columns: Array<ColumnDef<typeof stockFeatures, TData>>;
  data: TData[];

  loading?: boolean;

  pagination: PaginationState;
  pageCount: number;

  total?: number;
  totalLabel?: string;

  onPaginationChange: (
    updater: PaginationState | ((old: PaginationState) => PaginationState),
  ) => void;

  emptyMessage?: string;
}

function getPageNumbers(current: number, total: number): (number | "...")[] {
  if (total <= 1) {
    return [1];
  }

  const delta = 1;
  const pages: (number | "...")[] = [];

  const start = Math.max(2, current - delta);
  const end = Math.min(total - 1, current + delta);

  pages.push(1);

  if (start > 2) {
    pages.push("...");
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (end < total - 1) {
    pages.push("...");
  }

  pages.push(total);

  return pages;
}

export function DataTable<TData extends RowData>({
  columns,
  data,
  loading = false,
  pagination,
  pageCount,
  onPaginationChange,
  total,
  totalLabel,
  emptyMessage = "Data tidak ditemukan",
}: DataTableProps<TData>) {
  const table = useTable({
    features: stockFeatures,
    columns,
    data,
    pageCount,
    state: {
      pagination,
    },
    onPaginationChange,
    manualPagination: true,
    manualFiltering: true,
  });

  const currentPage = pagination.pageIndex + 1;

  const pageNumbers = getPageNumbers(currentPage, Math.max(pageCount, 1));

  const goToPage = (page: number) => {
    onPaginationChange((old) => ({
      ...old,
      pageIndex: page - 1,
    }));
  };

  return (
    <div className="w-full space-y-4">
      {/* Desktop Table View */}
      <div className="hidden w-full overflow-hidden rounded-md border sm:block">
        <div className="w-full overflow-x-auto">
          <Table className="min-w-[800px]">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} className="whitespace-nowrap">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              {loading ? (
                Array.from({
                  length: pagination.pageSize,
                }).map((_, rowIndex) => (
                  <TableRow key={`skeleton-${rowIndex}`}>
                    {columns.map((_, cellIndex) => (
                      <TableCell key={cellIndex}>
                        <Skeleton className="h-5 w-full" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="whitespace-nowrap">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-40 p-0">
                    <div className="flex min-h-40 items-center justify-center px-4 text-center text-muted-foreground">
                      {emptyMessage}
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="space-y-3 sm:hidden">
        {loading ? (
          Array.from({ length: 5 }).map((_, index) => (
            <div
              key={`skeleton-mobile-${index}`}
              className="rounded-lg border bg-card p-4 shadow-sm"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-5 w-1/2" />
                  <Skeleton className="h-5 w-20" />
                </div>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-8 w-20" />
                </div>
              </div>
            </div>
          ))
        ) : table.getRowModel().rows.length > 0 ? (
          table.getRowModel().rows.map((row) => (
            <div
              key={row.id}
              className="rounded-lg border bg-card p-4 shadow-sm hover:bg-muted/50"
            >
              <div className="space-y-2">
                {row.getVisibleCells().map((cell) => {
                  const header = cell.column.columnDef.header;
                  const headerText = typeof header === "string" ? header : "";

                  return (
                    <div
                      key={cell.id}
                      className="flex items-center justify-between gap-2"
                    >
                      <span className="text-xs font-medium text-muted-foreground shrink-0">
                        {headerText}
                      </span>
                      <span className="text-sm font-medium text-right truncate max-w-[60%]">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        ) : (
          <div className="flex min-h-[200px] items-center justify-center rounded-lg border bg-card">
            <p className="text-center text-sm text-muted-foreground p-4">
              {emptyMessage}
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="w-full overflow-x-auto">
        <DataTablePagination
          table={table}
          pagination={pagination}
          pageNumbers={pageNumbers}
          currentPage={currentPage}
          total={total}
          totalLabel={totalLabel}
          onPageChange={goToPage}
        />
      </div>
    </div>
  );
}
