import type { Product } from "../Models/Product";
import { Review } from "../Models/Reviews";
import { MError } from "../Utils/Error";

const api = import.meta.env.VITE_API;

export default function useReviews() {
  const url = `${api}/reviews`;
  const getTestimonials = async () => {
    const res = await fetch(`${url}/testimony`);

    const resjson = await res.json();
    if (res.status >= 200 && res.status <= 399) {
      const l = (resjson as any[]).map((item) => new Review(item));
      return l;
    }
    throw new MError(resjson);
  }

  const getReviewsOf = async (product: Product) => {
    const res = await fetch(`${url}/${product.id}`);

    const resjson = await res.json();
    if (res.status >= 200 && res.status <= 399) {
      const l = (resjson as any[]).map((item) => new Review(item));
      return l;
    }
    throw new MError(resjson);
  };

  const postReview = async (review: Review) => {
    const res = await fetch(`${url}/submit`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: review.toJson()
    });

    const resjson = await res.json();
    if (res.status >= 200 && res.status <= 399) {
      return new Review(resjson);
    }
    throw new MError(resjson);
  };

  return {
    getTestimonials,
    getReviewsOf,
    postReview
  };
}