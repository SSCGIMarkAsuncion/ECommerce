import React, { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { type OpenableData, type TableData } from "../Utils/DataBuilder";
import { useEditableData } from "../Hooks/useEditableData";
import { useNotification } from "./Notify";
import { useSearchParams } from "react-router";
import type { MError } from "../Utils/Error";

export type ActionTypes = "none" | "new" | "edit" | "delete" | "add";
type Dispatcher<T> = React.Dispatch<React.SetStateAction<T>>;

const SelectedDataContext = createContext<{ selectedData: OpenableData, setSelectedData: Dispatcher<OpenableData> }>(null!);
const DataContext = createContext<TableData | null>(null);
const ActionContext = createContext<{ actionType: ActionTypes, setActionType: Dispatcher<ActionTypes> }>(null!);
const CurrentDataContext = createContext<{ currentData: any, setCurrentData: Dispatcher<any> }>(null!);
const ReloadContext = createContext<() => void>(() => {});
const ErrorsContext = createContext<{ errors: string[], setErrors: Dispatcher<string[]> }>(null!);

export function EditableDataContextProvider({ children }: { children: ReactNode }) {
  const [ searchParams, setSearchParams ] = useSearchParams();
  let defaultSelected = "products";
  switch (searchParams.get("s")) {
    case "products":
    case "promos":
    case "orders":
    case "users":
    case "carts":
      defaultSelected = searchParams.get("s")!;
    default:
      break;
  }

  const [ actionType, setActionType ] = useState<ActionTypes>("none");
  const [ selectedData, setSelectedData ] = useState<OpenableData>(defaultSelected as OpenableData);
  const [ tableData, setTableData ] = useState<TableData | null>(null);
  const [ currentData, setCurrentData ] = useState<any | null>(null);
  const [ reloadData, setReloadData ] = useState<boolean>(false);
  const [ errors, setErrors ] = useState<string[]>([]);
  const notify = useNotification();

  const { load: loadData } = useEditableData();

  useEffect(() => {
    if (actionType == "none") {
      setCurrentData(null);
    }
  }, [actionType]);

  useEffect(() => {
    async function a() {
      try {
        const data = await loadData(selectedData)
        setTableData(data);
      }
      catch (e) {
        notify("error", e as MError);
      }
    }
    a();
  }, [selectedData, reloadData]);

  useEffect(() => {
    if (searchParams.get("s") === selectedData) return;
    setSearchParams(`?s=${selectedData}`);
  }, [selectedData]);

  return <SelectedDataContext.Provider value={{ selectedData, setSelectedData }}>
    <DataContext.Provider value={tableData}>
      <ActionContext.Provider value={{ actionType, setActionType }}>
        <CurrentDataContext.Provider value={{ currentData, setCurrentData }}>
        <ReloadContext.Provider value={() => setReloadData(v => !v)}>
        <ErrorsContext.Provider value={{ errors, setErrors }}>
          {children}
        </ErrorsContext.Provider>
        </ReloadContext.Provider>
        </CurrentDataContext.Provider>
      </ActionContext.Provider>
    </DataContext.Provider>
  </SelectedDataContext.Provider>
}

export function useEditableDataContext() {
  return {
    selectedData: useContext(SelectedDataContext),
    tableData: useContext(DataContext),
    actionType: useContext(ActionContext),
    currentData: useContext(CurrentDataContext),
    reload: useContext(ReloadContext),
    errors: useContext(ErrorsContext)
  };
}

export interface EditInputFormDef<T> {
  inputType: "text" | "email" | "select" | "number" | "textarea" | "password" | "datetime-local" | "tags" | "images",
  label: string,
  id: string,
  placeholder?: string,
  name?: string,
  defaultValue?: (data: React.RefObject<T>) => string, // if default use id as accessor to data: T
  onChange?: (data: React.RefObject<T>, newValue: any) => void, // same as defaultValue
  readOnly?: boolean,
  required?: boolean,
  options?: string[], // for select
  // onProcessing?: () => void,
  // onProcessingDone?: () => void,
  // onErr?: (e: MError, notify: ReturnType<typeof useNotification>) => void,
  validators?: ((value: string) => string | string[])[],
  props?: any // props to the element to render
};

export type InputDefs<T> = (EditInputFormDef<T> | (EditInputFormDef<T>[]))[];

export const EditFormContext = createContext<React.RefObject<any>>(null!)

export function EditFormProvider({ children, data }: { children: ReactNode, data: any }) {
  const rdata = useRef<any>(data);

  return <EditFormContext.Provider value={rdata}>
    {children}
  </EditFormContext.Provider>
}