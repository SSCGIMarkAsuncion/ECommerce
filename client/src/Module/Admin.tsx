import useAuth from "../Hooks/useAuth";
import Navbar from "../Components/Navbar";
import DataTable from "../Components/DataTable";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import Sidebar, { SidebarButton } from "../Components/Sidebar";
import { IconBag, IconCart, IconMoneyWave, IconUser } from "../Utils/SVGIcons";
import { type TableData, type OpenableData, MODIFY_DATA_EVENT_NAME, type ModifyDataDetail, MODIFY_DATA_ACTION_EDIT, MODIFY_DATA_ACTION_DELETE, MODIFY_DATA_ACTION_ADD } from "../Utils/DataBuilder";
import { useEditableData } from "../Hooks/useEditableData";
import { Modal, ModalDelete, ModalEdit } from "../Components/Modal";
import Loading from "../Components/Loading";
import { EditableDataContextProvider, useEditableDataContext } from "../Context/EditableData";
import { MError } from "../Utils/Error";


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
    tableData
  } = useEditableDataContext();
  if (!actionType || !selectedData) throw new MError("Editable Data Context is null");

  const currentData = tableData;

  const navigate = useNavigate();
  useAuth().verifyAndSetUser(() => {
    navigate("/");
  }, false); // WARN: temp disable guard

  useEffect(() => {
    setIsLoading(true);
  }, [selectedData]);

  useEffect(() => {
    if (tableData != null)
        setIsLoading(false);
  }, [tableData])

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
    { mainContent }
    <Sidebar>
      <SidebarButton onClick={() => selectedData.setSelectedData("products")} className="[&>svg]:w-4 [&>svg]:h-4"><IconBag />Products</SidebarButton>
      <SidebarButton onClick={() => selectedData.setSelectedData("orders")} className="[&>svg]:w-4 [&>svg]:h-4"><IconCart />Orders</SidebarButton>
      <SidebarButton onClick={() => selectedData.setSelectedData("payments")} className="[&>svg]:w-4 [&>svg]:h-4"><IconMoneyWave />Payments</SidebarButton>
      <SidebarButton onClick={() => selectedData.setSelectedData("users")} className="[&>svg]:w-4 [&>svg]:h-4"><IconUser />Users</SidebarButton>
    </Sidebar>
    <Navbar admin />

    {/* { editData &&
      <Modal onClick={() => setEditData(null)}>
        { editData.action == MODIFY_DATA_ACTION_ADD &&
          <ModalEdit closeModal={() => setEditData(null)} type={selectedData.selectedData} data={null} /> 
        }
        { editData.action == MODIFY_DATA_ACTION_DELETE &&
          <ModalDelete closeModal={() => setEditData(null)} type={editData.dataType} data={editData.data} />
        }
        { editData.action == MODIFY_DATA_ACTION_EDIT && <ModalEdit closeModal={() => setEditData(null)} type={editData.dataType} data={editData.data} /> }
      </Modal>
    } */}
  </>;
}

function NoContent() {
  return <div className="h-[calc(100%-var(--appbar-height))] w-full flex items-center justify-center gap-2">
    <p className="text-lg text-primary-950 font-semibold fraunces-regular">No Content</p>
  </div>
}