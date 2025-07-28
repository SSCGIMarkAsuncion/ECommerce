import express from "express";
import { PostProduct, DeleteProduct, GetProduct, PutProduct } from "../controllers/product.js";
import { authenticateJWT } from "../middleware/verify_token.js";
import { hasAdminRole, hasSuperAdminRole } from "../middleware/role.js";

const router = express.Router();

router.get("/", GetProduct);
router.get("/:id", GetProduct);
router.delete("/delete/:id",
  authenticateJWT,
  hasSuperAdminRole,
  DeleteProduct
);
router.put("/update/:id",
  authenticateJWT,
  hasAdminRole,
  PutProduct
);
router.post("/add",
  authenticateJWT,
  hasAdminRole,
  PostProduct
);

export default router;