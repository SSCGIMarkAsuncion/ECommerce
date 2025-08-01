import { useParams } from "react-router";
import Footer from "../Components/Footer";
import Navbar, { NavbarOffset } from "../Components/Navbar";
import useProducts from "../Hooks/useProducts";
import { useEffect, useState } from "react";
import { Product } from "../Models/Product";
import { useNotification } from "../Context/Notify";
import { MError } from "../Utils/Error";
import Skeleton from "../Components/Skeleton";
import { Pill } from "../Components/Pill";
import Button from "../Components/Button";
import { ButtonCart } from "../Components/CartButton";

export default function MProductItem() {
  const { id } = useParams();
  const { getProductById } = useProducts();
  const [ product, setProduct ] = useState<Product | null>(null);
  const notify = useNotification();

  useEffect(() => {
    async function a() {
      try {
        const product = await getProductById(id as string)
        if (product == null) throw new MError("Product does not exist");
        setProduct(product);
      }
      catch (e) {
        notify("error", ( e as MError ).message)
      }
    }
    a();
  }, []);

  return <>
    <NavbarOffset />
    <div className="min-h-[70svh] p-4 w-full md:w-[96%] mx-0 md:mx-auto grid grid-cols-1 md:grid-cols-2 gap-2">
      <Skeleton className="bg-primary-300"/>
      { !product?

        <ProductLoading />:
        <div className="fraunces-regular">
          <h1 className="text-xl md:text-3xl tracking-wide">{product.name}</h1>
          <div className="flex gap-1">
          {
            product.tags.map((tag) => {
              return <Pill>{tag}</Pill>;
            })
          }
          </div>
          <p className="text-md md:text-lg mt-4">{product.description}</p>
          <ButtonCart product={product} className="mt-8 w-full md:w-[40%]" />
        </div>
      }
    </div>
    <Navbar type="product" />
    <Footer />
  </>
}

function ProductLoading() {
  return <div className="flex flex-col gap-1">
    <Skeleton className="bg-primary-300 h-[60px]" />
    <Skeleton className="bg-primary-300 h-[30px] w-[70%]" />
    <Skeleton className="bg-primary-300 h-[60px] mt-2" />

    <Skeleton className="bg-primary-300 w-[30%] aspect-[6/2] mt-8" />
  </div>
}