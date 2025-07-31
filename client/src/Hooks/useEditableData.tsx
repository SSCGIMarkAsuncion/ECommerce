import { PRODUCT_COLUMNS } from "../Models/Product";
import { USERS_COLUMNS } from "../Models/User";
import { buildColumnFrom, type OpenableData, type TableData } from "../Utils/DataBuilder";
import useProducts from "./useProducts";
import useUsers from "./useUser";

export function useEditableData() {
  const { getProducts } = useProducts();
  const { getUsers } = useUsers();
  const load = async (type: OpenableData): Promise<TableData | null> => {
    let cols = null;
    switch (type) {
      case "products":
        const products = await getProducts([], [], false, {
          by: "date", type: "desc"
        });
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
      case "promos":
      case "orders":
      case "payments":
    }

    // empty arrays for loading is done but there is no data
    // null for still loading data
    return {
      data: [],
      column: []
    };
  };

  return {
    load
  };
}