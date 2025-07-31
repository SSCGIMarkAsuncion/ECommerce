import MError from "../error.js";
import ROLES from "../utils/roles.js";

/**
 * Express middleware to validate JWT token and roles.
 * Throws error if token is invalid.
 * NOTE: Apply this middleware after authenticateJWT
 * @param {import('express').Request} req
 * @param {import('express').Response} _
 * @param {import('express').NextFunction} next
 */
export function verifyRole(req, _, next) {
  const roleReq = req.query.role;
  if (req.tokenPayload == null) {
    return next();
  }

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

/**
 * Checks if token is admin or superadmin otherwise throw an error
 * Throws error if token is missing or invalid.
 * NOTE: Apply this middleware after authenticateJWT
 * @param {import('express').Request} req
 * @param {import('express').Response} _
 * @param {import('express').NextFunction} next
 */
export function hasAdminRole(req, _, next) {
  const tokenRole = req.tokenPayload.role;
  if (tokenRole === ROLES.ADMIN || tokenRole === ROLES.SUPERADMIN) {
    return next();
  }
  throw new MError(400, "Request not possible");
}

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} _
 * @param {import('express').NextFunction} next
 */
export function hasSuperAdminRole(req, _, next) {
  const tokenRole = req.tokenPayload.role;
  if (tokenRole === ROLES.SUPERADMIN) {
    return next();
  }
  throw new MError(400, "This action is only permitted for SUPERADMIN");
}