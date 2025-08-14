import { createContext, useState, type ReactNode } from "react";
import { Modal } from "../Components/Modal";

interface TModalContext {
  content: ReactNode,
  setContent: React.Dispatch<React.SetStateAction<ReactNode>>
};
export const ModalContext = createContext<TModalContext>(null!);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [ content, setContent ] = useState<ReactNode>(null);
  return <ModalContext.Provider value={{
      content, setContent 
    }}>
    {children}
    {
      content && 
      <Modal onClick={(e) => {
        e.stopPropagation();
        setContent(null);
      }}>
        { content }
      </Modal>
    }
  </ModalContext.Provider>
}