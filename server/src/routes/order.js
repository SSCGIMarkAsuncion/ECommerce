import express from "express";
import { authenticateJWT } from "../middleware/verify_token.js";
import { hasAdminRole } from "../middleware/role.js";
import { GetOrders, PutOrder } from "../controllers/orders.js";

const router = express.Router();
router.use(authenticateJWT);
router.get("/", GetOrders);
router.put("/update-order/:id", hasAdminRole, PutOrder);

export default router;