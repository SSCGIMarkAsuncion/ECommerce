import type { HTMLProps } from "react";

export interface ImgProps extends HTMLProps<HTMLImageElement> {
  fallback?: string
};

export default function Img({ fallback = "/Logo.svg",...props }: ImgProps) {
  return <img {...props} onError={(e) => {
    e.preventDefault();
    e.currentTarget.src = fallback;
  }}/>
}