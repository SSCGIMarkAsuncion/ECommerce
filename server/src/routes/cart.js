import express from "express";
import { authenticateJWT } from "../middleware/verify_token.js";
import { PutCart, GetCart, GetCheckout } from "../controllers/cart.js";
const router = express.Router();

router.use(authenticateJWT);
router.put("/add/:id", PutCart);
router.get("/", GetCart);
router.get("/checkout", GetCheckout);

export default router;