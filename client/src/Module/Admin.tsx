import Navbar from "../Components/Navbar";
import DataTable from "../Components/DataTable";
import { useEffect, useState } from "react";
import Sidebar, { SidebarButton } from "../Components/Sidebar";
import { IconBag, IconCart, IconMoneyWave, IconUser } from "../Utils/SVGIcons";
import Loading from "../Components/Loading";
import { EditableDataContextProvider, useEditableDataContext } from "../Context/EditableData";
import { MError } from "../Utils/Error";
import { Modal, ModalDelete, ModalEdit } from "../Components/Modal";
import FormError from "../Components/FormError";


export default function Admin() {
  return <EditableDataContextProvider>
    <Page />
  </EditableDataContextProvider>
}

function Page() {
  const [ isLoading, setIsLoading ] = useState(false);
  const {
    actionType,
    selectedData,
    tableData,
    errors
  } = useEditableDataContext();
  if (!actionType || !selectedData) throw new MError("Editable Data Context is null");

  const currentData = tableData;

  useEffect(() => {
    setIsLoading(true);
  }, [selectedData]);

  useEffect(() => {
    if (tableData != null)
        setIsLoading(false);
  }, [tableData, actionType])

  let mainContent = null;
  if (isLoading) {
    mainContent = <Loading>Loading Data</Loading>;
  }
  else if (currentData) {
    mainContent = <DataTable title={selectedData.selectedData} tableColumns={currentData.column} tableData={currentData.data} />
  }
  else {
    mainContent = <NoContent />
  }

  return <>
    <div className="mt-[var(--appbar-height)]"></div>
    <FormError errors={errors?.errors || []} />
    { mainContent }
    <Sidebar>
      <SidebarButton onClick={() => selectedData.setSelectedData("products")} className="[&>svg]:w-4 [&>svg]:h-4"><IconBag />Products</SidebarButton>
      <SidebarButton onClick={() => selectedData.setSelectedData("orders")} className="[&>svg]:w-4 [&>svg]:h-4"><IconCart />Orders</SidebarButton>
      <SidebarButton onClick={() => selectedData.setSelectedData("payments")} className="[&>svg]:w-4 [&>svg]:h-4"><IconMoneyWave />Payments</SidebarButton>
      <SidebarButton onClick={() => selectedData.setSelectedData("users")} className="[&>svg]:w-4 [&>svg]:h-4"><IconUser />Users</SidebarButton>
    </Sidebar>
    <Navbar admin />

    <Editor />
  </>;
}

function Editor() {
  const {
    actionType,
    currentData,
    selectedData,
  } = useEditableDataContext();

  if (!actionType || !selectedData || !currentData) return null;
  if (actionType.actionType === "none") return null

  // console.log("Editor", currentData.currentData);

  return <Modal onClick={() => actionType.setActionType("none")}>
    {actionType.actionType == "add" &&
      <ModalEdit closeModal={() => actionType.setActionType("none")} type={selectedData.selectedData} data={null} />
    }
    {actionType.actionType == "delete" &&
      <ModalDelete closeModal={() => actionType.setActionType("none")} type={selectedData.selectedData} data={currentData.currentData} />
    }
    {actionType.actionType == "edit" && <ModalEdit closeModal={() => actionType.setActionType("none")} type={selectedData.selectedData} data={currentData.currentData} />}
  </Modal>
}

function NoContent() {
  return <div className="h-[calc(100%-var(--appbar-height))] w-full flex items-center justify-center gap-2">
    <p className="text-lg text-primary-950 font-semibold fraunces-regular">No Content</p>
  </div>
}