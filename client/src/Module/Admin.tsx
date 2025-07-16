import useAuth from "../Hooks/useAuth";
import Navbar from "../Components/Navbar";
import { createColumnHelper } from "@tanstack/react-table";
import DataTable from "../Components/DataTable";
import { useNavigate } from "react-router";
import { useState } from "react";
import Sidebar from "../Components/Sidebar";

type User = {
  id: number;
  name: string;
  email: string;
};

const defaultData: User[] = [
  { id: 1, name: 'Alice', email: 'alice@email.com' },
  { id: 2, name: 'Bob', email: 'bob@email.com' },
  { id: 3, name: 'Charlie', email: 'charlie@email.com' },
  { id: 4, name: 'Alice', email: 'alice@email.com' },
  { id: 5, name: 'Bob', email: 'bob@email.com' },
  { id: 6, name: 'Charlie', email: 'charlie@email.com' },
];

const columnHelper = createColumnHelper<User>();

const columns = [
  columnHelper.accessor('id', {
    header: 'ID',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('name', {
    header: 'Name',
    cell: info => info.getValue(),
    enableColumnFilter: true,
  }),
  columnHelper.accessor('email', {
    header: 'Email',
    cell: info => info.getValue(),
    enableColumnFilter: true,
  }),
];

type OpenableData = "products" | "promos" | "orders" | "users" | "payments";

export default function Admin() {
  const [ openedData, setOpenedData ] = useState<OpenableData>("products");
  const navigate = useNavigate();
  useAuth().verifyAndSetUser(() => {
    navigate("/");
  });

  return <>
    <div className="mt-[var(--appbar-height)]"></div>
    <DataTable tableColumns={columns} tableData={defaultData} />
    <Sidebar />
    <Navbar admin />
    {/* <TanStackTableExample /> */}
  </>;
}