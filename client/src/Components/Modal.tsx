import { useCallback, useState, type HTMLAttributes } from "react";
import type { OpenableData } from "../Utils/DataBuilder";
import type { Product } from "../Models/Product";
import Button from "./Button";
import Input, { TextArea } from "./Input";

export interface ModalProps extends HTMLAttributes<HTMLDivElement> {
  open?: boolean
};

export function Modal(props: ModalProps) {
  return <div onClick={props.onClick} hidden={!props.open} className="fixed top-0 left-0 w-full h-full bg-black/25 backdrop-blur-xs p-6">
    {props.children}
  </div>;
}

export interface ModalEditProps {
  type: OpenableData,
  data: any,
  closeModal: () => void
};

export function ModalEdit({ type, data, closeModal }: ModalEditProps) {
  let editComponent = null;
  switch (type) {
    case "products":
      editComponent = <EditProduct closeModal={closeModal} data={data as Product} />
      break;
    case "promos":
    case "orders":
    case "users":
    case "payments":
  };

  return <div onClick={(e) => e.stopPropagation()} className="w-[80%] md:w-[90%] m-auto rounded-xs bg-white p-4 animate-slide-down">
    {editComponent}
  </div>;
}
export interface EditProductProps {
  data: Product,
  closeModal: () => void
};

function EditProduct(props: EditProductProps) {
  const [ loading, setLoading ] = useState(false);
  const [ currData, setCurrData ] = useState({ ...props.data });

  const onSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const fdata = new FormData(form);
    console.log(fdata);
  }, []);

  return <>
  <h1 className="fraunces-regular text-4xl font-semibold text-primary-950">Product</h1>
  <form className="mt-4" onSubmit={onSubmit}>
  <Input id="id" type="text" label="Id" className="text-sm" readOnly value={currData.id} />
  <Input id="name" type="text" required label="Name" className="text-sm" defaultValue={currData.name} />
  <TextArea label="Description" id="description" className="text-sm" defaultValue={currData.description} />
  <div className="*:flex-1 flex gap-1">
    <Input id="price" type="number" required label="Price" className="text-sm" defaultValue={currData.price} />
    <Input id="salePrice" type="number" required label="Sale Price (0 for no price reduction)" className="text-sm" defaultValue={currData.salePrice || 0} />
  </div>
  <div className="flex gap-1 text-xs mt-2">
    <Button className="ml-auto" loading={loading} onClick={props.closeModal} pColor="whitePrimary">Cancel</Button>
    <Button loading={loading} type="submit" pColor="green">Ok</Button>
  </div>
  </form>
  {/* <p>{JSON.stringify(data, null, 2)}</p> */}
  </>
}