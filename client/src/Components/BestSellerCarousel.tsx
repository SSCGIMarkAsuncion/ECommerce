import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { CarouselBreakpoints, Theme } from '../Utils/Theme';
import type { Product } from '../Models/Product';
import { useCallback } from 'react';
import Button from './Button';

export default function BestSeller({ products }: { products: Product[] }) {
  const responsive = CarouselBreakpoints;
  if (products.length < 4) {
    responsive.desktop.items = products.length;
  }
  if (products.length < 3) {
    responsive.tablet.items = products.length;
  }
  if (products.length < 2) {
    responsive.mobile.items = products.length;
  }

  return <Carousel
    swipeable={true}
    draggable={false}
    showDots={false}
    ssr={true}
    infinite={true}
    transitionDuration={500}
    containerClass="w-full min-h-[300px]"
    itemClass="h-full min-h-[inherit]"
    // removeArrowOnDeviceType={["tablet", "mobile"]}
    responsive={responsive}>
    {
      (!products || products.length == 0)?
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
        <Button className="fraunces-regular w-full mt-auto text-sm">Add to cart</Button>
        </div>
      </>
    }
  </div>
}