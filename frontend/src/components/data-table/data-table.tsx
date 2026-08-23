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
    <div className="space-y-4">
      <div className="border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
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
                    <TableCell key={cell.id}>
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
                  <div className="flex min-h-40 items-center justify-center text-muted-foreground">
                    {emptyMessage}
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

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
  );
}
