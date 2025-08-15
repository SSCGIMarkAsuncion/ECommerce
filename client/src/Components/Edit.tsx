import { useCallback, useContext, useRef, useState } from "react";
import { useNotification } from "../Context/Notify";
import { EditFormContext, type EditInputFormDef, type InputDefs } from "../Context/EditableData";
import Input, { InputPassword, TextArea } from "./Input";
import FormError from "./FormError";
import { EditorTags } from "./EditorTags";
import { ImageEditor } from "./ImageEditor";
import Button from "./Button";
import type { MError } from "../Utils/Error";
import Select from "./Select";
import Checkbox from "./Checkbox";

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

interface EInputProps<T> {
  def: EditInputFormDef<T>,
  setErr: React.Dispatch<React.SetStateAction<string[]>>,
  loading: {
    loading: boolean;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  }
};

function EInput<T>({ def, setErr, loading }: EInputProps<T>) {
  const rdata = useContext(EditFormContext);
  const notify = useNotification();
  const refPass = useRef<HTMLInputElement>(null);
  const [ isRequired, setIsRequired ] = useState(
    (def.inputType == "password")? !rdata.current.id:def.required
  );

  const opts = {
    id: def.id,
    label: def.label,
    name: def.name,
    placeholder: def.placeholder,
    readOnly: def.readOnly,
    ...def.props
  } as any;
  // only add the key because html marks it as required(even if value is false) as long as key exist
  if (isRequired) opts.required = true

  const defValue = (def.defaultValue) ? def.defaultValue(rdata) : rdata.current[def.id] || "";

  const onChange = useCallback((e: React.FormEvent<HTMLInputElement>) => {
    if (def.onChange)
      def.onChange(rdata, e.currentTarget.value);
    else
      rdata.current[def.id] = e.currentTarget.value;
  }, []);

  switch (def.inputType) {
    case "email":
    case "text":
    case "datetime-local":
    case "number":
      return <Input key={def.id} {...opts} type={def.inputType} defaultValue={defValue} onChange={onChange} />;
    case "textarea":
      return <TextArea key={def.id} {...opts} defaultValue={defValue} onChange={onChange} />
    case "tags":
      return <EditorTags key={def.id} tags={rdata.current.tags || []} onChangeTags={(tags) => {
        if (def.onChange)
          def.onChange(rdata, tags);
        else
          rdata.current[def.id] = tags;
      }} />
    case "images":
      return <ImageEditor
        key={def.id}
        imgs={rdata.current.imgs || []}
        onChangeImgs={(imgs) => {
          if (def.onChange)
            def.onChange(rdata, imgs);
          else
            rdata.current[def.id] = imgs;
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
      return <Select {...opts} key={def.id} onChange={onChange} defaultValue={defValue}>
        {def.options?.map((v) => {
          return <option key={v} value={v} className="capitalize">{v}</option>
        })
        }
      </Select>
    case "password":
      return <>
        <InputPassword
          ref={refPass}
          key={def.id} {...opts}
          readOnly={!isRequired}
          label={
            <Checkbox className="mr-2" label={opts.label}
              checked={isRequired} onChange={(e) => {
                e.stopPropagation();
                setIsRequired(v => !v);
                if (def.onChange)
                  def.onChange(rdata, "");
                else
                  rdata.current[def.id] = "";
                if (refPass.current) {
                  refPass.current.value = "";
                  refPass.current.setCustomValidity("");
                }
              }} />
          }
          // {...required}
          defaultValue={defValue}
          validators={(opts.required && def.validators) ? def.validators : []}
          onChange={onChange}
        />
      </>
    default:
      break;
  }
  return <p className="text-xs text-red-600">Invalid EditorInputDefinition</p>;
}

export function Editor<T>({ inputDefs, loading, close, submitter, onSuccessMsg, onSuccess }: EditorProps<T>) {
  const rdata = useContext(EditFormContext);
  const [ err, setErr ] = useState<string[]>([]);
  const notify = useNotification();

  console.assert(rdata.current != null);

  const onClose = useCallback(() => {
    close(rdata);
  }, [])

  const onSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    const form = e.currentTarget as HTMLFormElement;
    // console.log(!form.checkValidity());
    if (!form.checkValidity()) return;

    // console.log("Editor::REFDATA", rdata.current);
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
              def.map((d, j) => <EInput key={`${i}${j}-AInput`} setErr={setErr} loading={loading} def={d} />)
            }
          </div>;
        }
        return <EInput key={`${i}-EInput`} setErr={setErr} loading={loading} def={def} />;
      })
    }
    <EditConfirmButtons loading={loading.loading} onCancel={onClose} />
  </form>
}