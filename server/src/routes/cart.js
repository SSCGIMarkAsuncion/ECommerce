import express from "express";
import { authenticateJWT } from "../middleware/verify_token.js";
import { hasAdminRole, hasSuperAdminRole } from "../middleware/role.js";
import { PutCart, DeleteCart, GetCart, GetBreakdown, PostCheckout, GetUndoCheckout, PostCheckoutResult, GetAllCarts } from "../controllers/cart.js";
const router = express.Router();

router.use(authenticateJWT);
// rename to /set/:id
router.put("/add/:id", PutCart);
router.get("/", GetCart);
router.get("/breakdown", GetBreakdown);
router.post("/checkout", PostCheckout);
router.get("/undo-checkout", GetUndoCheckout);
router.post("/checkout-result", PostCheckoutResult);
router.get("/all", hasAdminRole, GetAllCarts);
router.delete("/delete/:id", hasSuperAdminRole, DeleteCart);

export default router;