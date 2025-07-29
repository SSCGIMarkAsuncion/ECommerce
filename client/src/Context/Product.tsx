import { createContext, useContext, useEffect, useState, type HTMLProps, type ReactNode } from "react";
import { Product } from "../Models/Product";
import useProducts from "../Hooks/useProducts";

export const QUERY_BOOL_PROMO = "promo";
export const QUERY_BOOL_BESTSELLER = "bestseller";
export const QUERY_STR_FILTER = "q";
export const QUERY_STR_DATE = "date";
export const QUERY_STR_PRICE = "price";

export interface Filter {
  filter: string,
  tags: string[]
};

export interface ProductDispatcher {
  loading: boolean,
  setFilter: React.Dispatch<React.SetStateAction<Filter>>,
};

const ProductContext = createContext<Product[]>([]);
const ProductDispatcherContext = createContext<ProductDispatcher>(null!);

export function useProductContext() {
  return {
    products: useContext(ProductContext),
    productdispatcher: useContext(ProductDispatcherContext)
  };
}

export function ProductContextProvider({ children }: { children: ReactNode }) {
  const { getProducts } = useProducts();

  const [ loading, setLoading ] = useState(false);
  const [ product, setProduct ] = useState<Product[]>([]);
  // unused
  const [ filter, setFilter ] = useState<Filter>({
    filter: "",
    tags: []
  });

  useEffect(() => {
    setLoading(true);
    async function a() {
      try {
        const products = await getProducts([], [filter.filter]);
        setProduct(products);
      }
      catch (e) {
        console.log("ProductProvider::ERR", e);
      }
      setLoading(false);
    }
    a();
  }, [filter]);

  return <ProductContext.Provider value={product}>
    <ProductDispatcherContext.Provider value={{
      loading,
      setFilter
    }}>
      {children}
    </ProductDispatcherContext.Provider>
  </ProductContext.Provider>
}