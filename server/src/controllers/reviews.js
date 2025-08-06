import { Review } from '../schema/reviews.js';
import { ObjectId } from 'mongodb';

/** 
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export async function GetTestimony(req, res) {
  const reviews = await Review.find({
     to: null,
     rate: { $gte: 4 }
    }).sort({ updatedAt: -1 }).populate("user");

  res.status(200).json(reviews);
}

/** 
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export async function PostReview(req, res) {
  req.body.user = new ObjectId(String(req.tokenPayload.id));
  const review = new Review(req.body);
  await review.save({ validateBeforeSave: true });

  res.status(200).json(review);
}

/** 
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export async function GetReviewOfProduct(req, res) {
  const productId = new ObjectId(req.params.id);

  const docs = await Review.find({
    to: productId
  });

  return res.status(200).json(docs);
}