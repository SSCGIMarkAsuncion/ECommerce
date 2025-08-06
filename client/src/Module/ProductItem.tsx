import { useParams } from "react-router";
import Footer from "../Components/Footer";
import Navbar, { NavbarOffset } from "../Components/Navbar";
import useProducts from "../Hooks/useProducts";
import { useCallback, useEffect, useState } from "react";
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
import useReviews from "../Hooks/useReviews";
import { Review, type ReviewSummary } from "../Models/Reviews";
import Rating from "../Components/Rating";
import { useUserContext } from "../Context/User";
import { Theme } from "../Utils/Theme";
import A from "../Components/A";
import Avatar from "../Components/Avatar";
import { TextArea } from "../Components/Input";
import { Card } from "../Components/Card";

export default function MProductItem() {
  const { id } = useParams();
  const { getProductById } = useProducts();
  const { getReviewsOf } = useReviews();
  const [ product, setProduct ] = useState<Product | null>(null);
  const notify = useNotification();
  const [ review, setReview ] = useState({
    reviews: [] as Review[],
    summary: {} as ReviewSummary
  })
  const [ loading, setLoading ] = useState(true);

  const loadReviews = async (product: Product) => {
    const reviews = await getReviewsOf(product);
    setReview({
      reviews: reviews,
      summary: Review.createSummary(reviews)
    });
  };

  useEffect(() => {
    async function a() {
      setLoading(true);
      try {
        const product = await getProductById(id as string)
        if (product == null) throw new MError("Product does not exist");
        setProduct(product);

        loadReviews(product);
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

          <div className="flex gap-2 items-center my-2">
            <Rating rate={review.summary.averageRating} starClass="size-4" />
            <p className="text-xs">{review.summary.count}</p>
          </div>

          <Price className="text-3xl" price={product.price} promoPrice={product.discount} />
          <p className="text-sm">Stock: {product.stocks}</p>
          <p className="text-sm mt-4">Details:</p>
          <p className="text-md md:text-lg">{product.description}</p>
          <ButtonCart product={product} className="mt-8 w-full md:w-[40%]" />
          <div className="mt-12">
            <CReview product={product} reviews={review.reviews} onPost={() => {
              loadReviews(product);
            }} />
          </div>
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

function CReview({ product, reviews, onPost }: { product: Product, reviews: Review[], onPost: () => void }) {
  return <>
    <h1 className="text-2xl mb-4 font-semibold text-primary-900">Reviews</h1>
    <ReviewEditor product={product} onPost={onPost} />
    <ReviewList reviews={reviews} />
  </>
}

interface ReviewEditorProps {
  product: Product,
  onPost?: () => void
};

function ReviewEditor({ product, onPost }: ReviewEditorProps) {
  const { user } = useUserContext();
  const { postReview } = useReviews();
  const [ rate, setRate ] = useState(0);

  if (!user) {
    return <div className={`${Theme.rounded} fraunces-regular border-1 border-primary-400 bg-primary-200 text-primary-500 text-center py-4`}>
      <p><A href="/login" className="text-primary-800!">Login</A> first to post a review.</p>
    </div>
  }

  const onSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    const form = e.currentTarget as HTMLFormElement;
    const fdata = new FormData(form);
    const review = Review.from(fdata);

    await postReview(review);
    if (onPost)
      onPost();
    const commentEl = form.elements.namedItem("comment") as HTMLTextAreaElement | null;
    if (commentEl) commentEl.value = "";
    setRate(0);
  }, []);

  return <div>
    <Avatar user={user} avatarClass="size-8 text-lg" withName />
    <form onSubmit={onSubmit}>
      <Rating rate={rate}
       editable
       className="my-1"
       starClass="size-4"
       onRateChange={(newRate) => {
        setRate(newRate);
       }} />
      <input type="hidden" name="rate" value={rate} />
      <input type="hidden" name="to" value={product.id} />
      <TextArea id="comment" rows={5} className="my-2" required placeholder="..." />
      <Button type="submit">Post</Button>
    </form>
  </div>
}

function ReviewList({ reviews }: { reviews: Review[] }) {
  return <div className="flex flex-col gap-2 mt-2">
    <p className="text-sm">{reviews.length} review/s</p>
    {
      reviews.map((review) => <ReviewItem review={review} />)
    }
  </div>;
}

function ReviewItem({ review }: { review: Review }) {
  return <Card className="p-2 mb-2">
    <Avatar user={review.user} avatarClass="size-8 text-lg" withName />
    <Rating rate={review.rate} starClass="size-4" />
    <div className={`p-2 ${Theme.rounded}`}>
      {review.comment}
    </div>
  </Card>
}