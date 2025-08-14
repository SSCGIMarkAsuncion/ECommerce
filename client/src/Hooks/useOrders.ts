import Order, { OrderQuery } from "../Models/Order";
import { MError } from "../Utils/Error";

const api = `${import.meta.env.VITE_API}/orders`;
export default function useOrders() {
  const getOrders = async (query: OrderQuery = new OrderQuery()) => {
    const squery = query.build();
    const res = await fetch(`${api}/${squery}`, {
      credentials: "include",
    });

    const resjson = await res.json() as any[];
    if (res.status >= 200 && res.status <= 399) {
      const orders = resjson.map((item) => {
        return new Order(item);
      });
      return orders;
    }
    throw new MError(resjson);
  };

  const deleteOrder = async (order: Order) => {
    const res = await fetch(`${api}/delete/${order.id}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (res.status >= 200 && res.status <= 399) {
      return null;
    }
    const resjson = await res.json();
    throw new MError(resjson);
  };

  const cancelOrder = async (order: Order) => {
    const res = await fetch(`${api}/request-cancel/${order.id}`, {
      credentials: "include",
    });

    if (res.status >= 200 && res.status <= 399) {
      return null;
    }
    const resjson = await res.json();
    throw new MError(resjson);
  };

  const updateOrder = async (order: Order) => {
    // console.trace("UPDATE", order);
    const res = await fetch(`${api}/update/${order.id}`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(order)
    });

    if (res.status >= 200 && res.status <= 399) {
      return null;
    }
    const resjson = await res.json();
    throw new MError(resjson);
  };

  return {
    getOrders,
    deleteOrder,
    cancelOrder,
    updateOrder
  };
}