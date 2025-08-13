import type { HTMLProps } from "react";

export interface CheckboxProps extends HTMLProps<HTMLInputElement> {
  label?: string,
};

export default function Checkbox({ label = "", className, ...props }: CheckboxProps) {
  return <div className={`flex items-center gap-1 ${className}`}>
    <label htmlFor={props.id}>{label}</label>
    <input {...props} type="checkbox" className="accent-primary-950" />
  </div>
}