import { useCallback, useEffect, useRef, useState, type HTMLProps, type ReactNode } from "react";
import { Theme } from "../Utils/Theme";
import { IconEye, IconEyeSlash, IconSearch, IconXMark } from "../Utils/SVGIcons";
import useDelayCallback from "../Hooks/useDelayCallback";
import Button from "./Button";

export interface InputProps extends Omit<HTMLProps<HTMLInputElement>, 'prefix' | 'suffix'> {
  suffix?: ReactNode,
  prefix?: ReactNode,
  inputClassName?: string,
  containerClassName?: string,
  label?: string,
  validators?: ((value: string) => string | string[])[], // returns an error message, empty if no error
  onStatus?: (value: string, invalid: boolean) => void
};

export default function Input({ containerClassName, inputClassName, prefix, suffix, label, validators, onStatus, ...props }: InputProps) {
  const [ invalid, setInvalid ] = useState(false);
  const [ errs, setErrs ] = useState<string[]>([]);
  const onValidate = useCallback((e: React.FocusEvent<HTMLInputElement> | React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    const value = e.target.value;
    const errMsgs: string[] = [];

    // clear custom validationMessage, while still getting the default validationMessage
    e.target.setCustomValidity("");
    if (e.target.validationMessage) {
      errMsgs.push(e.target.validationMessage);
    }

    if (validators) {
      validators.forEach((validator) => {
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
      if (onStatus)
        onStatus(value, true);
    }
    else {
      setInvalid(false);
      setErrs([]);
      if (onStatus)
        onStatus(value, false);
    }
  }, [validators, onStatus]);
  const delayedCallback = useDelayCallback(onValidate, 500);

  return <div hidden={props.hidden} className={containerClassName}>
    <label htmlFor={props.id}>{label}</label>
    <div 
      data-invalid={invalid}
      onBlur={onValidate as React.FocusEventHandler<HTMLInputElement>}
      onChange={(e) => delayedCallback(e)}
      className={`${Theme.transition} ${Theme.input} ${props.className}`}>
      { prefix }
      <input
        {...props}
        name={props.id}
        className={`w-full outline-none ${inputClassName}`} >
      </input>
      { suffix }
    </div>
    <div className="mt-1 text-red-700 text-sm">
      {
        errs.map((err, i) => {
          return <p key={i} className="animate-appear">{err}</p>;
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

  const required: any = { };
  if (props.required) {
    required.required = true;
  }

  return <Input {...props} ref={props.ref} validators={props.validators} {...required} id={props.id} label={props.label}
    type={type} suffix={
      <div className="w-[18px] h-[18px] flex items-center cursor-pointer" onClick={(e) => {
        e.stopPropagation();
        toggle();
      }}>
        {suffix}
      </div>
    } />
}

export interface TextAreaProps extends HTMLProps<HTMLTextAreaElement> {
  label?: string,
};

export function TextArea(props: TextAreaProps) {
  return <div>
    <label htmlFor={props.id}>{props.label}</label>
    <div 
      className={`${Theme.transition} ${Theme.textarea} ${props.className}`}>
      <textarea
        {...props}
        name={props.id}
        className="w-full outline-none" />
    </div>
  </div>
}

export interface SearchbarProps extends HTMLProps<HTMLInputElement> {
  onChangeFilter?: (filter: string) => void
};

export function Searchbar({ onChangeFilter, ...props }: SearchbarProps) {
  const cb = onChangeFilter? useDelayCallback(onChangeFilter, 100):null;
  const ref = useRef<HTMLInputElement>(null);
  const [ svalue, setSValue ] = useState(props.defaultValue || "");

  useEffect(() => {
    if (cb)
      cb(svalue)
  }, [svalue]);

  return <div
    className={`relative ${Theme.transition} ${Theme.input} gap-2 ${props.className}`}>
    <IconSearch className="size-4 fill-primary-950" />
    <input
      {...props}
      ref={ref}
      name={props.id}
      onChange={(e) => {
        const value = e.currentTarget.value;
        setSValue(value);
      }}
      className="w-full outline-none" />
    { svalue && <Button pType="icon" pColor="red" className="size-7 absolute right-2" onClick={(e) => {
      e.stopPropagation();
      if (ref.current) {
        ref.current.value = "";
        setSValue("");
      }
    }}><IconXMark className="fill-primary-900" /></Button> }
  </div>
}