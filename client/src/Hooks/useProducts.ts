import type { Product } from "../Models/Product";

export default function useProducts() {
  const getProducts = (query: string[], filters: string[]) => {
    return [] as Product[];
  };

  const getProductsById = (id: string) => {
    return {} as Product;
  };

  const updateProduct = (id: string, update: Product) => {
    return null;
  }

  const newProduct = (product: Product) => {
    return null;
  }

  return {
    getProducts,
    getProductsById,
    updateProduct,
    newProduct
  };
}