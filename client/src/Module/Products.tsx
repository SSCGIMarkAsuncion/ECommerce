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
import { Theme } from "../Utils/Theme";
import SearchIcon from "../assets/Search.svg"

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
    <Navbar type="product" />
    <Footer />
  </>;
}

function ProductView() {
  const {
    products,
    productdispatcher: { loading }
  } = useProductContext();

  if (loading) {
    return <Loading>Loading Products</Loading>
  }

  return<>
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2">
      {
        products.map((product) => {
          return <ProductItem key={product.id} product={product} />
        })
      }
    </div>
    { products.length == 0 && <NoResults /> }
  </>
}

export interface ProductItemProps extends HTMLProps<HTMLDivElement> {
  product: Product
};

function ProductItem({ product, ...props}: ProductItemProps) {
  return <Card {...props} className="w-full flex flex-col animate-appear relative">
    <img src={product.imgs[0]} alt="/Logo.svg" className="w-full h-[100px] md:h-[200px] object-cover"/>
    <div className="p-2 text-sm flex flex-col flex-1 gap-4">
      <p className="text-wrap fraunces-regular text-primary-950">{product.name}</p>
      <div className="mt-auto">
        <Price price={product.price} promoPrice={product.discount} promoTextSize="text-xs" className="font-medium text-right"/>
        <ButtonCart product={product} />
      </div>
    </div>
    {
      product.discount > 0 &&
      <div className="aspect-square w-8 flex items-center justify-center bg-primary-900 text-white absolute top-2 left-2 shadow-sm/75 shadow-black">
        <p className="my-auto font-bold">%</p>
      </div>
    }
  </Card>
}

function NoResults() {
  return <div
   className={`w-full bg-primary-200 border-primary-300 text-primary-600 *:fill-primary-600 border-1 p-8 text-xl text-center animate-appear flex flex-col gap-4 items-center justify-center fraunces-regular font-medium ${Theme.rounded}`}>
    <img src={SearchIcon} className="size-20"/>
    <div>
      <p className="mt-2">No Results Found</p>
      <p className="text-primary-500 text-sm">We can't find any item matching your search</p>
    </div>
  </div>
}