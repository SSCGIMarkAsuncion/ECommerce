
import express from "express";
import { authenticateJWT } from "../middleware/verify_token.js";
import { hasAdminRole, hasSuperAdminRole } from "../middleware/role.js";
import { GetUsers, DeleteUser, PutUser } from "../controllers/users.js";

const router = express.Router();

router.get("/",
  authenticateJWT,
  hasAdminRole,
  GetUsers
);

router.delete("/delete/:id",
  authenticateJWT,
  hasSuperAdminRole,
  DeleteUser
);

router.put("/edit/:id",
  authenticateJWT,
  hasAdminRole,
  PutUser
);

export default router;