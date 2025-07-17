import { mapToProduct, PRODUCT_COLUMNS } from "../Models/Product";
import { buildColumnFrom, type OpenableData, type TableData } from "../Utils/DataBuilder";
import useProducts from "./useProducts";

export function useEditableData() {
  const { getProducts } = useProducts();
  const load = async (type: OpenableData): Promise<TableData | null> => {
    switch (type) {
      case "products":
        const products = await getProducts([], []);
        if (products.length == 0)
          break;
        // const rows = buildRowsFrom("products", products);
        const rows = products.map((product) => mapToProduct(product));
        const cols = buildColumnFrom("products", PRODUCT_COLUMNS);
        console.log(cols, products);
        return {
          column: cols,
          data: rows
        };
      case "promos":
      case "orders":
      case "users":
      case "payments":
    }
    return null;
  };

  const edit = (type: OpenableData, data: any) => {
  };

  return {
    load
  };
}