
import express from "express";
import { authenticateJWT } from "../middleware/verify_token.js";
import { hasAdminRole, hasSuperAdminRole } from "../middleware/role.js";
import { GetUsers, DeleteUser, PutUser, PostUser } from "../controllers/users.js";

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

router.post("/create",
  authenticateJWT,
  hasAdminRole,
  PostUser
);

export default router;