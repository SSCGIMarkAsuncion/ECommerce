import express from "express";
import { authenticateJWT } from "../middleware/verify_token.js";
import { hasAdminRole, hasSuperAdminRole } from "../middleware/role.js";
import { GetRequestCancelOrder, GetOrders, PutOrder, ReqOrder } from "../controllers/orders.js";
import { GenericDelete, GenericUpdate, validateParamId } from "../controllers/generic.js";
import { Order } from "../schema/order.js";

const router = express.Router();
router.use(authenticateJWT);
router.get("/", GetOrders);
router.get("/request-cancel/:id",
  validateParamId,
  GetRequestCancelOrder
);
router.put("/update/:id", hasAdminRole,
  validateParamId,
  GenericUpdate(Order, ReqOrder)
);
router.delete("/delete/:id",
  hasSuperAdminRole,
  validateParamId,
  GenericDelete(Order)
);

export default router;