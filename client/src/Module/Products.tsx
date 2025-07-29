import { type HTMLProps } from "react";
import Footer from "../Components/Footer";
import Navbar from "../Components/Navbar";
import { type Product } from "../Models/Product";
import Loading from "../Components/Loading";
import { Card } from "../Components/Card";
import { ButtonCart } from "../Components/CartButton";
import Price from "../Components/Price";
import { useProductContext } from "../Context/Product";
import { ProductFilter } from "../Components/ProductFilter";

export function Products() {
  return <>
    <div className="mt-[var(--appbar-height)] py-[66px] min-h-full w-full md:w-[90%] md:mx-auto">
      <ProductView />
    </div>
    <div className="fixed top-[var(--appbar-height)] h-[64px] left-0 bg-white w-full">
      <div className="mt-1 w-[98%] md:w-[80%] mx-auto fraunces-regular text-sm">
        <ProductFilter />
      </div>
    </div>
    <Navbar />
    <Footer />
  </>;
}

function ProductView() {
  const {
    products,
  } = useProductContext();

  if (products.length == 0) {
    return <Loading>Loading Products</Loading>
  }

  return <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2">
    {
      products.map((product) => {
        return <ProductItem key={product.id} product={product} />
      })
    }
  </div>
}

export interface ProductItemProps extends HTMLProps<HTMLDivElement> {
  product: Product
};

function ProductItem({ product, ...props}: ProductItemProps) {
  return <Card {...props} className="w-full flex flex-col animate-appear relative">
    <img src={product.imgs[0]} className="w-full h-[100px] md:h-[200px] object-cover"/>
    <div className="p-2 text-sm flex flex-col flex-1 gap-4">
      <p className="text-wrap fraunces-regular text-primary-950">{product.name}</p>
      <div className="mt-auto">
        {/* <Price price={product.price} promoPrice={product.salePrice} promoTextSize="text-xs" className="font-medium text-right"/> */}
        <ButtonCart product={product} >
          <Price price={product.price} promoPrice={product.salePrice} promoTextSize="text-xs" className="font-medium text-white"/>
        </ButtonCart>
      </div>
    </div>
    {
      product.salePrice &&
      <div className="aspect-square w-8 flex items-center justify-center bg-primary-900 text-white absolute top-2 left-2 shadow-sm/75 shadow-black">
        <p className="my-auto font-bold">%</p>
      </div>
    }
  </Card>
}