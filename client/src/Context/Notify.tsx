import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { Card } from "../Components/Card";
import { IconInfoFilled } from "../Utils/SVGIcons";
import { MError } from "../Utils/Error";

export const NotifyContext = createContext<((type: NotificationType, body: string) => void) | null>(null);

export type NotificationType = "warn" | "info" | "error";
export interface NotificationItem {
  id?: string,
  type: NotificationType,
  body: string
}

export function useNotification() {
  const ctx = useContext(NotifyContext);
  if (!ctx) throw new MError("NotifyContext is Null");
  return ctx!;
}

export default function NotifyProvider({ children }: { children: ReactNode}) {
  const [ notifications, setNotifications ] = useState<NotificationItem[]>([]);

  const pushNotify = useCallback((type: NotificationType, body: string) => {

    setNotifications(v => {
      return [ ...v, { id: crypto.randomUUID(),type, body }];
    });
  }, []);

  const remove = useCallback((item: NotificationItem) => {
    setNotifications(items => {
      const newItems = items.filter((v) => item.id! !== v.id!);
      return newItems;
    })
  }, []);

  return <NotifyContext.Provider value={pushNotify}>
    {children}
    <div hidden={notifications.length<=0} className="z-[9999] absolute top-0 left-0 p-4 flex flex-col gap-2 max-w-[100]">
      {
        notifications.map((item) => {
          return <Notification key={item.id!} item={item} remove={remove} />;
        })
      }
    </div>
  </NotifyContext.Provider>
}

function Notification({ item, remove }: { item: NotificationItem, remove: (item: NotificationItem) => void }) {
  const timer = useRef(0)
  useEffect(() => {
    timer.current = setTimeout(() => {
      remove(item)
    }, 3000);
  }, []);

  const colors = {
    warn: "fill-amber-500 text-amber-500 bg-amber-100! border-amber-300!",
    info: "fill-blue-500 text-blue-500 bg-blue-100! border-blue-300!",
    error: "fill-red-500 text-red-500 bg-red-100! border-red-300!"
  };

  return <Card className={`flex items-center gap-2 px-2 py-1 border-1 ${colors[item.type]}`} onClick={() => {
    if (timer.current) {
      clearTimeout(timer.current)
    }
    remove(item);
  }}>
    <IconInfoFilled className="size-6" />
    <span className="text-md mr-2">{item.body}</span>
  </Card>
}