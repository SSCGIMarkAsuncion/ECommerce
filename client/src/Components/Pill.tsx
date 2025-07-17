import type { HTMLAttributes } from "react";

export function Pill({ children }: HTMLAttributes<HTMLDivElement>) {
  const colors = ["bg-blue-400", "bg-green-400", "bg-red-400", "bg-amber-400", "bg-lime-400"];
  let colIndex = 0;
  if (typeof children == "string") {
    colIndex = children.charCodeAt(0) % colors.length;
  }

  return <div className={`py-1 px-2 text-center rounded-full ${colors[colIndex]}`}>
    {children}
  </div>
}