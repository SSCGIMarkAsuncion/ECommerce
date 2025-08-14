import express from "express";
import { authenticateJWT } from "../middleware/verify_token.js";
import { hasAdminRole, hasSuperAdminRole } from "../middleware/role.js";
import { GetShippingInformation, GetUsers, PutUpdateShipping, ReqUser, validateRoleAssign } from "../controllers/users.js";
import { GenericAdd, GenericDelete, GenericUpdate, validateParamId } from "../controllers/generic.js";
import { User } from "../schema/user.js";

const router = express.Router();

router.get("/",
  authenticateJWT,
  hasAdminRole,
  GetUsers
);

router.delete("/delete/:id",
  authenticateJWT,
  hasSuperAdminRole,
  validateParamId,
  GenericDelete(User)
);

router.put("/edit/:id",
  authenticateJWT,
  hasAdminRole,
  validateParamId,
  validateRoleAssign,
  GenericUpdate(User, ReqUser)
);

router.put("/update-shipping",
  authenticateJWT,
  PutUpdateShipping
);
router.get("/shipping-info". 
  authenticateJWT,
  GetShippingInformation
);

router.post("/create",
  authenticateJWT,
  hasAdminRole,
  validateRoleAssign,
  GenericAdd(User, ReqUser)
);

export default router;