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
  discount: {
    type: Number,
    required: false,
    validate: {
      validator: function(v) {
        return v >= 0 && v <= 100;
      },
      message: _props => "discount must be between 0 and 100"
    },
    default: 0
  },
  imgs: {
    type: [String],
    validate: {
      validator: function(v) {
        return v.length >= 1
      },
      message: _ => `Must contain at least 1 Image`
    },
  },
  tags: {
    type: [String],
  },
}, { timestamps: true });

export const Product = mongoose.model("product", ProductSchema, COLLECTIONS.PRODUCTS);