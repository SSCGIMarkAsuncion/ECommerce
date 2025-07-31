import Navbar from "../Components/Navbar";
import DataTable from "../Components/DataTable";
import { useCallback, useEffect, useState } from "react";
import Sidebar, { SidebarButton } from "../Components/Sidebar";
import { IconBag, IconCart, IconMoneyWave, IconUser } from "../Utils/SVGIcons";
import Loading from "../Components/Loading";
import { EditableDataContextProvider, useEditableDataContext } from "../Context/EditableData";
import { MError } from "../Utils/Error";
import { Modal, ModalDelete, ModalEdit } from "../Components/Modal";
import FormError from "../Components/FormError";
import { Theme } from "../Utils/Theme";
import SearchIcon from "../assets/Search.svg"
import Img from "../Components/Img";

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
    // errors
  } = useEditableDataContext();

  useEffect(() => {
    setIsLoading(true);
  }, [selectedData]);

  useEffect(() => {
    if (tableData != null)
        setIsLoading(false);
  }, [tableData, actionType])

  const currentData = tableData;
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
    {/* <div className="m-2">
      <FormError errors={errors?.errors || []} />
    </div> */}
    { mainContent }
    <Sidebar>
      <h1 className="text-white text-lg px-2">Data</h1>
      <SidebarButton onClick={() => selectedData.setSelectedData("products")} className="[&>svg]:size-4"><IconBag />Products</SidebarButton>
      <SidebarButton onClick={() => selectedData.setSelectedData("orders")} className="[&>svg]:size-4"><IconCart />Orders</SidebarButton>
      <SidebarButton onClick={() => selectedData.setSelectedData("payments")} className="[&>svg]:size-4"><IconMoneyWave />Payments</SidebarButton>
      <SidebarButton onClick={() => selectedData.setSelectedData("users")} className="[&>svg]:size-4"><IconUser />Users</SidebarButton>
    </Sidebar>
    <Navbar admin />

    <Editor />
  </>;
}

function Editor() {
  const {
    actionType,
    currentData,
    selectedData
  } = useEditableDataContext();
  const closeModal = useCallback(() => {
    actionType.setActionType("none")
    // errors.setErrors([]);
  }, []);

  if (!actionType || !selectedData || !currentData) return null;
  if (actionType.actionType === "none") return null

  return <Modal>
    {actionType.actionType == "add" &&
      <ModalEdit closeModal={closeModal} />
    }
    {actionType.actionType == "delete" &&
      <ModalDelete closeModal={closeModal} />
    }
    {actionType.actionType == "edit" && <ModalEdit closeModal={closeModal} />}
  </Modal>
}

function NoContent() {
  return <div
   className={`w-full bg-primary-200 border-primary-300 text-primary-600 *:fill-primary-600 border-1 p-8 text-xl text-center animate-appear flex flex-col gap-4 items-center justify-center fraunces-regular font-medium ${Theme.rounded}`}>
    <Img src={SearchIcon} className="size-20"/>
    <div>
      <p className="mt-2">No Data Found</p>
    </div>
  </div>
}