import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { CarouselBreakpoints, Theme } from '../Utils/Theme';
import type { Product } from '../Models/Product';
import { useCallback } from 'react';
import { Card } from './Card';
import Price from './Price';
import Img from './Img';
import { useNavigate } from 'react-router';

export default function BestSeller({ products, isLoaded = false }: { products: Product[], isLoaded?: boolean }) {
  const responsive = CarouselBreakpoints;

  if (isLoaded && products && products.length == 0) {
    return <div
     className={`w-full bg-primary-200 border-primary-300 text-primary-600 *:fill-primary-600 border-1 p-8 text-xl text-center animate-appear flex flex-col gap-4 items-center justify-center fraunces-regular font-medium ${Theme.rounded}`}>
      <div>
        <div className="flex gap-2 mt-2 justify-center text-sm">
          <p>No Best Seller Right Now</p>
        </div>
      </div>
    </div>
  }
  return <Carousel
    swipeable={true}
    draggable={false}
    showDots={false}
    ssr={true}
    infinite={false}
    transitionDuration={500}
    containerClass="w-full"
    itemClass="my-auto"
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
  const navigation = useNavigate();
  const onOpen = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (product)
      navigation(`/product/${product.id}`);
  }, []);

  return <Card className={`${product? "":"animate-pulse"} mx-2`}
    onClick={onOpen}>
    {
      product &&
      <>
        <Img src={product?.imgs[0]} className="w-full aspect-square object-cover" />
        <div className="p-2 fraunces-regular h-[100px] flex flex-col">
          <Price price={product.price} promoPrice={product.discount} className="text-lg" />
          <p className="text-primary-900 text-md">{product.name}</p>
          {/* <ButtonCart product={product}/> */}
        </div>
      </>
    }
  </Card>
}
