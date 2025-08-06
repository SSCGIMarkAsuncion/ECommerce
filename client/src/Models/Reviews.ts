import { Product } from "./Product";
import User from "./User";

export interface ReviewSummary {
  averageRating: number,
  count: number
};

export class Review {
  user: User;
  comment: string;
  to: Product | null;
  rate: number;

  constructor(obj: any) {
    this.user = obj.user? new User(obj.user):User.empty();
    this.comment = obj.comment;
    this.to = obj.to? new Product(obj.to):null;
    this.rate = Number(obj.rate);
  }

  static from(f: FormData) {
    return new Review({
      user: null,
      comment: f.get("comment") || "",
      to: { _id: f.get("to") || "" },
      rate: Number(f.get("rate"))
    });
  };

  toJson() {
    const copy = { ...this };
    if (copy.to)
      // set Review.to to id of product for db insertion
      // @ts-ignore
      copy.to = copy.to.id;
    return JSON.stringify(copy);
  }

  static createSummary(reviews: Review[]) {
    const summary = {
      averageRating: 0,
      count: 0
    } as ReviewSummary;

    if (reviews.length == 0) return summary;

    reviews.forEach((review) => {
      summary.count++;
      summary.averageRating+=review.rate;
    });
    summary.averageRating = summary.averageRating/summary.count;

    return summary;
  }
};

