import { ObjectId } from "mongodb";
import { Order } from "../schema/order.js";
import ROLES, { isAdmin } from "../utils/roles.js";
import MError from "../error.js";
import { mapCartItems } from "../schema/carts.js";

function validatePutOrderBody(tokenPayload, body) {
  if (body.user || body.cart || body.payMethod) {
    if (tokenPayload.role == ROLES.SUPERADMIN) {
      throw new MError(400, "Request needs to have SUPERADMIN permission");
    }
  }
}

/** 
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export async function PutOrder(req, res) {
  const orderId = new ObjectId(req.params.id);
  validatePutOrderBody(req.tokenPayload, req.body);

  const updated = await Order.findByIdAndUpdate(orderId, req.body);
  return res.status(200).json(updated);
}

/** 
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export async function GetOrders(req, res) {
  const opt = {};
  const populate = req.query.populate == '1';
  const self = req.query.self == '1'; // only relevant for admin

  if (self || !isAdmin(req.tokenPayload.role)) {
    opt._id = new ObjectId(String(req.tokenPayload.id));
  }

  let orders = [];
  if (populate) {
    orders = await Order.find(opt)
      .populate({
        path: "cart",
        populate: { path: "products.id" }
      })
      .sort({ updatedAt: -1 })
      .lean();
    orders = orders.map((order) => {
      order.cart.products = mapCartItems(order.cart.products);
      return order;
    });
  }
  else {
    orders = await Order.find(opt).sort({ updatedAt: -1 }).lean();
  }

  return res.status(200).json(orders);
}


/** 
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export async function DeleteOrder(req, res) {
  const orderId = new ObjectId(req.params.id);

  const deleted = await Order.findByIdAndDelete(orderId);
  console.log("DeleteOrder", deleted);

  return res.status(200).send(`Successfully deleted ${req.params.id}`);
}