import { useCallback, useEffect, useState, type HTMLAttributes } from "react";
import type { OpenableData } from "../Utils/DataBuilder";
import { Product } from "../Models/Product";
import Button from "./Button";
import Input, { TextArea } from "./Input";
import { EditorTags } from "./EditorTags";
import useProducts from "../Hooks/useProducts";
import { ImageEditor } from "./ImageEditor";
import { MError } from "../Utils/Error";
import FormError from "./FormError";
import { useEditableDataContext } from "../Context/EditableData";
import { useNotification } from "../Context/Notify";
import { EditProduct } from "./Edit";

export interface ModalProps extends HTMLAttributes<HTMLDivElement> {
  open?: boolean
};

export function Modal(props: ModalProps) {
  return <div 
   // onClick={props.onClick}
   className="overflow-y-auto fixed top-0 left-0 w-full h-full bg-black/25 backdrop-blur-xs p-6">
    <div className="mt-[var(--appbar-height)]"></div>
    {props.children}
  </div>;
}

export interface ModalEditProps {
  type: OpenableData,
  data: any | null,
  closeModal: () => void
};

export function ModalEdit({ type, data, closeModal }: ModalEditProps) {
  let editComponent = null;
  let label = "";
  switch (type) {
    case "products":
      editComponent = <EditProduct closeModal={closeModal} data={data as Product || Product.empty()} />
      label = "Product";
      break;
    case "orders":
      label = "Order";
      break;
    case "users":
      label = "User";
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
      <h1 className="fraunces-regular text-4xl font-semibold text-primary-950">{label}</h1>
      {editComponent}
    </div>
  </div>;
}

export function ModalDelete({ type, data, closeModal }: ModalEditProps) {
  const { reload, errors } = useEditableDataContext();
  const [ loading, setLoading ] = useState(false);
  const { removeProduct } = useProducts();
  let deleteFn = null;
  switch (type) {
    case "products":
      deleteFn = removeProduct;
      break;
    case "promos":
    case "orders":
    case "users":
    case "payments":
  };

  const onDelete = async () => {
    setLoading(true);
    try {
      if (deleteFn)
        deleteFn(data);
    }
    catch (e) {
      errors?.setErrors((e as MError).toErrorList());
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
