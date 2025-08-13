import { createContext, useState, type ReactNode } from "react";
import Button from "../Components/Button";
import { Theme } from "../Utils/Theme";

export interface TTabsContext {
  tabs: string[],
  selected: number,
  setSelected: React.Dispatch<React.SetStateAction<number>>
};
export const TabsContext = createContext<TTabsContext>(null!)

export interface TabsProviderProps {
  tabs: string[],
  children: ReactNode
};

export default function Tabs(props: TabsProviderProps) {
  const [ tabs, _setTabs ] = useState(props.tabs);
  const [ selected, setSelected ] = useState(0);

  // @ts-ignore
  return <TabsContext.Provider value={{
    tabs,
    selected,
    setSelected
  }}>
    <div className="flex text-sm">
      {
        tabs.map((tab, i) => {
          return <Button key={`TabButton-${i}`}
            pType="tab"
            className={`${selected == i? Theme.button.tab.active:""}`}
            onClick={(e) => {
            e.stopPropagation();
            setSelected(i);
          }}>{tab}</Button>
        })
      }
    </div>
    <div className="p-2">
      {props.children}
    </div>
  </TabsContext.Provider>;
}