import token from "../utils/jwt.js";
import MError from "../error.js";
const { verifyToken } = token;
/**
 * Guards the next handler if the token is invalid
 * Throws error if token is missing or invalid.
 * @param {import('express').Request} req
 * @param {import('express').Response} _
 * @param {import('express').NextFunction} next
 */
export function authenticateJWT(req, _, next) {
  const token = req.cookies.TOKEN;
  if (!token) {
    throw new MError(401, "No Token");
  }
  const decoded = verifyToken(token);
  // console.log(decoded);
  if (decoded == null) {
    throw new MError(401, "Token Invalid");
  }
  req.tokenPayload = decoded;
  next();
}

/**
 * Fills the tokenPayload with the decoded payload
 * null if there is no token
 * Throws error if token is missing or invalid.
 * @param {import('express').Request} req
 * @param {import('express').Response} _
 * @param {import('express').NextFunction} next
 */
export function authenticateJWTIfExist(req, _, next) {
  const token = req.cookies.TOKEN;
  if (token == null) {
    req.tokenPayload = null;
    return next();
  }
  const decoded = verifyToken(token);
  req.tokenPayload = decoded;
  next();
}