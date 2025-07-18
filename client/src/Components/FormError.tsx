import { type HTMLProps } from "react";

export interface FormErrorProps extends HTMLProps<HTMLDivElement> {
  errors: string[]
};

export default function FormError(props: FormErrorProps) {
  if (props.errors.length == 0) {
    return <></>;
  }

  return <div className="mt-1 bg-red-400 border-2 border-dashed text-red-600 border-red-600 p-4 rounded-lg text-sm">
    {
      props.errors.map((err, i) => {
        return <p key={i} className="mb-2 animate-appear">{err}</p>;
      })
    }
  </div>
}