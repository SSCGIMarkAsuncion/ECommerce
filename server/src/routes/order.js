import express from "express";
import { authenticateJWT } from "../middleware/verify_token.js";
import { hasAdminRole, hasSuperAdminRole } from "../middleware/role.js";
import { GetRequestCancelOrder, DeleteOrder, GetOrders, PutOrder } from "../controllers/orders.js";
import { validateParamId } from "../controllers/generic.js";

const router = express.Router();
router.use(authenticateJWT);
router.get("/", GetOrders);
router.get("/request-cancel/:id",
  validateParamId,
  GetRequestCancelOrder
);
router.put("/update-order/:id", hasAdminRole, PutOrder);
router.delete("/:id", hasSuperAdminRole, DeleteOrder);

export default router;