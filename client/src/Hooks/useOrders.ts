import Order from "../Models/Order";
import { MError } from "../Utils/Error";

const api = `${import.meta.env.VITE_API}/orders`;
export default function useOrders() {
  const getOrders = async () => {
    // do not populate fields
    const res = await fetch(`${api}/`, {
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

  return {
    getOrders,
  };
}