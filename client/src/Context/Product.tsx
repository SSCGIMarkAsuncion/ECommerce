import { createContext, useContext, useEffect, useState, type HTMLProps, type ReactNode } from "react";
import { Product } from "../Models/Product";
import useProducts from "../Hooks/useProducts";
import { useSearchParams } from "react-router";

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
  const [ searchParams, _ ] = useSearchParams();
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
        const filter = searchParams.get(QUERY_STR_FILTER) || "";
        const tags = [];
        const isPromo = searchParams.get(QUERY_BOOL_PROMO) == '1';
        if (searchParams.get(QUERY_BOOL_BESTSELLER) == '1')
          tags.push("best seller");

        const products = await getProducts(tags, [filter], isPromo);
        setProduct(products);
      }
      catch (e) {
        console.log("ProductProvider::ERR", e);
      }
      setLoading(false);
    }
    a();
  }, [searchParams]);

  return <ProductContext.Provider value={product}>
    <ProductDispatcherContext.Provider value={{
      loading,
      setFilter
    }}>
      {children}
    </ProductDispatcherContext.Provider>
  </ProductContext.Provider>
}