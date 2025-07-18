import type { Product } from "../Models/Product";
import { MError } from "../Utils/Error";
const api = import.meta.env.VITE_API;

export default function useProducts() {
  const getProducts = async (tags: string[], filters: string[], limit?: number, offset?: number) => {
    const queries = [];

    const stags = tags.length>0? `tags=${tags.join(';')}`:"";
    const sfilter = filters.length>0? `filter=${filters.join(';')}`:"";
    const slimit = limit? `limit=${limit}`:"";
    const soffset = offset? `offset=${offset}`:"";
    if (stags)
      queries.push(stags);
    if (sfilter)
      queries.push(sfilter);
    if (slimit)
      queries.push(slimit);
    if (soffset)
      queries.push(soffset);

    const squeries = queries.join('&');
    const res = await fetch(`${api}/products?${squeries}`);

    const resjson = await res.json();
    if (res.status >= 200 && res.status < 300) {
      return resjson as Product[];
    }
    throw new MError(resjson);
  };

  const getProductsById = async (id: string) => {
    return {} as Product;
  };

  const updateProduct = async (update: Product) => {
    console.log("update", update);
    throw new MError({ error: "Update" });
  }

  const newProduct = async (product: Product) => {
    console.log("new", product);
    throw new MError({ error: "new" });
  }

  const removeProduct = async (product: Product) => {
    console.log("delete", product);
    throw new MError({ error: "delete" });
  }

  return {
    getProducts,
    getProductsById,
    updateProduct,
    newProduct,
    removeProduct
  };
}