import MError from '../error.js';
import { Cart, Checkout, mapCartItems } from '../schema/carts.js';
import { Product } from '../schema/products.js';
import { ObjectId } from "mongodb";
import { Paypal } from "../utils/paypal.js";
import { createOrder, Order } from '../schema/order.js';

/*
  param:
    :id = id of product
  query
    amount = defaults to 1
*/
/** 
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export async function PutCart(req, res) {
  /*** @type {string} */
  const uid = new ObjectId(String(req.tokenPayload.id));
  const idProduct = new ObjectId(req.params.id);

  const product = await Product.findById(idProduct);
  if (product == null) {
    throw new MError(404, "Product Id does not exist");
  }

  if (product.stocks <= 0) {
    throw new MError(400, "Product has 0 stocks");
  }

  let amount = 1;
  try {
    amount = Number(req.query.amount);
  }
  catch {
    throw new MError(400, "amount must be a number");
  }

  if (amount > product.stocks) throw new MError(400, "Cannot set amount. The stocks is less than the requested amount.")

  const cart = await Cart.findOne({
    owner: uid,
    status: "cart"
  }).sort({ updatedAt: -1 }).lean().exec();

  if (cart == null) {
    let newCart = null
    try {
      newCart = new Cart({
        owner: uid,
        products: [
          {
            id: idProduct,
            amount
          }
        ]
      });
      await newCart.save();
    }
    catch (e) {
      console.log("PutCart::ERR", e);
      throw new MError(400, "Error occured when creating cart");
    }
    return res.status(200).send(newCart);
  }

  const cartitemIndex = cart.products.findIndex((item) => item.id.toString() === idProduct.toString());
  if (cartitemIndex >= 0) {
    cart.products[cartitemIndex].amount = amount;
  }
  else {
    // Push new CartItem
    cart.products.push({
      id: idProduct,
      amount: amount
    });
  }
  cart.products = cart.products.filter((item) => item.amount > 0);

  let updatedCart = null;
  try {
    updatedCart = await Cart.findByIdAndUpdate(
      cart._id,
      { products: cart.products },
      { new: true, runValidators: true}
    );
  }
  catch (e) {
    console.log("PutCart::ERR", e);
    throw new MError(404, "Error occured when updating cart.");
  }

  res.status(200).json(updatedCart);
}

/** 
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export async function GetCart(req, res) {
  const uid = new ObjectId(String(req.tokenPayload.id));
  const withProduct = req.query.withProduct == '1';

  const cartQ = Cart.findOne({
    owner: uid,
    status: "cart"
  }).sort({ updatedAt: -1 });

  if (withProduct) {
    cartQ.populate("products.id");
  }

  const cart = await cartQ.lean().exec();
  if (cart == null) {
    return res.status(200).json(null);
  }

  if (withProduct) {
    const newProducts = mapCartItems(cart.products);
    cart.products = newProducts;
  }

  return res.status(200).json(cart);
}

/** 
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export async function GetBreakdown(req, res) {
  const uid = new ObjectId(String(req.tokenPayload.id));

  const cart = await Cart.findOne({
    owner: uid,
    status: "cart"
  }).sort({ updatedAt: -1 })
    .populate("products.id")
    .lean().exec();

  if (!cart) {
    throw new MError(400, "No Cart for this user.");
  }
  const checkout = new Checkout(cart.products);
  return res.status(200).json(checkout);
}

class CheckoutBody {
  full_name = "";
  email_address = "";
  phone_number = "";
  address_line_1 = "";
  admin_area_2 = "";
  postal_code = "";
  payment_method = "";

  constructor(obj) {
    this.full_name = obj.full_name;
    this.email_address = obj.email_address;
    this.phone_number = obj.phone_number;
    this.address_line_1 = obj.address_line_1;
    this.admin_area_2 = obj.admin_area_2;
    this.postal_code = obj.postal_code;
    this.payment_method = obj.payment_method;
  }

  validate() {
    // email_address and postal_code is optional
    if (!this.payment_method || !["cod", "paypal"].includes(this.payment_method))
      throw new MError(400, "payment_method is not defined or is not valid");

    if (!this.full_name || !this.phone_number || !this.address_line_1 || !this.admin_area_2)
      throw new MError(400, "Missing required fields");
  }
};

/** 
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export async function PostCheckout(req, res) {
  const uid = new ObjectId(String(req.tokenPayload.id));
  const body = new CheckoutBody(req.body);

  body.validate();

  const cart = await Cart.findOne({
    owner: uid,
    status: "cart"
  }).sort({ updatedAt: -1 });

  if (!cart) throw new MError(400, "No Cart found");

  cart.status = "processing";

  if (body.payment_method == "paypal") {
    const paypalCreateOrder = Paypal.createOrder(cart, req.body);
    await cart.save({ validateBeforeSave: true });
    return res.status(200).json(paypalCreateOrder);
  }
  // cod
  const order =  createOrder(req.tokenPayload, cart, body);
  await order.save({ validateBeforeSave: true });
  await cart.save({ validateBeforeSave: true });

  return res.status(200).json(order);
}

class CheckoutResults {
  orderId = "";
  payerId = "";
  status = "";
  message = "";
}

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export async function GetCheckoutFinished(req, res) {
}