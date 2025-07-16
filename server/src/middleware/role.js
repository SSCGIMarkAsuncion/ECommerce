import MError from "../error.js";
import token from "../utils/jwt.js";
import ROLES from "../utils/roles.js";
const { verifyToken } = token;
/**
 * Express middleware to validate JWT token and roles.
 * Throws error if token is missing or invalid.
 * NOTE: Apply this middleware after authenticateJWT
 * @param {import('express').Request} req
 * @param {import('express').Response} _
 * @param {import('express').NextFunction} next
 */
export function verifyRole(req, _, next) {
  const roleReq = req.query.role;
  const tokenRole = req.tokenPayload.role;

  switch (roleReq) {
    // role=superadmin request must have superadmin role on their token
    case ROLES.SUPERADMIN:
      if (tokenRole === ROLES.SUPERADMIN) {
        return next();
      }
      break;
    // role=admin request must have superadmin or admin role on their token
    case ROLES.ADMIN:
      if (tokenRole === ROLES.ADMIN || tokenRole === ROLES.SUPERADMIN) {
        return next();
      }
      break;
    // allow any role for role=user request as long as authenticated
    case ROLES.USER:
    default:
      return next();
  }
  throw new MError(400, "Request Not Allowed");
}