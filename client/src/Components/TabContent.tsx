import { useContext, type HTMLProps } from "react";
import { TabsContext } from "../Context/Tabs";

export interface TabContentProps extends HTMLProps<HTMLDivElement> {
  id: string
};

export default function TabContent({ id, ...props }: TabContentProps) {
  const { selected, tabs } = useContext(TabsContext)
  if (tabs[selected] !== id) return null;

  return <div {...props}>
    {props.children}
  </div>;
}