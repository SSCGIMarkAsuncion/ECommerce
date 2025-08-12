import type { HTMLProps } from "react";
import { IconSpinner } from "../Utils/SVGIcons";

export default function Loading({ children, ...props }: HTMLProps<HTMLDivElement>) {
  return <div className={`h-[calc(100%-var(--appbar-height))] w-full flex items-center justify-center gap-2 ${props.className}`}>
    <span>{children}</span> <IconSpinner className="w-8 h-8 fill-primary-950" />
  </div>
}