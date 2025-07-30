import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { CarouselBreakpoints } from '../Utils/Theme';
import type { Product } from '../Models/Product';
import { useCallback } from 'react';
import { ButtonCart } from './CartButton';
import { Card } from './Card';
import Price from './Price';

export default function BestSeller({ products }: { products: Product[] }) {
  const responsive = CarouselBreakpoints;

  return <Carousel
    swipeable={true}
    draggable={false}
    showDots={false}
    ssr={true}
    infinite={false}
    transitionDuration={500}
    containerClass="w-full h-[450px]"
    itemClass="my-auto"
    // removeArrowOnDeviceType={["tablet", "mobile"]}
    responsive={responsive} >
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
    // console.log("Open item", product);
  }, []);

  return <Card className={`${product? "":"animate-pulse"} mx-2`}
    onClick={onOpen}>
    {
      product &&
      <>
        <img src={product?.imgs[0]} alt="/Logo.svg" className="w-full aspect-square object-cover" />
        <div className="p-2 md:p-3">
          <p className="fraunces-regular text-md text-primary-950 font-medium">{product.name}</p>
          <Price price={product.price} promoPrice={product.discount} className="mt-4 font-medium" />
          <ButtonCart product={product}/>
        </div>
      </>
    }
  </Card>
}