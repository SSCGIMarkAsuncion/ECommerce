import type { HTMLProps } from "react";
import { Theme } from "../Utils/Theme";

export default function Select(props: HTMLProps<HTMLSelectElement>) {
  return <div className="fraunces-regular">
    <label htmlFor={props.id}>{props.label}</label>
    <br />
    <div className="flex items-center">
      <select {...props}
        name={props.name? props.name:props.id}
        className={`${Theme.transition} ${Theme.select}`} >
        {props.children}
      </select>
    </div>
  </div>
}