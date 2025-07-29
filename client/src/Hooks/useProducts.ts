import { Product } from "../Models/Product";
import { MError } from "../Utils/Error";
const api = import.meta.env.VITE_API;

export type SortType = "desc" | "asc";
export interface Sort {
  by: "date" | "price",
  type: SortType
};

export default function useProducts() {
  const url = `${api}/products`;

  const getProducts = async (tags: string[], filters: string[], sort?: Sort): Promise<Product[]> => {
    const queries = [];

    if (tags.length>0)
      queries.push(`tags=${tags.join(';')}`);
    if (filters.length>0)
      queries.push(`filter=${filters.join(';')}`);
    if (sort)
      queries.push(`sortBy=${sort.by}&sortType${sort.type}`);

    const squeries = queries.join('&');
    const res = await fetch(`${url}?${squeries}`);

    const resjson = await res.json();
    if (res.status >= 200 && res.status < 300) {
      return resjson.map((obj: any) => {
        return new Product(obj);
      });
    }
    throw new MError(resjson);
  };

  const getProductsById = async (id: string) => {
    return {} as Product;
  };

  const updateProduct = async (update: Product) => {
    const res = await fetch(`${url}/update/${update.id}`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: update.toJson()
    });

    if (res.status >= 200 && res.status <= 399) {
      return null;
    }
    const resjson = await res.json();
    throw new MError(resjson);
  }

  const newProduct = async (product: Product) => {
    const res = await fetch(`${url}/add`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: product.toJson()
    });
    
    if (res.status >= 200 && res.status <= 399) {
      return null;
    }
    const resjson = await res.json();
    throw new MError(resjson);
  }

  const removeProduct = async (product: Product) => {
    const res = await fetch(`${url}/delete/${product.id}`, {
      method: "DELETE",
      credentials: "include"
    });
    if (res.status >= 200 && res.status <= 399) {
      return null;
    }
    const resjson = await res.json();
    throw new MError(resjson);
  }

  const getPromo = async (): Promise<Product[]> => {
    const res = await fetch(`${url}?isSale=1`);
    // await new Promise(resolve => setTimeout(resolve, 2000));
    const resjson = await res.json() as any[];
    if (res.status >= 200 && res.status < 399) {
      return resjson.map((obj: any) => {
        return new Product(obj);
      });
    }
    throw new MError(resjson);
  };

  const getBestSellers = async (): Promise<Product[]> => {
    const bestSeller = encodeURI("best seller");
    const res = await fetch(`${url}?tags=${bestSeller}`);
    const resjson = await res.json() as any[];
    if (res.status >= 200 && res.status < 399) {
      return resjson.map((obj: any) => {
        return new Product(obj);
      });
    }
    throw new MError(resjson);
  }

  return {
    getProducts,
    getProductsById,
    updateProduct,
    newProduct,
    removeProduct,
    getPromo,
    getBestSellers
  };
}