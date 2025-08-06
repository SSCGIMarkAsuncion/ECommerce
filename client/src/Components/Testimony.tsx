import Carousel from "react-multi-carousel";
import 'react-multi-carousel/lib/styles.css';
import useReviews from "../Hooks/useReviews";
import { useEffect, useState, type HTMLProps } from "react";
import { Review } from "../Models/Reviews";
import { Card } from "./Card";
import Rating from "./Rating";
import Skeleton from "./Skeleton";

export default function Testimonials() {
  const { getTestimonials } = useReviews();
  const [ loading, setLoading ] = useState(false);
  const [ testimonials, setTestimonials ] = useState<Review[]>([]);

  useEffect(() => {
    async function a() {
      setLoading(true);
      try {
        const v = await getTestimonials()
        setTestimonials(v);
      }
      catch (e) {
        console.log("Testimonials::ERR", e);
      }
      setLoading(false);
    }
    a();
  }, []);

  if (loading) {
    return <Skeleton className="h-[60svh] aspect-[5/3] bg-primary-200 mx-auto" />
  }

  return <Carousel
    swipeable={true}
    draggable={false}
    showDots={false}
    ssr={true}
    infinite={true}
    containerClass="mt-8"
    itemClass="my-auto"
    responsive={{
      all: {
        breakpoint: { max: 4000, min: 0 },
        items: 1
      }
    }} >
    {
      testimonials.map((item) => {
        return <TestimonyItem testimony={item} />;
      })
    }
  </Carousel>;
}

export interface TestimonyItemProps extends HTMLProps<HTMLDivElement> {
  testimony: Review
};

function TestimonyItem({ testimony, ...props }: TestimonyItemProps) {
  return <Card {...props} className={`fraunces-regular bg-primary-900! text-white p-12 aspect-[5/3] h-[60svh] mx-auto flex flex-col gap-1 ${props.className}`}>
    <div className="mb-6 flex-1 align-middle flex flex-col justify-center">
      <p className="text-center text-2xl px-2">{testimony.comment}</p>
    </div>
    <Rating 
      starClass="size-6"
      rate={testimony.rate} className="mx-auto" />
    <p className="text-center font-semibold text-lg tracking-wide">{testimony.user.username}</p>
 </Card>
}