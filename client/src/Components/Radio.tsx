import type { HTMLProps } from "react";

export interface RadioProps extends HTMLProps<HTMLInputElement> {
  label: string,
};

export default function Radio({ label, ...props }: RadioProps) {
  return <div className="flex items-center gap-1">
    <label htmlFor={props.id}>{label}</label>
    <input {...props} type="radio" className="accent-primary-950" />
  </div>
}