import type { InputDefs } from "../Context/EditableData";
import { toDateTimeLocalString } from "../Utils/DataBuilder";

export class History {
  id: string = "";
  type: string = "";
  schema: string = "";
  data: any = {};
  createdAt: Date | null = null;
  updatedAt: Date | null = null;
  constructor(obj: any) {
    this.id = obj._id || "";
    this.type = obj.type;
    this.schema = obj.schema;
    this.data = obj.data || {};
    this.createdAt = obj.createdAt? new Date(obj.createdAt):null;
    this.updatedAt = obj.updatedAt? new Date(obj.updatedAt):null;
  }
}

export const HISTORY_COLUMNS = [
  {
    id: "id",
    enableColumnFilter: true
  },
  {
    id: "schema",
    enableColumnFilter: true
  },
  {
    name: "Updated At",
    id: "updatedAt",
    enableColumnFilter: false
  }
];

export const HISTORY_EDIT_INPUTS: InputDefs<History> = [
  [
    {
      inputType: "text",
      id: "id",
      label: "Id",
      readOnly: true,
    },
    {
      inputType: "datetime-local",
      id: "createdAt",
      label: "CreatedAt",
      readOnly: true,
      defaultValue: (data) => {
        return toDateTimeLocalString(data.current.createdAt)
      }
    },
    {
      inputType: "datetime-local",
      id: "updatedAt",
      label: "UpdatedAt",
      readOnly: true,
      defaultValue: (data) => {
        return toDateTimeLocalString(data.current.updatedAt)
      }
    }
  ],
  {
    inputType: "textarea",
    label: "Data (Not Editable)",
    id: "data",
    readOnly: true,
    defaultValue: (data) => {
      return JSON.stringify(data.current.data, null, 2);
    },
    props: {
      rows: 10,
      className: "has-[textarea:read-only]:bg-gray-200! has-[textarea:read-only]:border-gray-200!"
    }
  }
];