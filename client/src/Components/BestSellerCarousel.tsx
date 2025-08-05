import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { CarouselBreakpoints } from '../Utils/Theme';
import type { Product } from '../Models/Product';
import { useCallback } from 'react';
import { Card } from './Card';
import Price from './Price';
import Img from './Img';
import { useNavigate } from 'react-router';

export default function BestSeller({ products }: { products: Product[] }) {
  const responsive = CarouselBreakpoints;

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
        <div className="text-xs md:text-md p-2 fraunces-regular h-[100px] flex flex-col">
          <Price price={product.price} promoPrice={product.discount} className="font-medium" />
          <p className="text-primary-950 font-medium">{product.name}</p>
          {/* <ButtonCart product={product}/> */}
        </div>
      </>
    }
  </Card>
}