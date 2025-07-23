import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { type OpenableData, type TableData } from "../Utils/DataBuilder";
import { useEditableData } from "../Hooks/useEditableData";

export type ActionTypes = "none" | "new" | "edit" | "delete" | "add";
type Dispatcher<T> = React.Dispatch<React.SetStateAction<T>>;

const SelectedDataContext = createContext<{ selectedData: OpenableData, setSelectedData: Dispatcher<OpenableData> } | null>(null);
const DataContext = createContext<TableData | null>(null);
const ActionContext = createContext<{ actionType: ActionTypes, setActionType: Dispatcher<ActionTypes> } | null>(null);
const CurrentDataContext = createContext<{ currentData: any, setCurrentData: Dispatcher<any> } | null>(null);
const ReloadContext = createContext<() => void>(() => {});
const ErrorsContext = createContext<{ errors: string[], setErrors: Dispatcher<string[]> } | null>(null);

export function EditableDataContextProvider({ children }: { children: ReactNode }) {
  const [ actionType, setActionType ] = useState<ActionTypes>("none");
  const [ selectedData, setSelectedData ] = useState<OpenableData>("products");
  const [ tableData, setTableData ] = useState<TableData | null>(null);
  const [ currentData, setCurrentData ] = useState<any | null>(null);
  const [ reloadData, setReloaddata ] = useState<boolean>(false);
  const [ errors, setErrors ] = useState<string[]>([]);

  const { load: loadData } = useEditableData();

  useEffect(() => {
    if (actionType == "none") {
      setCurrentData(null);
    }
  }, [actionType]);

  useEffect(() => {
    loadData(selectedData)
      .then((data) => {
        setTableData(data);
      })
      .catch((e) => {
        console.log(e);
      });
  }, [selectedData, reloadData]);

  return <SelectedDataContext.Provider value={{ selectedData, setSelectedData }}>
    <DataContext.Provider value={tableData}>
      <ActionContext.Provider value={{ actionType, setActionType }}>
        <CurrentDataContext.Provider value={{ currentData, setCurrentData }}>
        <ReloadContext.Provider value={() => setReloaddata(v => !v)}>
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