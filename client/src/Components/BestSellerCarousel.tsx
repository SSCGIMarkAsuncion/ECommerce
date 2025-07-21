import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { CarouselBreakpoints, Theme } from '../Utils/Theme';
import type { Product } from '../Models/Product';
import { useCallback } from 'react';
import { ButtonCart } from './CartButton';

export default function BestSeller({ products }: { products: Product[] }) {
  const responsive = CarouselBreakpoints;

  return <Carousel
    swipeable={true}
    draggable={false}
    showDots={false}
    ssr={true}
    infinite={false}
    transitionDuration={500}
    containerClass="w-full min-h-[300px]"
    itemClass="h-full min-h-[inherit]"
    // removeArrowOnDeviceType={["tablet", "mobile"]}
    responsive={responsive}>
    {
      (products.length == 0)?
      ((new Array(4)).fill(null)).map((_,i) => {
        return <BestSellerItem key={i} />
      })
      :products.map((product) => {
        return <BestSellerItem key={product.id} product={product} />
      })
    }
  </Carousel>;
}

export function BestSellerItem({ product }: { product?: Product }) {
  const onOpen = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    console.log("Open item", product);
  }, []);

  return <div className={`${product? "":"animate-pulse"} bg-zinc-50 min-h-[inherit] h-full mx-2 p-1 ${Theme.rounded}`}
   onClick={onOpen}>
    {
      product &&
      <>
        <img src={product?.imgs[0]} className="w-full aspect-square object-cover" />
        <div className="p-2 md:p-3">
        <h3 className="fraunces-regular text-md text-primary-950 font-medium">PHP {product.price}</h3>
        <p className="fraunces-regular text-md text-primary-950 font-medium text-center mb-8">{product.name}</p>
        <ButtonCart product={product}/>
        </div>
      </>
    }
  </div>
}