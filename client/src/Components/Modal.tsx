import { useEffect, useRef, useState, type HTMLAttributes } from "react";
import { Product, PRODUCT_EDIT_INPUTS } from "../Models/Product";
import Button from "./Button";
import useProducts from "../Hooks/useProducts";
import { MError } from "../Utils/Error";
import { EditFormProvider, useEditableDataContext } from "../Context/EditableData";
import { useNotification } from "../Context/Notify";
import { Editor } from "./Edit";
import useUsers from "../Hooks/useUser";
import User, { USERS_EDIT_INPUTS } from "../Models/User";
import useImageMedia from "../Hooks/useImageMedia";
import Order, { ORDERS_EDIT_INPUTS } from "../Models/Order";
import useOrders from "../Hooks/useOrders";
import useCart from "../Hooks/useCart";
import Cart, { CART_EDIT_INPUTS } from "../Models/Cart";

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

export function ModalEdit({ closeModal: cmodal }: ModalEditProps) {
  const { 
    selectedData: { selectedData: type },
    currentData: { currentData: data }, reload
  } = useEditableDataContext();
  const { updateProduct, newProduct, cancelUpdate } = useProducts();
  const { updateUser, createUser } = useUsers();
  const { deleteImg } = useImageMedia();
  const notify = useNotification();

  const closeTrigger = useRef(() => {});

  const [ loading, setLoading ] = useState(false);

  useEffect(() => {
    closeTrigger.current = async () => {
      if (loading) return;
      cmodal();
    };
  }, [loading]);

  useEffect(() => {
    function close(e: KeyboardEvent) {
      if (e.key == "Escape") {
        closeTrigger.current();
      }
    }

    window.addEventListener("keydown", close)
    return () => {
      window.removeEventListener("keydown", close);
    }
  }, [])

  let editComponent = null;
  let label = "";
  let submitters = {
    update: null,
    add: null
  } as any;
  const ploading={loading, setLoading}

  switch (type) {
    case "products":
      label = "Product";
      submitters.update = async (data: any) => {
        await updateProduct(new Product({ _id: data.id, ...data }));
      }
      submitters.add = async (data: any) => {
        await newProduct(new Product({ _id: data.id, ...data }));
      }
      editComponent = <Editor inputDefs={PRODUCT_EDIT_INPUTS}
        close={(d) => {
          cancelUpdate(new Product({ _id: d?.current.id, ...d?.current }))
            // .then(_ => notify("info", "Successfully deleted extra images"))
            .catch(e => {
              notify("error", e);
            });
          cmodal();
        }}
        loading={ploading}
        submitter={submitters}
        onSuccessMsg={data => `Product ${data.id || ""}`}
        onSuccess={reload}
         />;
      break;
    case "users":
      // editComponent = <EditUser loading={ploading} closeModal={cmodal} data={data as User || User.empty()} />
      label = "User";
      submitters.update = async (data: any) => {
        await updateUser(new User({ _id: data.id, ...data }));
      }
      submitters.add = async (data: any) => {
        await createUser(new User({ _id: data.id, ...data }));
      }
      editComponent = <Editor inputDefs={USERS_EDIT_INPUTS}
        close={cmodal}
        loading={ploading}
        submitter={submitters}
        onSuccessMsg={data => `User ${data.id || ""}`}
        onSuccess={reload}
         />;
      break;
    case "orders":
      label = "Order";
      submitters.update = async (data: any) => {
        notify("warn", `UPDATE NOT IMPLEMENTED YET`)
        console.log(new Order({ _id: data.id, data }));
      }
      submitters.add = async (data: any) => {
        notify("warn", `ADD NOT IMPLEMENTED YET`)
        console.log(new Order({ _id: data.id, data }));
      }
      editComponent = <Editor inputDefs={ORDERS_EDIT_INPUTS}
        close={cmodal}
        loading={ploading}
        submitter={submitters}
        onSuccessMsg={data => `Order ${data.id || ""}`}
        onSuccess={reload}
         />;
      break;
    case "carts":
      label = "Carts";
      submitters.update = async (data: any) => {
        notify("warn", `UPDATE NOT IMPLEMENTED YET`)
        console.log(new Cart({ _id: data.id, data }));
      }
      submitters.add = async (data: any) => {
        notify("warn", `ADD NOT IMPLEMENTED YET`)
        console.log(new Cart({ _id: data.id, data }));
      }
      editComponent = <Editor inputDefs={CART_EDIT_INPUTS}
        close={cmodal}
        loading={ploading}
        submitter={submitters}
        onSuccessMsg={data => `Cart ${data.id || ""}`}
        onSuccess={reload}
         />;
      break;
  };

  return <div onClick={(e) => e.stopPropagation()} className="overflow-y-auto w-[80%] md:w-[90%] m-auto rounded-xs bg-white p-4 animate-slide-down">
    <div className="overflow-y-auto">
      <h1 className="text-4xl font-semibold text-primary-900">{label}</h1>
      <EditFormProvider data={data? {...data}:{}}>
        {editComponent}
      </EditFormProvider>
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
  const { deleteOrder } = useOrders();
  const { deleteCart } = useCart();

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
    case "orders":
      deleteFn = deleteOrder;
      successMsg = `Order ${data.id}`
      break;
    case "carts":
      deleteFn = deleteCart;
      break;
    default:
      deleteFn = null;
      notify("error", `Unknown Type ${type} cannot delete`);
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
      notify("error", (e as MError));
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