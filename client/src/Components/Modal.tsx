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

export interface ModalProps extends HTMLAttributes<HTMLDivElement> {
  open?: boolean
};

export function Modal(props: ModalProps) {
  return <div onClick={props.onClick} className="overflow-y-auto fixed top-0 left-0 w-full h-full bg-black/25 backdrop-blur-xs p-6">
    <div className="mt-[var(--appbar-height)]"></div>
    {props.children}
  </div>;
}

export interface ModalEditProps {
  type: OpenableData,
  data: any | null,
  closeModal: () => void
};

function toDateTimeLocalString(date: Date | null) {
  if (!date) {
    return undefined;
  }
  return date.toISOString().slice(0,16);
}

export function ModalEdit({ type, data, closeModal }: ModalEditProps) {
  let editComponent = null;
  switch (type) {
    case "products":
      editComponent = <EditProduct closeModal={closeModal} data={data as Product || Product.empty()} />
      break;
    case "orders":
    case "users":
    case "payments":
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
    {editComponent}
  </div>;
}
export interface EditProductProps {
  data: Product,
  closeModal: () => void
};

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

function EditProduct(props: EditProductProps) {
  const { updateProduct, newProduct } = useProducts();
  const { reload } = useEditableDataContext();
  const [ loading, setLoading ] = useState(false);
  const [ currData, setCurrData ] = useState({ ...props.data });
  const [ err, setErr ] = useState<string[]>([]);
  const notify = useNotification();

  const onSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (err.length > 0) return;
    setLoading(true);

    const form = e.currentTarget as HTMLFormElement;
    const fdata = new FormData(form);
    const product = Product.from(fdata, currData.tags, currData.imgs);

    try {
      if (product.id)
        await updateProduct(product)
      else
        await newProduct(product)
    }
    catch (e) {
      const merrs = (e as MError).toErrorList();
      setErr(merrs);
      props.closeModal();
      return;
    }

    setLoading(false);
    props.closeModal();
    reload();
  }, [currData]);

  const onChangeTags = useCallback((tags: string[]) => {
    // console.log(currData.tags, tags);
    setCurrData((v) => {
      return {
        ...v,
        tags
      };
    });
  }, []);

  const onChangeImgs = useCallback((imgs: string[]) => {
    // console.log(currData.imgs, imgs);
    setCurrData((v) => {
      return {
        ...v,
        imgs: imgs
      };
    });
  }, []);

  return <div className="overflow-y-auto">
  <h1 className="fraunces-regular text-4xl font-semibold text-primary-950">Product</h1>
  <form className="mt-4" onSubmit={onSubmit}>
    <FormError errors={err} />
    <Input id="id" type="text" label="Id" className="text-sm" readOnly value={currData.id} />
    <div className="*:flex-1 flex gap-1">
      <Input type="datetime-local" label="Created At" className="text-sm" readOnly value={toDateTimeLocalString(currData.createdAt)} />
      <Input type="datetime-local" label="Updated At" className="text-sm" readOnly value={toDateTimeLocalString(currData.updatedAt)} />
    </div>
    <Input id="name" type="text" required label="Name" className="text-sm" defaultValue={currData.name} />
    <TextArea label="Description" id="description" className="text-sm" defaultValue={currData.description} />
    <div className="*:flex-1 flex gap-1">
      <Input id="price" type="number" required label="Price" className="text-sm" defaultValue={currData.price} />
      <Input id="salePrice" type="number" required label="Sale Price (0 for no price reduction)" className="text-sm" defaultValue={currData.salePrice || 0} />
    </div>
    <EditorTags tags={currData.tags} onChangeTags={onChangeTags} />
    <ImageEditor imgs={currData.imgs} onChangeImgs={onChangeImgs} onProcessing={() => {
      setLoading(true);
      notify("info", "Image uploading");
    }} onProcessingDone={() => {
      setLoading(false);
      notify("info", "Image uploaded");
    }}
      onErr={(e) => {
        const errs = e.toErrorList();
        if (errs.length > 0) {
          setErr(errs);
        }
      }}
      />
    <div className="flex gap-1 text-xs mt-2">
      <Button className="ml-auto" loading={loading} onClick={props.closeModal} pColor="whitePrimary">Cancel</Button>
      <Button loading={loading} type="submit" pColor="green">Ok</Button>
    </div>
  </form>
  {/* <p>{JSON.stringify(data, null, 2)}</p> */}
  </div>
}