import { useCallback, useState, type HTMLProps, type ReactNode } from "react";
import { Theme } from "../Utils/Theme";

export interface InputProps extends HTMLProps<HTMLInputElement> {
  iconPrefix?: ReactNode
  label: string,
  validators?: ((value: string) => string)[], // returns an error message, empty if no error
  onStatus?: (value: string, invalid: boolean) => void
};

export default function Input(props: InputProps) {
  const [ invalid, setInvalid ] = useState(false);
  const [ errs, setErrs ] = useState<string[]>([]);

  const onValidate = useCallback((e: React.FocusEvent<HTMLInputElement> | React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    const value = e.target.value;
    const errMsgs: string[] = [];
    if (e.target.validationMessage && e.target.validationMessage !== ":ignore:") {
      errMsgs.push(e.target.validationMessage);
    }

    if (props.validators) {
      props.validators.forEach((validator) => {
        const errMsg = validator(value)
        if (errMsg) {
          errMsgs.push(errMsg);
        }
      });

      e.target.setCustomValidity(":ignore:");
    }

    // console.log(value);
    if (errMsgs.length > 0) {
      setInvalid(true);
      setErrs(errMsgs);
      if (props.onStatus)
        props.onStatus(value, true);
    }
    else {
      setInvalid(false);
      setErrs([]);
      if (props.onStatus)
        props.onStatus(value, false);
    }
  }, [props.validators, props.onStatus]);

  return <div>
    <label htmlFor={props.id} className="fraunces-regular text-xl">{props.label}</label>
    <div 
      data-invalid={invalid}
      onBlur={onValidate as React.FocusEventHandler<HTMLInputElement>}
      onChange={onValidate as React.ChangeEventHandler<HTMLInputElement>}
      className={`${Theme.transition} w-full rounded-md border-2 border-gray-500 py-1 px-2
     data-[invalid=true]:border-red-700 has-[input:focus-within]:border-primary-950`}>
      <input
        name={props.id}
        ref={props.ref}
        aria-invalid={true}
        id={props.id}
        className="w-full outline-none"
        type={props.type} placeholder={props.placeholder}
        required={props.required}>
      </input>
    </div>
    <div className="mt-1 text-red-700 text-sm">
      {
        errs.map((err, i) => {
          return <p key={i} className="mb-2 animate-appear">{err}</p>;
        })
      }
    </div>
  </div>
}