import express from "express";
import { authenticateJWT } from "../middleware/verify_token.js";
import { PutCart, GetCart, GetBreakdown } from "../controllers/cart.js";
const router = express.Router();

router.use(authenticateJWT);
// rename to /set/:id
router.put("/add/:id", PutCart);
router.get("/", GetCart);
router.get("/breakdown", GetBreakdown);

export default router;