import token from "../utils/jwt.js";
import MError from "../error.js";
const { verifyToken } = token;
/**
 * Guards the next handler if the token is invalid
 * Guards the next handler if the token is invalid
 * Throws error if token is missing or invalid.
 * @param {import('express').Request} req
 * @param {import('express').Response} _
 * @param {import('express').NextFunction} next
 */
export function authenticateJWT(req, _, next) {
  const token = req.cookies.TOKEN;
  if (!token) {
    throw new MError(400, "No Token");
  }
  const decoded = verifyToken(token);
  // console.log(decoded);
  if (decoded == null) {
    throw new MError(400, "Token Invalid");
  }
  req.tokenPayload = decoded;
  next();
}