"use client";

import {
  ColumnDef,
  ExpandedState,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getPaginationRowModel,
  Row,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronDown, ChevronRight } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  renderSubComponent?: (props: { row: Row<TData> }) => React.ReactElement;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  renderSubComponent,
}: DataTableProps<TData, TValue>) {
  const [expanded, setExpanded] = React.useState<ExpandedState>({});

  const table = useReactTable({
    data,
    columns,
    state: {
      expanded,
    },
    onExpandedChange: setExpanded,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    initialState: {
      pagination: {
        pageSize: 12,
      },
    },
  });

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col w-full overflow-hidden">
      <div className="overflow-x-auto w-full">
        <Table>
          <TableHeader className="bg-gray-100">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {renderSubComponent && (
                  <TableHead className="w-[50px]"></TableHead>
                )}
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className="text-center whitespace-nowrap text-gray-700 font-bold"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <React.Fragment key={row.id}>
                  <TableRow
                    data-state={row.getIsSelected() && "selected"}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    {renderSubComponent && (
                      <TableCell className="text-center w-[50px] p-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 hover:bg-gray-200"
                          onClick={() => row.toggleExpanded()}
                        >
                          {row.getIsExpanded() ? (
                            <ChevronDown className="h-4 w-4 text-blue-600" />
                          ) : (
                            <ChevronRight className="h-4 w-4 text-gray-500" />
                          )}
                        </Button>
                      </TableCell>
                    )}
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className="text-center whitespace-nowrap"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                  {row.getIsExpanded() && renderSubComponent && (
                    <TableRow className="bg-slate-50/80 hover:bg-slate-50/80 border-b">
                      <TableCell colSpan={columns.length + 1} className="p-0">
                        <div className="py-4 px-6 border-l-4 border-l-blue-400">
                          {renderSubComponent({ row })}
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (renderSubComponent ? 1 : 0)}
                  className="h-24 text-center"
                >
                  無資料
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-3 px-4 sm:px-6 bg-gray-50/50 border-t border-gray-100">
        <div className="flex-1 text-sm text-gray-500">
          共 {table.getFilteredRowModel().rows.length} 筆資料
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          上一頁
        </Button>
        <span className="text-sm font-medium">
          {table.getState().pagination.pageIndex + 1} /{" "}
          {Math.max(table.getPageCount(), 1)}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          下一頁
        </Button>
      </div>
    </div>
  );
}
