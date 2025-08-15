import express from "express";
import { authenticateJWT } from "../middleware/verify_token.js";
import { hasSuperAdminRole, hasAdminRole } from "../middleware/role.js";
import { GenericDelete, validateParamId } from "../controllers/generic.js";
import { GetHistory } from "../controllers/history.js";
import { History } from "../schema/history.js";

const router = express.Router();
router.use(authenticateJWT);
router.get("/", hasAdminRole, GetHistory);
// router.put("/update/:id", hasAdminRole,
//   validateParamId,
//   GenericUpdate(History, ReqOrder)
// );
router.delete("/delete/:id",
  hasSuperAdminRole,
  validateParamId,
  GenericDelete(History)
);

export default router;