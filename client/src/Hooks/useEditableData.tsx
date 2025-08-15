import { CARTS_COLUMNS } from "../Models/Cart";
import { HISTORY_COLUMNS } from "../Models/History";
import { ORDERS_COLUMNS } from "../Models/Order";
import { PRODUCT_COLUMNS, type ProductFilterQuery } from "../Models/Product";
import { USERS_COLUMNS } from "../Models/User";
import { buildColumnFrom, type OpenableData, type TableData } from "../Utils/DataBuilder";
import useCart from "./useCart";
import useHistory from "./useHistory";
import useOrders from "./useOrders";
import useProducts from "./useProducts";
import useUsers from "./useUser";

export function useEditableData() {
  const { getProducts } = useProducts();
  const { getUsers } = useUsers();
  const { getOrders } = useOrders();
  const { getAllCarts } = useCart();
  const { getHistory } = useHistory();

  const load = async (type: OpenableData): Promise<TableData | null> => {
    let cols = null;
    switch (type) {
      case "products":
        const products = await getProducts({} as ProductFilterQuery);
        if (products.length == 0)
          break;
        cols = buildColumnFrom(PRODUCT_COLUMNS);
        return {
          column: cols,
          data: products
        };
      case "users":
        const users = await getUsers();
        if (users.length == 0)
          break;
        cols = buildColumnFrom(USERS_COLUMNS);
        return {
          column: cols,
          data: users
        };
      case "orders":
        const orders = await getOrders();
        if (orders.length == 0)
          break;
        cols = buildColumnFrom(ORDERS_COLUMNS);
        return {
          column: cols,
          data: orders
        };
      case "carts":
        const carts = await getAllCarts();
        if (carts.length == 0)
          break;
        cols = buildColumnFrom(CARTS_COLUMNS);
        return {
          column: cols,
          data: carts
        };
      case "history":
        const history = await getHistory();
        if (history.length == 0)
          break;
        cols = buildColumnFrom(HISTORY_COLUMNS);
        return {
          column: cols,
          data: history
        };
    }

    return {
      data: [],
      column: []
    };
  };

  return {
    load
  };
}