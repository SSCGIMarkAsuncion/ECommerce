import { useCallback, useContext, useEffect, useState, type HTMLProps } from "react";
import Footer from "../Components/Footer";
import Navbar, { NavbarOffset } from "../Components/Navbar";
import Tabs, { TabsContext } from "../Context/Tabs";
import Order, { OrderQuery, type OrderStatus } from "../Models/Order";
import { Card } from "../Components/Card";
import useOrders from "../Hooks/useOrders";
import { useNotification } from "../Context/Notify";
import type { MError } from "../Utils/Error";
import Loading from "../Components/Loading";
import { toCurrency } from "../Utils/Currency";

export default function MyOrder() {
  return <>
    <NavbarOffset />
    <div className="min-h-[90svh] w-full md:w-[80%] mx-auto mt-4 fraunces-regular">
      <h1 className="text-4xl text-primary-900 mb-2">My Orders</h1>
      <Tabs tabs={["Pending", "To Ship", "Received", "Cancelled"]}>
        <TabOrderList />
      </Tabs>
    </div>
    <Navbar type="product" />
    <Footer />
  </>;
}

function TabOrderList() {
  const { selected, tabs } = useContext(TabsContext)
  const { getOrders } = useOrders();
  const [ loading, setLoading ] = useState(false);
  const [ orders, setOrders ] = useState<Order[]>([]);
  const notify = useNotification();

  useEffect(() => {
    async function a() {
      try {
        setLoading(true);
        const s = tabs[selected];
        const orderQuery = new OrderQuery();
        orderQuery.populated = true;
        switch (s.toLowerCase()) {
          case "pending":
            orderQuery.status = ["pending", "processing"];
            break;
          case "to ship":
            orderQuery.status = ["shipped"];
            break;
          case "received":
            orderQuery.status = ["delivered", "completed"];
            break;
          case "cancelled":
            orderQuery.status = ["cancelled", "failed"];
            break;
          default:
            notify("warn", "Invalid tab selection");
            break;
        }
        const orders = await getOrders(orderQuery)
        setOrders(orders);
      }
      catch (e) {
        console.log("TabOrderList::ERR", e);
        notify("error", e as MError);
      }
      setLoading(false);
    }
    a();
  }, [selected]);

  return <div className="px-4 *:mb-2">
    {
      !loading?
      orders.map((order) => {
        return <OrderItem key={order.id} order={order} />;
      }):
      <Loading>Loading Orders</Loading>
    }
  </div>;
}

interface ItemProps extends HTMLProps<HTMLDivElement> {
  order: Order
};

function OrderItem({ order, ...props }: ItemProps) {
  const notify = useNotification();
  const onSummary = useCallback(() => {
    notify("warn", "Open summary. Not Implemented Yet");
  }, []);

  return <Card {...props} className={`text-white p-4 rounded-lg! bg-primary-500! ${props.className}`}>
    <div className="flex justify-between items-start">
      <p className="mb-2 text-xl uppercase tracking-wide">#{order.id.substring(order.id.length - 10)}</p>
        <p className="text-xs cursor-pointer text-green-400 hover:brightness-75" onClick={onSummary}>Summary</p>
    </div>
    <OrderStatus status={order.status} />
    <div className="flex justify-between items-end w-full mt-4">
      <p className="capitalize text-lg">{order.status}</p>
      <div className="*:text-right text-white/70">
        <p className="text-sm"><span className="text-white/40">Amount:</span> {toCurrency(order.amount)}</p>
        <p className="text-sm">Created: {order.createdAt?.toDateString() || ""}</p>
      </div>
    </div>
  </Card>;
}

function Circle({ active = false, error = false }: { active?: boolean, error?: boolean }) {
  return <div data-active={active ? '1' : ''} data-error={error ? '1' : ''}
   className={`size-4 border-2 rounded-full bg-[inherit] data-[active='1']:border-green-400 data-[error='1']:border-red-400 border-gray-200`}>
  </div>
}

function Hr({ active = false, error = false }: { active?: boolean, error?: boolean }) {
  return <hr data-active={active ? '1' : ''} data-error={error ? '1' : ''}
   className="flex-1 h-[2px] border-none data-[active='1']:bg-green-400 data-[error='1']:bg-red-400 bg-gray-200" />
}

function OrderStatus({ status }: { status: OrderStatus }) {
  let active = 1;
  switch (status) {
    case "pending":
      active = 1;
      break;
    case "processing":
      active = 2;
      break;
    case "shipped":
      active = 3;
      break;
    case "delivered":
      active = 4;
      break;
    case "completed":
      active = 5;
      break;
    case "cancelled":
    case "failed":
      active = -1;
      break;
    default:
      break;
  }

  return <div className="flex items-center">
    <Circle active={active>=1} error={active<0} />
    <Hr active={active>=2} error={active<0} />
    <Hr active={active>=3} error={active<0} />
    <Circle active={active>=3} error={active<0} />
    <Hr active={active>=3} error={active<0} />
    <Hr active={active>=4} error={active<0} />
    <Circle active={active>=4} error={active<0} />
    <Hr active={active>=4} error={active<0} />
    <Hr active={active>=5} error={active<0} />
    <Circle active={active>=5} error={active<0} />
  </div>
}