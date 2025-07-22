import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { type OpenableData, type TableData } from "../Utils/DataBuilder";
import { useEditableData } from "../Hooks/useEditableData";

export type ActionTypes = "none" | "new" | "edit" | "delete";
type Dispatcher<T> = React.Dispatch<React.SetStateAction<T>>;

const SelectedDataContext = createContext<{ selectedData: OpenableData, setSelectedData: Dispatcher<OpenableData> } | null>(null);
const DataContext = createContext<TableData | null>(null);
const ActionContext = createContext<{ actionType: ActionTypes, setActionType: Dispatcher<ActionTypes> } | null>(null);

export function EditableDataContextProvider({ children }: { children: ReactNode }) {
  const [ actionType, setActionType ] = useState<ActionTypes>("none");
  const [ selectedData, setSelectedData ] = useState<OpenableData>("products");
  const { load: loadData } = useEditableData();
  const [ tableData, setTableData ] = useState<TableData | null>(null);

  useEffect(() => {
    loadData(selectedData)
      .then((tableData) => {
        setTableData(tableData);
      })
      .catch((e) => {
        console.log(e);
      });
  }, [selectedData]);

  return <SelectedDataContext.Provider value={{ selectedData, setSelectedData }}>
    <DataContext.Provider value={tableData}>
      <ActionContext.Provider value={{ actionType, setActionType }}>
        {children}
      </ActionContext.Provider>
    </DataContext.Provider>
  </SelectedDataContext.Provider>
}

export function useEditableDataContext() {
  return {
    selectedData: useContext(SelectedDataContext),
    tableData: useContext(DataContext),
    actionType: useContext(ActionContext)
  };
}