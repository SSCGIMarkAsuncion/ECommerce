import { useEffect, useState, type HTMLProps } from "react"
import type { Product } from "../Models/Product"
import { Card } from "./Card"
import Img from "./Img"
import Price from "./Price"
import { ButtonCart } from "./CartButton"
import { useNavigate } from "react-router"
import { Theme } from "../Utils/Theme"
import useReviews from "../Hooks/useReviews"
import { Review, type ReviewSummary } from "../Models/Reviews"
import Rating from "./Rating"

export interface ProductItemProps extends HTMLProps<HTMLDivElement> {
  product: Product
};

export function ProductItem({ product, ...props}: ProductItemProps) {
  const navigation = useNavigate();
  const { getReviewsOf } = useReviews();
  const [ review, setReview ] = useState({
    reviews: [] as Review[],
    summary: {} as ReviewSummary
  });

  useEffect(() => {
    async function a() {
      try {
        const reviews =  await getReviewsOf(product);
        setReview({
          reviews: reviews,
          summary: Review.createSummary(reviews)
        });
      }
      catch (e) {
        console.log("ProductItem::ERR", e);
      }
    }
    a();
  }, []);

  return <Card {...props} className={`w-full flex flex-col animate-appear relative`} onClick={(e) => {
    e.stopPropagation();
    navigation(`/product/${product.id}`);
  }}>
    <Img src={product.imgs[0]} className="w-full h-[100px] sm:h-[200px] object-cover border-2 border-primary-900"/>
    <div className="fraunces-regular p-2 text-sm flex flex-col flex-1 gap-1">
      <p className="text-wrap text-primary-950">{product.name}</p>
      <Rating rate={review.summary.averageRating} starClass="size-4" />
      <p className="text-wrap text-xs text-primary-950/80">Stock: {product.stocks}</p>
      <div className="mt-auto">
        <Price price={product.price} promoPrice={product.discount} promoTextSize="text-xs" className="font-medium text-right"/>
        <ButtonCart product={product} className="justify-between" />
      </div>
    </div>
    {
      product.discount > 0 &&
      <div className="w-max px-2 flex items-center justify-center bg-primary-900 text-white fraunces-regular absolute top-2 left-2 shadow-sm/75 shadow-black">
        <p className="my-auto font-light">{product.discount}% off</p>
      </div>
    }
    {
      product.stocks == 0 &&
      <div className={`absolute top-0 left-0 bg-gray-600/50 flex items-center justify-center w-full h-full ${Theme.rounded}`}>
        <div className={`px-2 py-1 bg-primary-900 ${Theme.rounded} text-white w-max`}>Out of stock</div>
      </div>
    }
  </Card>
}