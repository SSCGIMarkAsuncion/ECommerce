export type ButtonColorStyles = "primary" | "whitePrimary" | "green" | "red" | "none" | "nonePrimary";
export type ButtonType = "filled" | "outline" | "icon";

export const Theme = {
  rounded: "rounded-xs",
  appbar: {
    background: "bg-primary-900",
  },
  sidebar: {
    background: "bg-primary-800"
  },
  transition: "transition-all ease-in duration-100",
  button: {
    disabled: "disabled:bg-neutral-500 disabled:text-neutral-200 disabled:cursor-default! disabled:pointer-events-none",
    active: "bg-primary-600/25", // for filled.none
    filled: {
      primary: "bg-primary-900 hover:brightness-[1.6] active:brightness-[1.6] text-white",
      green: "bg-green-800 hover:brightness-[1.6] active:brightness-[1.6] text-white",
      red: "bg-red-800 hover:brightness-[1.6] active:brightness-[1.6] text-white",
      none:  "bg-none hover:bg-primary-600/25 active:bg-primary-600/25 text-white",
      nonePrimary:  "bg-none hover:bg-primary-600/25 active:bg-primary-600/25 text-primary-900",
      whitePrimary: "bg-white hover:brightness-[0.6] active:brightness-[0.6] text-primary-900",
    },
    outline: {
      primary: "bg-inherit hover:bg-primary-900 active:bg-primary-900 text-primary-900 hover:text-white active:text-white border-2 border-primary-900",
      green:  "",
      red: "",
      none:  "",
      nonePrimary:  "",
      whitePrimary: "bg-inherit hover:bg-white active:bg-white text-white hover:text-primary-900 active:text-primary-900 border-2 border-white"
    },
    icon: {
      primary: "bg-none hover:bg-primary-500/25 active:bg-primary-500/25",
      green:  "",
      none:  "",
      red: "bg-none hover:bg-red-900/25 active:bg-red-900/25",
      nonePrimary:  "",
      whitePrimary: "bg-none hover:bg-gray-500/25 active:bg-gray-500/25"
    },
  },
  input: "w-full rounded-md border-2 bg-gray-200 border-gray-200 py-1 px-2 data-[invalid=true]:border-red-600 data-[invalid=true]:outline-2 data-[invalid=true]:outline-red-400 has-[input:focus-within]:border-primary-950 has-[input:focus-within]:outline-primary-700 has-[input:focus-within]:outline-2 has-[input:read-only]:bg-gray-400 has-[input:read-only]:border-gray-400 has-[input:read-only]:outline-none has-[input:read-only]:text-gray-700 flex items-center",
  textarea: "w-full rounded-md border-2 bg-gray-200 border-gray-200 py-1 px-2 data-[invalid=true]:border-red-600 data-[invalid=true]:outline-2 data-[invalid=true]:outline-red-400  has-[textarea:focus-within]:border-primary-950 has-[textarea:focus-within]:outline-primary-700 has-[textarea:focus-within]:outline-2 has-[textarea:read-only]:bg-gray-400 has-[textarea:read-only]:text-gray-700 flex items-center",
  select: "bg-none w-full rounded-md border-2 bg-gray-200 border-gray-200 py-1 px-2 focus:border-primary-950 active:border-primary-950" 
};

export const CarouselBreakpoints = {
  desktop: {
    breakpoint: { max: 4000, min: 1025 },
    items: 4
  },
  tablet: {
    breakpoint: { max: 1024, min: 641 },
    items: 3
  },
  mobile: {
    breakpoint: { max: 640, min: 0 },
    items: 2
  }
};
