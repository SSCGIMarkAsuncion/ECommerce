import { dummyPromoProducts, type Product } from "../Models/Product";

export default function usePromo() {
  const getPromo = async (): Promise<Product[]> => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    return dummyPromoProducts;
  };

  const getBestSellers = async (): Promise<Product[]> => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    return dummyPromoProducts;
  }

  return {
    getPromo,
    getBestSellers
  };
}