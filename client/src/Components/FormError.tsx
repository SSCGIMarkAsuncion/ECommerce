import { type HTMLProps } from "react";

export interface FormErrorProps extends HTMLProps<HTMLDivElement> {
  errors: string[]
};

export default function FormError(props: FormErrorProps) {
  if (props.errors.length == 0) {
    return <></>;
  }

  return <div
   className="mt-1 bg-red-200 border-red-300 text-red-400 border-2 border-dashed p-4 rounded-lg text-sm flex flex-col gap-2 animate-appear">
    {
      props.errors.map((err, i) => {
        return <p key={i}>{err}</p>;
      })
    }
  </div>
}