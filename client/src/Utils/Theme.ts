export type ButtonColorStyles = "primary" | "whitePrimary";
export type ButtonType = "filled" | "outline" | "icon";

export const Theme = {
  rounded: "rounded-xs",
  appbar: {
    classHeight: "h-[var(--appbar-height)]",
    scrolledBackground: "bg-primary-900"
  },
  transition: "transition-all ease-in duration-200",
  button: {
    disabled: "disabled:contrast-[0.7] disabled:cursor-default! disabled:pointer-events-none",
    filled: {
      primary: "bg-primary-900 hover:brightness-[1.6] active:brightness-[1.6] text-white",
      whitePrimary: "bg-white hover:brightness-[0.6] active:brightness-[0.6] text-primary-900",
    },
    outline: {
      primary: "bg-inherit hover:bg-primary-900 active:bg-primary-900 text-primary-900 hover:text-white active:text-white border-2 border-primary-900",
      whitePrimary: "bg-inherit hover:bg-white active:bg-white text-white hover:text-primary-900 active:text-primary-900 border-2 border-white"
    },
    icon: {
      primary: "bg-none hover:bg-neutral-900/25 active:bg-neutral-900/25",
      whitePrimary: ""
    }
  }
};

export const CarouselBreakpoints = {
  superLargeDesktop: {
    breakpoint: { max: 4000, min: 3000 },
    items: 5
  },
  desktop: {
    breakpoint: { max: 3000, min: 1025 },
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