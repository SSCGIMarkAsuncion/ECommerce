import { useEffect, useState, type HTMLAttributes } from "react";
import { Product } from "../Models/Product";
import Button from "./Button";
import useProducts from "../Hooks/useProducts";
import { MError } from "../Utils/Error";
import { useEditableDataContext } from "../Context/EditableData";
import { useNotification } from "../Context/Notify";
import { EditProduct, EditUser } from "./Edit";
import useUsers from "../Hooks/useUser";
import User from "../Models/User";

export interface ModalProps extends HTMLAttributes<HTMLDivElement> {
  open?: boolean
};

export function Modal(props: ModalProps) {
  return <div 
   className="overflow-y-auto fixed top-0 left-0 w-full h-full bg-black/25 backdrop-blur-xs p-6">
    <div className="mt-[var(--appbar-height)]"></div>
    {props.children}
  </div>;
}

export interface ModalEditProps {
  closeModal: () => void
};

export function ModalEdit({ closeModal }: ModalEditProps) {
  const { 
    selectedData: { selectedData: type },
    currentData: { currentData: data }
  } = useEditableDataContext();

  let editComponent = null;
  let label = "";
  switch (type) {
    case "products":
      editComponent = <EditProduct closeModal={closeModal} data={data as Product || Product.empty()} />
      label = "Product";
      break;
    case "users":
      editComponent = <EditUser closeModal={closeModal} data={data as User || User.empty()} />
      label = "User";
      break;
    case "orders":
      label = "Order";
      break;
    case "payments":
      label = "Payment";
      break;
  };

  useEffect(() => {
    function close(e: KeyboardEvent) {
      if (e.key == "Escape") {
        closeModal();
      }
    }

    window.addEventListener("keydown", close)
    return () => {
      window.removeEventListener("keydown", close);
      // console.log("keydown removed");
    }
  }, [])

  return <div onClick={(e) => e.stopPropagation()} className="overflow-y-auto w-[80%] md:w-[90%] m-auto rounded-xs bg-white p-4 animate-slide-down">
    <div className="overflow-y-auto">
      <h1 className="fraunces-regular text-4xl font-semibold text-primary-900">{label}</h1>
      {editComponent}
    </div>
  </div>;
}

export function ModalDelete({ closeModal }: ModalEditProps) {
  const { 
    selectedData: { selectedData: type },
    currentData: { currentData: data }
  } = useEditableDataContext();
  const {
    reload,
    // errors
  } = useEditableDataContext();
  const [ loading, setLoading ] = useState(false);
  const notify = useNotification();

  const { removeProduct } = useProducts();
  const { deleteUser } = useUsers();


  let deleteFn = null;
  let successMsg = "";
  switch (type) {
    case "products":
      deleteFn = removeProduct;
      successMsg = `Product ${data.id}`
      break;
    case "users":
      deleteFn = deleteUser;
      successMsg = `User ${data.id}`
      break;
    case "promos":
    case "orders":
    case "payments":
      notify("warn", `delete on ${type} not implemented`);
      break;
  };

  const onDelete = async () => {
    setLoading(true);
    try {
      if (deleteFn)
        await deleteFn(data);
      notify("info", `successfully deleted ${successMsg}`);
    }
    catch (e) {
      notify("error", (e as MError).toErrorList().join('\n'));
    }
    reload();
    closeModal();
  };

  useEffect(() => {
    function close(e: KeyboardEvent) {
      if (e.key == "Escape") {
        closeModal();
      }
    }

    window.addEventListener("keydown", close)
    return () => {
      window.removeEventListener("keydown", close);
      console.log("keydown removed");
    }
  }, [])

  return <div onClick={(e) => e.stopPropagation()} className="w-max m-auto rounded-xs bg-white p-4 animate-slide-down">
    <h1 className="text-lg fraunces-regular">Are you sure you want to delete?</h1>
    <div className="flex gap-1 text-xs mt-2">
      <Button className="ml-auto" loading={loading} onClick={closeModal} pColor="whitePrimary">Cancel</Button>
      <Button loading={loading} pColor="red" onClick={() => {
        onDelete();
      }}>Delete</Button>
    </div>
  </div>;
}
