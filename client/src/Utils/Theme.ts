export type ButtonColorStyles = "primary" | "whitePrimary" | "green" | "red";
export type ButtonType = "filled" | "outline" | "icon";

export const Theme = {
  rounded: "rounded-xs",
  appbar: {
    classHeight: "h-[var(--appbar-height)]",
    normalBackground: "bg-primary-900",
    scrolledBackground: "bg-primary-900"
  },
  transition: "transition-all ease-in duration-200",
  button: {
    disabled: "disabled:bg-neutral-500 disabled:text-neutral-200 disabled:cursor-default! disabled:pointer-events-none",
    filled: {
      primary: "bg-primary-900 hover:brightness-[1.6] active:brightness-[1.6] text-white",
      green: "bg-green-800 hover:brightness-[1.6] active:brightness-[1.6] text-white",
      red: "bg-red-800 hover:brightness-[1.6] active:brightness-[1.6] text-white",
      none:  "bg-none hover:bg-primary-600/25 active:bg-primary-600/25 text-white",
      whitePrimary: "bg-white hover:brightness-[0.6] active:brightness-[0.6] text-primary-900",
    },
    outline: {
      primary: "bg-inherit hover:bg-primary-900 active:bg-primary-900 text-primary-900 hover:text-white active:text-white border-2 border-primary-900",
      green:  "",
      red: "",
      whitePrimary: "bg-inherit hover:bg-white active:bg-white text-white hover:text-primary-900 active:text-primary-900 border-2 border-white"
    },
    icon: {
      primary: "bg-none hover:bg-neutral-900/25 active:bg-neutral-900/25",
      green:  "",
      red: "bg-none hover:bg-red-900/25 active:bg-red-900/25",
      whitePrimary: ""
    },
  },
  input: (element: "input" | "textarea") => {
    return `w-full rounded-md border-2 border-gray-500
     py-1 px-2 data-[invalid=true]:border-red-700
     has-[${element}:focus-within]:border-primary-950 has-[${element}:read-only]:bg-gray-400 has-[${element}:read-only]:text-gray-600
     flex items-center`;
  }
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
