import express from "express";
import { GetProduct, GetPresets, ReqProduct, PostCancelUpdate } from "../controllers/product.js";
import { authenticateJWT } from "../middleware/verify_token.js";
import { hasAdminRole, hasSuperAdminRole } from "../middleware/role.js";
import { Product } from "../schema/products.js";
import { GenericAdd, GenericDelete, GenericUpdate, validateParamId } from "../controllers/generic.js";

const router = express.Router();

router.get("/filter-presets", GetPresets);
router.get("/", GetProduct);
router.get("/:id", GetProduct);
router.post("/cancel-update/",
  authenticateJWT,
  hasSuperAdminRole,
  PostCancelUpdate
);
router.post("/cancel-update/:id",
  authenticateJWT,
  hasSuperAdminRole,
  validateParamId,
  PostCancelUpdate
);
router.delete("/delete/:id",
  authenticateJWT,
  hasSuperAdminRole,
  validateParamId,
  GenericDelete(Product)
);
router.put("/update/:id",
  authenticateJWT,
  hasAdminRole,
  validateParamId,
  GenericUpdate(Product, ReqProduct)
);
router.post("/add",
  authenticateJWT,
  hasAdminRole,
  GenericAdd(Product, ReqProduct)
);

export default router;