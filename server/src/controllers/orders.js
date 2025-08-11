import { ObjectId } from "mongodb";
import { Order } from "../schema/order.js";
import ROLES, { isAdmin } from "../utils/roles.js";
import MError from "../error.js";

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
  if (!isAdmin(req.tokenPayload.role)) {
    opt._id = new ObjectId(String(req.tokenPayload.id));
  }
  const orders = await Order.find(opt).sort({ updatedAt: -1 });

  return res.status(200).json(orders);
}