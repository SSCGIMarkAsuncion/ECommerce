import express from "express";
import { authenticateJWT } from "../middleware/verify_token.js";
import { hasAdminRole, hasSuperAdminRole } from "../middleware/role.js";
import { PutCart, GetCart, GetBreakdown, PostCheckout, GetUndoCheckout, PostCheckoutResult, GetAllCarts } from "../controllers/cart.js";
import { GenericDelete, validateParamId } from "../controllers/generic.js";
import { Cart } from "../schema/carts.js";
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
router.delete("/delete/:id",
   hasSuperAdminRole,
   validateParamId,
   GenericDelete(Cart));

export default router;