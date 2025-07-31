import { PRODUCT_COLUMNS } from "../Models/Product";
import { buildColumnFrom, type OpenableData, type TableData } from "../Utils/DataBuilder";
import useProducts from "./useProducts";

export function useEditableData() {
  const { getProducts } = useProducts();
  const load = async (type: OpenableData): Promise<TableData | null> => {
    switch (type) {
      case "products":
        const products = await getProducts([], [], false, {
          by: "date", type: "desc"
        });
        if (products.length == 0)
          break;
        const cols = buildColumnFrom("products", PRODUCT_COLUMNS);
        return {
          column: cols,
          data: products
        };
      case "users":
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

  const edit = (type: OpenableData, data: any) => {
  };

  return {
    load
  };
}