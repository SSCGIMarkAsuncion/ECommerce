import express from "express";
import { GetTestimony, PostReview, GetReviewOfProduct } from "../controllers/reviews.js";
import { authenticateJWT } from "../middleware/verify_token.js";

const router = express.Router();

router.get("/testimony", GetTestimony);
router.get("/:id", GetReviewOfProduct)
router.post("/submit", authenticateJWT, PostReview)

export default router;