import { ObjectId } from "mongodb";
import { Order, ORDER_STATUS } from "../schema/order.js";
import ROLES, { isAdmin } from "../utils/roles.js";
import MError from "../error.js";
import { mapCartItems } from "../schema/carts.js";
import parseQueryValue from "../utils/query.js";

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

class QueryOrders {
  constructor(query) {
    this.populated = query.populated == '1';
    this.self = query.self == '1'; // only relevant for admin
    this.sort = query.sort || "desc";
    if (!["asc", "desc"].includes(this.sort)) {
      throw new MError(400, `Invalid. sort only accepts 'asc' or 'desc'`);
    }
    this.status = parseQueryValue(query.status);
    if (this.status) {
      this.status.forEach((status) => {
        if (!ORDER_STATUS.includes(status)) {
          throw new MError(400, `Invalid. status only accepts ${ORDER_STATUS} separated with ';' for multiple status`);
        }
      });
    }
  }

  buildFilter(tokenPayload) {
    console.log(this);
    const opt = {};
    if (this.self || !isAdmin(tokenPayload.role))
      opt._id = new ObjectId(String(tokenPayload.id));
    if (this.status.length > 0)
      opt.status = { $in: this.status };

    return opt;
  }

  buildSort() {
    switch (this.sort) {
      case "desc": return { updatedAt: -1 };
      case "asc": return { updatedAt: 1 }; 
      default:
        break;
    }
    return { updatedAt: -1 };
  }
};

/** 
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export async function GetOrders(req, res) {
  const query = new QueryOrders(req.query);

  let orders = [];
  const filterOpt = query.buildFilter(req.tokenPayload);
  if (query.populated) {
    orders = await Order.find(filterOpt)
      .populate({
        path: "cart",
        populate: { path: "products.id" }
      })
      .sort(query.buildSort())
      .lean();

    orders = orders.map((order) => {
      order.cart.products = mapCartItems(order.cart.products);
      return order;
    });
  }
  else {
    orders = await Order.find(filterOpt)
      .sort(query.buildSort())
      .lean();
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


/** 
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export async function GetRequestCancelOrder(req, res) {
  const id = req.mParamId;
  const uid = req.tokenPayload.id;

  res.status(200).send(null);
}