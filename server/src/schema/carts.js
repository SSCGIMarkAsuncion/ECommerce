import mongoose, { mongo } from "mongoose";
import { COLLECTIONS } from "../mongodb.js";

export class Checkout {
  /** @type {({ productId: string, price: number })[]} */
  products = [];
  subtotal = 0;
  vatRate = 12;
  vatAmount = 0;
  itemsAmount = 0;
  total = 0;

  /** @param {CartItemSchema[]} cartItems with populated id */
  constructor(cartItems) {
    this.products = cartItems;

    this.products.forEach((cartItem) => {
      const product = cartItem.id;
      // console.log(this.subtotal, product.price, product.discount);
      if (product.discount && product.discount >= 0) {
        const percent = 1 - (product.discount / 100);
        const discountedPrice = Math.trunc(product.price * percent * 100) / 100;
        this.subtotal += (discountedPrice * cartItem.amount);
      }
      else {
        this.subtotal += (product.price * cartItem.amount);
      }
      this.itemsAmount += cartItem.amount;
    });
    this.vatAmount = Math.trunc(this.subtotal * (this.vatRate / 100) * 100) / 100;
    this.total = this.subtotal + this.vatAmount;
  }
};

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