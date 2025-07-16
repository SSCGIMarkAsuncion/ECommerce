import { type ColumnFiltersState, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, type SortDirection, type SortingState, useReactTable } from "@tanstack/react-table";
import { useState, type HTMLProps } from "react";
import Button from "./Button";
import Input from "./Input";

export interface DataTableProps extends HTMLProps<HTMLElement> {
  tableColumns: any[],
  tableData: any[]
};

export default function DataTable(props: DataTableProps) {
  const [data] = useState(() => [...props.tableData]);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);

  const charsAscDesc = {
    asc: '⏶',
    desc: '⏷',
  };

  const table = useReactTable({
    data,
    columns: props.tableColumns,
    state: {
      sorting,
      columnFilters,
      pagination: {
        pageIndex,
        pageSize: pageSize,
      },
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    sortDescFirst: true,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    columnResizeMode: 'onChange',
    enableColumnResizing: true,
    manualPagination: false,
    onPaginationChange: updater => {
      const next = typeof updater === 'function' ? updater({ pageIndex, pageSize: pageSize }) : updater;
      setPageIndex(next.pageIndex);
    },
  });
  return <div className="p-4">
      <table className={`min-w-full table-fixed text-black`}>
        <thead className="bg-gray-100">
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>

              {headerGroup.headers.map((header, i, arr) =>{
                return (
                  <th key={header.id}
                    className="uppercase relative p-2 border-b-2 border-gray-200 text-left text-primary-950 text-md font-semibold"
                    style={{ width: header.getSize() }} >
                    <div
                      className="cursor-pointer select-none flex items-center gap-1"
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {charsAscDesc[(header.column.getIsSorted() as SortDirection)] || ""}
                    </div>
                    {header.column.getCanFilter() ? (
                      <Input
                        className="text-sm"
                        type="text"
                        value={(header.column.getFilterValue() ?? '') as string}
                        onChange={e => header.column.setFilterValue((e.target as HTMLInputElement).value)}
                        placeholder={`Filter ${header.column.id}`}
                      />
                    ) : null}
                    {header.column.getCanResize() && (
                      <div
                        onMouseDown={header.getResizeHandler()}
                        onTouchStart={header.getResizeHandler()}
                        className={`resizer ${header.column.getIsResizing() ? 'isResizing' : ''
                          }`}
                      ></div>
                    )}
                  </th>
                )
              })}

            </tr>
          ))}
        </thead>

        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr key={row.id} className="hover:bg-gray-50">
              {row.getVisibleCells().map(cell => (
                <td key={cell.id} className="px-4 py-2 border-b-2 border-gray-200 text-sm">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div hidden={data.length <= pageSize} className="flex gap-4 items-center mt-4 text-sm">
        <Button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Prev
        </Button>
        <span>
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </span>
        <Button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>;
}