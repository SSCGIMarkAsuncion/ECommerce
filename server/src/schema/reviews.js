import mongoose from "mongoose";
import { COLLECTIONS } from "../mongodb.js";

export const ReviewsSchema = new mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
    ref: "user",
    required: true
  },
  comment: {
    type: String,
    required: true
  },
  to: {
    type: mongoose.Types.ObjectId,
    ref: "product",
    required: false,
    default: null
  },
  rate: {
    type: Number,
    required: true,
    validate: {
      validator: (v) => {
        return v >= 0 && v <= 5;
      },
      message: _ => "rating can only be between 0 - 5"
    }
  }
}, { timestamps: true });

export const Review = mongoose.model("review", ReviewsSchema,COLLECTIONS.REVIEWS);