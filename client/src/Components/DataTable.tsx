import { type ColumnFiltersState, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, type SortDirection, type SortingState, useReactTable } from "@tanstack/react-table";
import { useState, type HTMLAttributes, type HTMLProps } from "react";
import Button from "./Button";
import Input from "./Input";
import { MODIFY_DATA_ACTION_ADD, MODIFY_DATA_ACTION_DELETE, MODIFY_DATA_ACTION_EDIT, MODIFY_DATA_EVENT_NAME, type OpenableData } from "../Utils/DataBuilder";
import { IconCaretDown, IconPen, IconPlus, IconTrash } from "../Utils/SVGIcons";

export interface DataTableProps extends HTMLProps<HTMLElement> {
  tableColumns: any[],
  tableData: any[],
  title: string
};

export default function DataTable(props: DataTableProps) {
  const [data] = useState(() => [...props.tableData]);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);

  const triggerAddEvent = () => {
    const ev = new CustomEvent(MODIFY_DATA_EVENT_NAME, {
      detail: {
        action: MODIFY_DATA_ACTION_ADD,
        dataType: "",
        data: null
      }
    });
    window.dispatchEvent(ev);
  };

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
      <div className="flex gap-2 capitalize items-center">
        <h3 className="text-2xl">{props.title}</h3>
        <Button onClick={() => {
          triggerAddEvent();
        }} className="m-2 ml-auto capitalize text-sm" pColor="green"><IconPlus className="w-4 h-4" /> Add</Button>
      </div>
      <div className="w-full rounded-lg overflow-y-hidden border-2 border-gray-200">
      <table className={`min-w-full table-fixed text-black`}>
        <thead className="bg-gray-100">
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>

              {headerGroup.headers.map((header) =>{
                return (
                  <th key={header.id}
                    className="capitalize relative p-1 border-b-2 border-gray-200 text-left text-primary-950 text-md font-semibold"
                    style={{
                      width: header.getSize(),
                      maxWidth: `${header.column.columnDef.maxSize}px`
                    }} >
                    <div
                      className="cursor-pointer select-none flex items-center gap-1"
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {charsAscDesc[(header.column.getIsSorted() as SortDirection)] || ""}
                    </div>
                    {header.column.getCanFilter() ? (
                      <Input
                        className="text-xs"
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
                        style={{
                          userSelect: "none",
                          touchAction: "none"
                        }}
                        className={`absolute top-0 right-0 h-full w-[3px] bg-black/50 cursor-col-resize opacity-0 hover:opacity-100 ${header.column.getIsResizing() ? "bg-primary-900 opacity-100" : ''
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
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="hover:bg-gray-100 max-h-[60px]">
              {row.getVisibleCells().map(cell => (
                <td key={cell.id} className={`p-1 border-gray-200 text-sm border-b-2`}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div hidden={data.length < pageSize} className="flex gap-4 items-center m-2 text-sm">
          <Button
            className="w-8 aspect-square"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <IconCaretDown className="rotate-90" />
          </Button>
          <span>
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </span>
          <Button
            className="w-8 aspect-square"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <IconCaretDown className="rotate-[-90deg]" />
          </Button>
        </div>
      </div>
    </div>;
}


export interface RowActionsProps extends HTMLAttributes<HTMLDivElement> {
  data: any,
  type: OpenableData
};

export function RowActions(props: RowActionsProps) {
  const buttonSizes = "w-7 h-7";
  const triggerEvent = (evType: string) => {
    const ev = new CustomEvent(MODIFY_DATA_EVENT_NAME, {
      detail: {
        action: evType,
        dataType: props.type,
        data: props.data
      }
    });
    window.dispatchEvent(ev);
  };

  return <div className="flex gap-2 justify-center">
    <Button onClick={(e) => {
      e.preventDefault();
      triggerEvent(MODIFY_DATA_ACTION_EDIT);
    }} pType="icon" className={buttonSizes} ><IconPen className="fill-green-800" /></Button>
    <Button onClick={(e) => {
      e.preventDefault();
      triggerEvent(MODIFY_DATA_ACTION_DELETE);
    }} pType="icon" className={buttonSizes} ><IconTrash className="fill-red-800" /></Button>
  </div>;
}