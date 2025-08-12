import { useCallback, useContext, useState } from "react";
import { useNotification } from "../Context/Notify";
import { EditFormContext, type EditInputFormDef, type InputDefs } from "../Context/EditableData";
import Input, { InputPassword, TextArea } from "./Input";
import FormError from "./FormError";
import { EditorTags } from "./EditorTags";
import { ImageEditor } from "./ImageEditor";
import Button from "./Button";
import type { MError } from "../Utils/Error";
import Select from "./Select";

interface EditConfirmButtonsProps {
  loading: boolean,
  onCancel: () => void,
};

export function EditConfirmButtons(props: EditConfirmButtonsProps) {
  return <div className="flex gap-1 text-xs mt-2">
    <Button className="ml-auto" loading={props.loading} onClick={props.onCancel} pColor="whitePrimary">Cancel</Button>
    <Button loading={props.loading} type="submit" pColor="green">Ok</Button>
  </div>
}

export interface EditorProps<T> {
  inputDefs: InputDefs<T>,
  close: (rdata?: React.RefObject<T>) => void,
  loading: {
    loading: boolean,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
  },
  submitter: {
    update: (data: T) => Promise<void>,
    add: (data: T) => Promise<void>
  },
  onSuccess: () => void,
  onSuccessMsg: (data: T) => string
};

export function Editor<T>({ inputDefs, loading, close, submitter, onSuccessMsg, onSuccess }: EditorProps<T>) {
  const rdata = useContext(EditFormContext);
  const [ err, setErr ] = useState<string[]>([]);
  const notify = useNotification();

  console.assert(rdata.current != null);

  function handleRenderOfInputDef(inputDef: EditInputFormDef<T>) {
    const opts = {
      id: inputDef.id,
      label: inputDef.label,
      name: inputDef.name,
      placeholder: inputDef.placeholder,
      readOnly: inputDef.readOnly,
    } as any;

    const defValue = (inputDef.defaultValue)? inputDef.defaultValue(rdata):rdata.current[inputDef.id] || "";
    // only add the key because html marks it as required as long as key exist
    if (inputDef.required) opts.required = true

    const onChange = useCallback((e: React.FormEvent<HTMLInputElement>) => {
      if (inputDef.onChange)
        inputDef.onChange(rdata, e.currentTarget.value);
      else
        rdata.current[inputDef.id] = e.currentTarget.value;
    }, []);

    switch (inputDef.inputType) {
      case "email":
      case "text":
        return <Input key={inputDef.id} {...opts} type={inputDef.inputType} defaultValue={defValue} onChange={onChange} />;
      case "datetime-local":
        return <Input key={inputDef.id} type="datetime-local" {...opts} defaultValue={defValue} onChange={onChange} />;
      case "textarea":
        return <TextArea key={inputDef.id} {...opts} defaultValue={defValue} onChange={onChange} />
      case "number":
        return <Input key={inputDef.id} {...opts} type="number" defaultValue={defValue} onChange={onChange} />
      case "tags":
        return <EditorTags key={inputDef.id} tags={rdata.current.tags || []} onChangeTags={(tags) => {
          if (inputDef.onChange)
            inputDef.onChange(rdata, tags);
          else
            rdata.current[inputDef.id] = tags;
        }} />
      case "images":
        return <ImageEditor
          key={inputDef.id} 
          imgs={rdata.current.imgs || []}
          onChangeImgs={(imgs) => {
          if (inputDef.onChange)
            inputDef.onChange(rdata, imgs);
          else
            rdata.current[inputDef.id] = imgs;
          }}
          onProcessing={() => {
            loading.setLoading(true);
            notify("info", "Image uploading");
          }}
          onProcessingDone={() => {
            loading.setLoading(false);
            notify("info", "Image uploaded");
          }}
          onErr={(e) => {
            const errs = e.toErrorList();
            if (errs.length > 0) {
              setErr(errs);
            }
          }}
        />
      case "select":
        return <Select {...opts} key={inputDef.id} onChange={onChange} defaultValue={defValue}>
          {inputDef.options?.map((v) => {
          return <option key={v} value={v} className="capitalize">{v}</option>
          })
          }
        </Select>
      case "password":
        const required = {} as any;
        if (!rdata.current.id)
          required.required = true;
        return <InputPassword key={inputDef.id} {...opts} {...required} defaultValue={defValue} validators={(!rdata.current.id && inputDef.validators)? inputDef.validators:[]}
          onChange={onChange}
          />
      default:
        break;
    }
  }

  const onClose = useCallback(() => {
    close(rdata);
  }, [])

  const onSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    console.log(rdata.current);
    loading.setLoading(true);
    try {
      if (rdata.current.id) {
        await submitter.update(rdata.current);
        notify("info", `Successfully updated ${onSuccessMsg(rdata.current)}`);
      }
      else {
        await submitter.add(rdata.current);
        notify("info", `Successfully created ${onSuccessMsg(rdata.current)}`);
      }

      onSuccess();
    }
    catch (e) {
      notify("error", e as MError);
      return;
    }
    finally {
      loading.setLoading(false);
    }

    close();
  }, []);

  return <form className="mt-4 text-sm p-1" onSubmit={onSubmit}>
    <FormError errors={err} />
    {
      inputDefs.map((def, i) => {
        if (Array.isArray(def)) {
          return <div key={`${i}`} className="*:flex-1 flex gap-1">
            {
              def.map((d) => handleRenderOfInputDef(d))
            }
          </div>;
        }
        return handleRenderOfInputDef(def);
      })
    }
    <EditConfirmButtons loading={loading.loading} onCancel={onClose} />
  </form>
}