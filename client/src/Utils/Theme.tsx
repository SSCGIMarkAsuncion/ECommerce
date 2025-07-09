export type ButtonColorStyles  = "primary" | "whitePrimary";
export const Theme = {
  appbar: {
    height: "h-[var(--appbar-height)",
  },
  transition: "transition-all ease-in duration-200",
  button: {
    filled: {
      primary: "bg-primary-800 hover:brightness-[1.4] active:brightness-[1.4] text-white",
      whitePrimary: "bg-white hover:brightness-[0.6] active:brightness-[0.6] text-primary-800",
    },
    outline: {
      primary: "bg-inherit hover:bg-primary-800 active:bg-primary-800 text-primary-800 hover:text-white active:text-white border-2 border-primary-800",
      whitePrimary: "bg-inherit hover:bg-white active:bg-white text-white hover:text-primary-800 active:text-primary-800 border-2 border-white"
    }
  }
};