import Navbar, { UserMenu } from "../Components/Navbar";
import DataTable from "../Components/DataTable";
import { useCallback, useEffect, useState } from "react";
import Sidebar, { SidebarButton, SidebarOffset } from "../Components/Sidebar";
import { IconBag, IconCart, IconMoneyWave, IconUser } from "../Utils/SVGIcons";
import Loading from "../Components/Loading";
import { EditableDataContextProvider, useEditableDataContext } from "../Context/EditableData";
import { Modal, ModalDelete, ModalEdit } from "../Components/Modal";
import { Theme } from "../Utils/Theme";
import SearchIcon from "../assets/Search.svg"
import Img from "../Components/Img";
import { useUserContext } from "../Context/User";
import A from "../Components/A";

export default function Admin() {
  return <EditableDataContextProvider>
    <Page />
  </EditableDataContextProvider>
}

function Page() {
  const { user } = useUserContext();
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

  return <>
    {/* <div className="h-[var(--appbar-height)]"></div> */}
    <div className="block md:flex">
      <SidebarOffset className="hidden md:block" />
      {
       (() => {
        if (isLoading) {
          return <Loading>Loading Data</Loading>;
        }
        else if (currentData && currentData.data.length > 0) {
          return <DataTable containerClass="flex-1" title={selectedData.selectedData} tableColumns={currentData.column} tableData={currentData.data} />
        }
        return <NoContent />
       })()
      }
    </div>
    <Sidebar className="text-sm flex flex-col fraunces-regular">
      <UserMenu className="w-full" />
      <div className="py-4">
        <A href="/" className="block mb-8"><Img src="/Logo_2.svg" className="size-18 mx-auto" /></A>
        <h1 className="text-white text-lg px-2">Manage</h1>
        <SidebarButton onClick={() => selectedData.setSelectedData("products")} className="[&>svg]:size-4"><IconBag />Products</SidebarButton>
        <SidebarButton onClick={() => selectedData.setSelectedData("orders")} className="[&>svg]:size-4"><IconCart />Orders</SidebarButton>
        <SidebarButton onClick={() => selectedData.setSelectedData("payments")} className="[&>svg]:size-4"><IconMoneyWave />Payments</SidebarButton>
        <SidebarButton onClick={() => selectedData.setSelectedData("users")} className="[&>svg]:size-4"><IconUser />Users</SidebarButton>
      </div>
      <div className="mt-auto">
        <div className={`bg-primary-900 h-[2px]`} />
        {/* <p className="capitalize text-lg my-2 px-1">{user!.role}</p> */}
        <div className="w-max mx-auto">
        </div>
      </div>
    </Sidebar>
    {/* <Navbar admin type="admin" /> */}

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
   className={`flex-1 bg-primary-200 border-primary-300 text-primary-600 *:fill-primary-600 border-1 p-8 text-xl text-center animate-appear flex flex-col gap-4 items-center justify-center fraunces-regular font-medium ${Theme.rounded} m-8`}>
    <Img src={SearchIcon} className="size-20"/>
    <div>
      <p className="mt-2">No Data Found</p>
    </div>
  </div>
}