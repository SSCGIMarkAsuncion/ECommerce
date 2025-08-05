import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { Product, ProductFilterPresets, type ProductFilterQuery, productFilterQueryBuild, productFilterQueryFrom } from "../Models/Product";
import useProducts from "../Hooks/useProducts";
import { useSearchParams } from "react-router";

export interface Filter {
  filter: string,
  tags: string[]
};

export interface ProductDispatcher {
  loading: boolean,
  filterPreset: React.RefObject<ProductFilterPresets>
  filter: ProductFilterQuery,
  setFilter: React.Dispatch<React.SetStateAction<ProductFilterQuery>>
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
  const { getProducts, getFilterPresets } = useProducts();

  const [ loading, setLoading ] = useState(false);
  const [ searchParams, setSearchParams ] = useSearchParams();
  const [ product, setProduct ] = useState<Product[]>([]);

  const filterPreset = useRef(ProductFilterPresets.empty());
  const [filter, setFilter] = useState(productFilterQueryFrom(searchParams));

  useEffect(() => {
    setLoading(true);
    async function a() {
      // console.log("FILTER", filter);
      try {
        setSearchParams(`?${productFilterQueryBuild(filter)}`)
        const products = await getProducts(filter);
        setProduct(products);
      }
      catch (e) {
        console.log("ProductProvider::ERR", e);
      }
      setLoading(false);
    }
    a();
  }, [filter]);

  useEffect(() => {
    async function a() {
      try {
        const preset = await getFilterPresets();
        filterPreset.current = preset;
      }
      catch (e) {
        console.log("ERR", e);
      }
    }
    a();
  }, []);

  return <ProductContext.Provider value={product}>
    <ProductDispatcherContext.Provider value={{
      loading,
      filterPreset,
      filter,
      setFilter
    }}>
      {children}
    </ProductDispatcherContext.Provider>
  </ProductContext.Provider>
}