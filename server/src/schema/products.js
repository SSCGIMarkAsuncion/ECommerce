import mongoose from "mongoose";
import { COLLECTIONS } from "../mongodb.js";

export const ProductSchema = new mongoose.Schema({
  name: {
    required: true,
    type: String
  },
  description: String,
  price: {
    type: Number,
    required: true
  },
  salePrice: {
    type: Number,
    required: false,
    default: 0
  },
  imgs: {
    type: [String],
    validate: {
      validator: function(v) {
        return v.length >= 1
      },
      message: _ => `products.imgs must contain at least 1 image`
    },
  },
  tags: {
    type: [String],
  },
}, { timestamps: true });

export const Product = mongoose.model("product", ProductSchema, COLLECTIONS.PRODUCTS);