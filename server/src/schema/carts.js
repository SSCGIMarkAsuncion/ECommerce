import mongoose, { mongo } from "mongoose";
import { COLLECTIONS } from "../mongodb.js";

export const CartItemSchema = new mongoose.Schema({
  id: {
    type: mongoose.Types.ObjectId,
    ref: "product",
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  // product: {
  //   type: mongoose.Types.ObjectId,
  //   ref: "product",
  //   required: false,
  //   default: undefined
  // }
}, {_id: false});

/**
 * @param {any[]} items is CartItem with id(product) populated
 * @returns {any[]}
 */
export function mapCartItems(items) {
  return items.map((item) => {
    return {
      id: item.id._id,
      amount: item.amount,
      product: item.id
    }
  });
}

export const CartSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Types.ObjectId,
    ref: "user",
    required: true
  },
  products: {
    type: [CartItemSchema],
    required: true
  },
  status: {
    type: String,
    enum: ["done", "cart"],
    default: "cart"
  }
}, { timestamps: true });

export const Cart = mongoose.model("cart", CartSchema, COLLECTIONS.CARTS);