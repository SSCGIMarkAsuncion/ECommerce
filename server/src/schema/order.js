import mongoose from "mongoose";
import { ObjectId } from "mongodb";
import { COLLECTIONS } from "../mongodb.js";

export function createOrder(tokenPayload, cart, checkoutBody) {
  const order = new Order({
    user: new ObjectId(String(tokenPayload.id)),
    cart: cart._id,
    payMethod: checkoutBody.payment_method,
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

export const Order = mongoose.model("order", OrderSchema, COLLECTIONS.ORDERS);