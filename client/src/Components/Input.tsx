import type { HTMLProps, ReactNode } from "react";
import { Theme } from "../Utils/Theme";

export interface InputProps extends HTMLProps<HTMLInputElement> {
  iconPrefix?: ReactNode
  label: string,
};

export default function Input(props: InputProps) {
  return <div>
    <label htmlFor={props.id} className="fraunces-regular text-xl">{props.label}</label>
    <div className={`w-full ${Theme.rounded} border-2 border-gray-500 py-1 px-2 has-[input:invalid]:border-red-700 has-[input:focus-within]:border-primary-950`}>
      <input
        aria-invalid={true}
        id={props.id}
        className="w-full outline-none"
        type={props.type} placeholder={props.placeholder}
        required={props.required}>
      </input>
    </div>
  </div>
}