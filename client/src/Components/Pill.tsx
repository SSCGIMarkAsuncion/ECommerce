import type { HTMLAttributes, HTMLProps } from "react";
import Button from "./Button";
import { IconXMark } from "../Utils/SVGIcons";

export interface PillProps extends HTMLProps<HTMLDivElement> {
  editable?: boolean,
  onRemove?: (name: string) => void
};

export function Pill({ onRemove, editable, ...props }: PillProps) {
  // const colors = ["bg-blue-400", "bg-green-400", "bg-red-400", "bg-amber-400", "bg-lime-400"];
  // let colIndex = 0;
  // if (typeof props.children == "string") {
  //   colIndex = props.children.charCodeAt(0) % colors.length;
  // }

  return <div
    {...props}
    className={`py-1 px-2 text-center rounded-full flex gap-1 items-center bg-gray-300 ${props.className}`}>
    {props.children}
    { editable && <Button pType="icon" className="ml-auto w-6 h-6" onClick={(e) => {
        e.stopPropagation();
        if (onRemove)
          onRemove(props.children as string);
      }} >
        <IconXMark className="fill-red-800" />
      </Button>
    }
  </div>
}