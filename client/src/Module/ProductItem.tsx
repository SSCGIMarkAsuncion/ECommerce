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
import { ButtonCart } from "../Components/CartButton";

import Price from "../Components/Price";
import Gallery from "../Components/Gallery";
import NoResults from "../Components/NoResults";
import Button from "../Components/Button";

export default function MProductItem() {
  const { id } = useParams();
  const { getProductById } = useProducts();
  const [ product, setProduct ] = useState<Product | null>(null);
  const notify = useNotification();
  const [ loading, setLoading ] = useState(true);

  useEffect(() => {
    async function a() {
      setLoading(true);
      try {
        const product = await getProductById(id as string)
        if (product == null) throw new MError("Product does not exist");
        setProduct(product);
      }
      catch (e) {
        notify("error", ( e as MError ).toErrorList().join('\n'));
      }
      setLoading(false);
    }
    a();
  }, []);

  return <>
    <NavbarOffset />
    <div hidden={!loading && !product} className="min-h-[70svh] p-4 w-full md:w-[96%] mx-0 md:mx-auto grid grid-cols-1 md:grid-cols-2 gap-2">
      { !product?
        <Skeleton className="bg-primary-300"/>:
        <>
          <Gallery links={product.imgs} />
        </>
      }
      { !product?

        <ProductLoading />:
        <div className="fraunces-regular p-4 text-primary-900">
          <h1 className="text-xl font-semibold md:text-3xl tracking-wide ">{product.name}</h1>
          <div className="flex gap-1 text-xs">
          {
            product.tags.map((tag) => {
              return <Pill key={tag}>{tag}</Pill>;
            })
          }
          </div>
          <Price className="text-3xl" price={product.price} promoPrice={product.discount} />
          <p className="text-sm mt-4">Details:</p>
          <p className="text-md md:text-lg">{product.description}</p>
          <ButtonCart product={product} className="mt-8 w-full md:w-[40%]" />
        </div>
      }
    </div>
    {
      !loading && 
      <div hidden={Boolean(product)} className="min-h-[80vh] p-8 flex flex-col gap-4 items-center justify-center">
        <NoResults title="This Product Id does not exist." />
        <Button href="/products">Go Back</Button>
      </div>
    }
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