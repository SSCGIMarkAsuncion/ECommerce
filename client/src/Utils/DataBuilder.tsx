import { createColumnHelper, type Row } from "@tanstack/react-table";
import type { ReactNode } from "react";
import { RowActions } from "../Components/DataTable";
import { Pill } from "../Components/Pill";

export type OpenableData = "products" | "promos" | "orders" | "users" | "payments";
export type TableData = {
  column: any[],
  data: any[]
};
export type RowAction = (data: any) => ReactNode;
export interface IColumn {
  name?: string,
  id: string,
  enableColumnFilter?: boolean,
  enableSorting?: boolean
  isNumber?: boolean,
  isDate?: boolean,
  isArray?: boolean
};

// export function buildRowsFrom(dataType: OpenableData, rawDatas: any[]) {
//   const formattedData = rawDatas.map((data) => {
//     data.actions = (data: any) => (<RowActions type={dataType} data={data} />);
//   });
//   return formattedData;
// }

function numberFilterFn(row: Row<any>, columnId: string, filterValue: string) {
  const cellValue = row.getValue(columnId);
  return String(cellValue).includes(String(filterValue));
}

function arrayFilterFn(row: Row<any>, columnId: string, filterValue: string) {
  const cellValue = row.getValue(columnId) as string[];
  for (let i=0;i<cellValue.length;i++) {
    if (cellValue[i].includes(filterValue))
      return true;
  }
  return false;
}

export function buildColumnFrom(
  type: OpenableData,
  columnDef: IColumn[]
) {
  const columnHelper = createColumnHelper<any>();
  const columns = [];

  columns.push(
    columnHelper.display({
      header: () => {
        return <p className="w-full text-center">Actions</p>
      },
      id: "actions",
      enableResizing: false,
      maxSize: 100,
      cell: props => {
        // console.log(props.row);
        return <RowActions type={type} data={props.row} />
      }
    })
  );

  columnDef.forEach((colDef) => {
    let filterFn = undefined;
    if (colDef.isNumber) {
      filterFn = numberFilterFn;
    }
    else if (colDef.isArray) {
      filterFn = arrayFilterFn;
    }
    columns.push(
      columnHelper.accessor(colDef.id, {
        header: colDef.name || colDef.id,
        filterFn: filterFn,
        cell: props => {
          const rawValue = props.getValue();
          if (rawValue instanceof Date) {
            return rawValue.toLocaleString();
          }
          if (Array.isArray(rawValue)) {
            return <div className="flex flex-wrap gap-1 text-xs">
              {
                rawValue.map((v) => {
                  return <Pill key={v}>{v}</Pill>;
                })
              }
            </div>
          }
          return props.getValue();
        },
        enableSorting: colDef.enableSorting,
        enableColumnFilter: colDef.isDate? false:colDef.enableColumnFilter
      })
    );
  });

  return columns;
}