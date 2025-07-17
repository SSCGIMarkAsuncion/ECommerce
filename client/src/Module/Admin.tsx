import useAuth from "../Hooks/useAuth";
import Navbar from "../Components/Navbar";
import DataTable from "../Components/DataTable";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import Sidebar, { SidebarButton } from "../Components/Sidebar";
import { IconBag, IconCart, IconMoneyWave, IconPercent, IconSpinner, IconUser } from "../Utils/SVGIcons";
import { type TableData, type OpenableData, MODIFY_DATA_EVENT_NAME, type ModifyDataDetail } from "../Utils/DataBuilder";
import { useEditableData } from "../Hooks/useEditableData";
import { Modal, ModalEdit } from "../Components/Modal";


export default function Admin() {
  const [ selectedData, setSelectedData ] = useState<OpenableData>("products");
  const [ isLoading, setIsLoading ] = useState(false);
  const [ currentData, setCurrentData ] = useState<TableData | null>(null);
  const [ editData, setEditData ] = useState<ModifyDataDetail | null>(null);
  const { load: loadData } = useEditableData();
  const navigate = useNavigate();
  useAuth().verifyAndSetUser(() => {
    navigate("/");
  });

  useEffect(() => {
    function onModify(e: CustomEvent<ModifyDataDetail>) {
      console.log("onModify", e.detail);
      setEditData(e.detail);
    }

    // @ts-ignore
    window.addEventListener(MODIFY_DATA_EVENT_NAME, onModify);

    return () => {
      // @ts-ignore
      window.removeEventListener(MODIFY_DATA_EVENT_NAME, onModify);
    }
  }, []);

  useEffect(() => {
    setIsLoading(true);

    loadData(selectedData)
      .then((tableData) => {
        setCurrentData(tableData);
        setIsLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setIsLoading(false);
      });

  }, [selectedData]);

  let mainContent = null;
  if (isLoading) {
    mainContent = <LoadingData />;
  }
  else if (currentData) {
    mainContent = <DataTable title={selectedData} tableColumns={currentData.column} tableData={currentData.data} />
  }
  else {
    mainContent = <NoContent />
  }

  return <>
    <div className="mt-[var(--appbar-height)]"></div>
    { mainContent }
    <Sidebar>
      <SidebarButton onClick={() => setSelectedData("products")} className="[&>svg]:w-4 [&>svg]:h-4"><IconBag />Products</SidebarButton>
      <SidebarButton onClick={() => setSelectedData("promos")} className="[&>svg]:w-4 [&>svg]:h-4"><IconPercent />Promos</SidebarButton>
      <SidebarButton onClick={() => setSelectedData("orders")} className="[&>svg]:w-4 [&>svg]:h-4"><IconCart />Orders</SidebarButton>
      <SidebarButton onClick={() => setSelectedData("payments")} className="[&>svg]:w-4 [&>svg]:h-4"><IconMoneyWave />Payments</SidebarButton>
      <SidebarButton onClick={() => setSelectedData("users")} className="[&>svg]:w-4 [&>svg]:h-4"><IconUser />Users</SidebarButton>
    </Sidebar>
    <Navbar admin />

    <Modal open={Boolean(editData)} onClick={() => setEditData(null)}>
      { editData && <ModalEdit closeModal={() => setEditData(null)} type={editData.dataType} data={editData.data} /> }
    </Modal>

  </>;
}

function LoadingData() {
  return <div className="h-[calc(100%-var(--appbar-height))] w-full flex items-center justify-center gap-2">
    <span>Loading data</span> <IconSpinner className="w-8 h-8 fill-primary-950" />
  </div>
}

function NoContent() {
  return <div className="h-[calc(100%-var(--appbar-height))] w-full flex items-center justify-center gap-2">
    <p className="text-lg text-primary-950 font-semibold fraunces-regular">No Content</p>
  </div>
}