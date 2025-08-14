import mongoose, { mongo } from "mongoose";
import { COLLECTIONS } from "../mongodb.js";
import { Order } from "./order.js";

export class Checkout {
  /** @type {({ id: any, amount: number })[]} */
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
      // console.log(product.stocks, cartItem.amount);
      if (product.stocks < cartItem.amount) {
        return;
      }
      const rate = (100-this.vatRate)/100;
      if (product.discount && product.discount >= 0) {
        const percent = 1 - (product.discount / 100);
        const discountedPrice = Math.trunc(product.price * percent * 100) / 100;

        this.subtotal += (discountedPrice * rate) * cartItem.amount;
        this.total += discountedPrice * cartItem.amount;
      }
      else {
        this.subtotal += (product.price * rate) * cartItem.amount;
        this.total += product.price * cartItem.amount;
      }
      this.vatAmount = 0; // unused
      this.itemsAmount += cartItem.amount;
    });
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
    enum: [
      "done",
      "cart",
      "processing"
    ],
    default: "cart"
  }
}, { timestamps: true });

CartSchema.pre("findOneAndDelete", async function(next) {
  const { _id } = this.getFilter();
  if (!_id) next(new Error("_id is missing from filter"));

  try {
    await Order.findOneAndDelete({ cart: _id });
  }
  catch (e) {
    console.log("CartSchema::findOneAndDelete", e);
  }

  next();
});

export const Cart = mongoose.model("cart", CartSchema, COLLECTIONS.CARTS);