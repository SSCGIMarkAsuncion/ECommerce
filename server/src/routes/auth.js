import express from "express";
import { authenticateJWT, authenticateJWTIfExist } from "../middleware/verify_token.js";
import { verifyRole } from "../middleware/role.js";
import { PostRegister } from "../controllers/register.js";
import { PostLogin } from "../controllers/login.js";
import { TOKEN_KEY } from "../utils/jwt.js";

const router = express.Router();

router.post("/register", PostRegister);

router.post("/login", PostLogin);

router.get("/verify", authenticateJWT, async (req, res) => {
  return res.status(200).json(req.tokenPayload);
});

router.get("/logout", async (_req, res) => {
  res.clearCookie(TOKEN_KEY, {
    secure: true,
    httpOnly: true
  });

  return res.status(200).send("");
});

export default router;