import MError from '../error.js';
import { Cart, Checkout, mapCartItems } from '../schema/carts.js';
import { Product } from '../schema/products.js';
import { ObjectId } from "mongodb";

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

  let amount = 1;
  try {
    amount = Number(req.query.amount);
  }
  catch {
    throw new MError(400, "amount must be a number");
  }

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