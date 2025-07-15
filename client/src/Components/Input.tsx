import { useCallback, useState, type HTMLProps, type ReactNode } from "react";
import { Theme } from "../Utils/Theme";
import { IconEye, IconEyeSlash } from "../Utils/SVGIcons";
import useDelayCallback from "../Hooks/useDelayCallback";

export interface InputProps extends HTMLProps<HTMLInputElement> {
  suffix?: ReactNode,
  label: string,
  validators?: ((value: string) => string | string[])[], // returns an error message, empty if no error
  onStatus?: (value: string, invalid: boolean) => void
};

export default function Input(props: InputProps) {
  const [ invalid, setInvalid ] = useState(false);
  const [ errs, setErrs ] = useState<string[]>([]);
  const onValidate = useCallback((e: React.FocusEvent<HTMLInputElement> | React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    const value = e.target.value;
    const errMsgs: string[] = [];

    e.target.setCustomValidity("");

    if (e.target.validationMessage) {
      errMsgs.push(e.target.validationMessage);
    }

    if (props.validators) {
      props.validators.forEach((validator) => {
        const errMsg = validator(value)
        if (errMsg) {
          if (typeof errMsg == "string")
            errMsgs.push(errMsg);
          else errMsgs.push(...errMsg);
        }
      });
      if (e.target.validationMessage.length == 0 && errMsgs.length > 0) {
        e.target.setCustomValidity(errMsgs[0]);
      }
    }

    // console.log(errMsgs);

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
  const delayedCallback = useDelayCallback(onValidate, 500);

  return <div>
    <label htmlFor={props.id} className="fraunces-regular text-xl">{props.label}</label>
    <div 
      data-invalid={invalid}
      onBlur={onValidate as React.FocusEventHandler<HTMLInputElement>}
      onChange={(e) => delayedCallback(e)}
      className={`${Theme.transition} w-full rounded-md border-2 border-gray-500 py-1 px-2
     data-[invalid=true]:border-red-700 has-[input:focus-within]:border-primary-950
      flex items-center`}>
      <input
        ref={props.ref}
        name={props.id}
        aria-invalid={true}
        id={props.id}
        className="w-full outline-none"
        type={props.type} placeholder={props.placeholder}
        required={props.required}>
      </input>
      {
        props.suffix
      }
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

export function InputPassword(props: InputProps) {
  const [ type, setType ] = useState("password");
  const suffix = type == "password"?
   <IconEye fill="#000" />:<IconEyeSlash fill="#000" />;

  const toggle = useCallback(() => {
    setType(v => {
      if (v == "password")
        return "text";
      else return "password";
    });
  }, []);

  return <Input ref={props.ref} validators={props.validators} required id={props.id} label={props.label}
    type={type} suffix={
      <div className="w-[18px] h-[18px] flex items-center cursor-pointer" onClick={(e) => {
        e.stopPropagation();
        toggle();
      }}>
        {suffix}
      </div>
    } />
}