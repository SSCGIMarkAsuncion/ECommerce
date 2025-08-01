import { useCallback, useEffect, useState } from "react";
import { Product } from "../Models/Product";
import { useNotification } from "../Context/Notify";
import { useEditableDataContext } from "../Context/EditableData";
import useProducts from "../Hooks/useProducts";
import { toDateTimeLocalString } from "../Utils/DataBuilder";
import Input, { InputPassword, TextArea } from "./Input";
import FormError from "./FormError";
import { EditorTags } from "./EditorTags";
import { ImageEditor } from "./ImageEditor";
import Button from "./Button";
import type { MError } from "../Utils/Error";
import User from "../Models/User";
import useUsers from "../Hooks/useUser";
import { checkPassword } from "../Utils/FormValidators";
import Select from "./Select";

interface EditConfirmButtonsProps {
  loading: boolean,
  onCancel: () => void,
};

function EditConfirmButtons(props: EditConfirmButtonsProps) {
  return <div className="flex gap-1 text-xs mt-2">
    <Button className="ml-auto" loading={props.loading} onClick={props.onCancel} pColor="whitePrimary">Cancel</Button>
    <Button loading={props.loading} type="submit" pColor="green">Ok</Button>
  </div>
}

export interface EditProps<T> {
  data: T,
  closeModal: () => void
};

export function EditProduct(props: EditProps<Product>) {
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
      if (product.id) {
        await updateProduct(product)
        notify("info", `Successfully edited product ${product.id}`);
      }
      else {
        await newProduct(product);
        notify("info", `Successfully created a new product`);
      }
      props.closeModal();
    }
    catch (e) {
      const merrs = (e as MError).toErrorList();
      setLoading(false);
      setErr(merrs);
      return;
    }

    setLoading(false);
    reload();
  }, [currData]);

  const onChangeTags = useCallback((tags: string[]) => {
    setCurrData((v) => {
      return {
        ...v,
        tags
      };
    });
  }, []);

  const onChangeImgs = useCallback((imgs: string[]) => {
    setCurrData((v) => {
      return {
        ...v,
        imgs: imgs
      };
    });
  }, []);

  return <>
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
        <Input id="discount" type="number" required label="Discount%" min={0} max={100} step={0.5} className="text-sm" defaultValue={currData.discount || 0} />
      </div>

      <EditorTags tags={currData.tags} onChangeTags={onChangeTags} />

      <ImageEditor
        imgs={currData.imgs}
        onChangeImgs={onChangeImgs}
        onProcessing={() => {
          setLoading(true);
          notify("info", "Image uploading");
        }}
        onProcessingDone={() => {
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

      <EditConfirmButtons loading={loading} onCancel={props.closeModal} />
    </form>
  </>
}

export function EditUser(props: EditProps<User>) {
  const { updateUser, createUser } = useUsers();
  const { reload } = useEditableDataContext();
  const [ loading, setLoading ] = useState(false);
  const [ currData, _setCurrData ] = useState({ ...props.data });
  const [ err, setErr ] = useState<string[]>([]);
  const notify = useNotification();

  const onSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (err.length > 0) return;
    setLoading(true);

    const form = e.currentTarget as HTMLFormElement;
    const fdata = new FormData(form);
    const user = User.from(fdata);

    try {
      if (user.id) {
        await updateUser(user)
        notify("info", `Successfully edited user ${user.id}`);
      }
      else {
        await createUser(user);
        notify("info", `Successfully created a new user`);
      }
      props.closeModal();
    }
    catch (e) {
      const merrs = (e as MError).toErrorList();
      setLoading(false);
      setErr(merrs);
      return;
    }

    setLoading(false);
    reload();
  }, [currData]);

  return <>
    <form className="mt-4" onSubmit={onSubmit}>
      <FormError errors={err} />

      <Input id="id" type="text" label="Id" className="text-sm" readOnly value={currData.id} />
      <div className="*:flex-1 flex gap-1">
        <Input type="datetime-local" label="Created At" className="text-sm" readOnly value={toDateTimeLocalString(currData.createdAt)} />
        <Input type="datetime-local" label="Updated At" className="text-sm" readOnly value={toDateTimeLocalString(currData.updatedAt)} />
      </div>

      <div className="*:flex-1 flex gap-1">
        <Input id="username" type="text" required label="Username" className="text-sm" defaultValue={currData.username} />
        <Input id="email" type="text" required label="Email" className="text-sm" defaultValue={currData.email} />
      </div>

      <div className="*:flex-1 flex gap-1">
        <InputPassword id="password" label="Password" className="text-sm" defaultValue={""} validators={[checkPassword]}  />
        <Select id="role" label="Role:" defaultValue={currData.role || "user"}>
          <option value="user">User</option>
          <option value="admin">Admin</option>
          <option value="superadmin">Superadmin</option>
        </Select>
        {/* <Input id="discount" type="number" required label="Discount%" min={0} max={100} step={0.5} className="text-sm" defaultValue={currData.discount || 0} /> */}
      </div>

      <EditConfirmButtons loading={loading} onCancel={props.closeModal} />
    </form>
  </>
}