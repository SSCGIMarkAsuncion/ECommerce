import mongoose from "mongoose";
import { ObjectId } from "mongodb";
import { COLLECTIONS } from "../mongodb.js";
import { Cart, Checkout } from "./carts.js";
import { Product } from "./products.js";

export function createOrder(tokenPayload, cart, checkoutBody) {
  const co = new Checkout(cart.products);
  const order = new Order({
    user: new ObjectId(String(tokenPayload.id)),
    cart: cart._id,
    payMethod: checkoutBody.payment_method,
    amount: co.total,
    shippingInfo: {
      fullName: checkoutBody.full_name,
      email: checkoutBody.email_address,
      phoneNumber: checkoutBody.phone_number,
      address: checkoutBody.address_line_1,
      area: checkoutBody.admin_area_2,
      postalCode: checkoutBody.postal_code
    }
  });
  return order;
}

export const ShippingInfoSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    default: ""
  }, 
  phoneNumber: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  area: {
    type: String,
    required: true
  },
  postalCode: {
    type: String,
    default: ""
  }
}, { _id: false });

export const OrderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
    ref: "user",
    required: true
  },
  cart: {
    type: mongoose.Types.ObjectId,
    ref: "cart",
    required: true
  },
  payMethod: {
    type: String,
    enum: ["paypal", "cod"],
    required: true
  },
  shippingInfo: {
    type: ShippingInfoSchema,
    required: true
  },
  result: {
    type: mongoose.Schema.Types.Mixed
  },
  amount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: [
      "pending",
      "processing",
      "shipped",
      "delivered",
      "completed",
      "cancelled",
      "failed",
    ],
    default: "pending"
  }
}, { timestamps: true });

OrderSchema.pre("findOneAndUpdate", async function(next) {
  const { cart: fcart } = this.getFilter();
  const { status } = this.getUpdate();

  if (status !== "processing") return next();

  if (!fcart) {
    return next(new Error("Order.cart id is not provided in filter"));
  }

  const cart = await Cart.findById(fcart).populate("products.id");
  if (!cart) return next(new Error("Cart does not exist on this order"));

  console.log(cart.products);
  const bulkOps = cart.products.map((cartItem) => {
    const amount = cartItem.amount;
    // id here is populated
    const { _id } = cartItem.id;

    return {
      updateOne: {
        filter: { _id },
        update: { $inc: { stocks: -amount }},
      }
    }
  });

  try {
    const opResults = await Product.bulkWrite(bulkOps, { throwOnValidationError: true });
    console.log("ProductBulkWrite", JSON.stringify(opResults, null, 2));
  }
  catch (e) {
    console.log("OrderSchema.pre(findOneAndUpdate)", e);
    return next(new Error("An error occurred updating Product information"));
  }

  next();
});

export const Order = mongoose.model("order", OrderSchema, COLLECTIONS.ORDERS);