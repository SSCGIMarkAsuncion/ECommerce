import { User } from '../schema/user.js';
import { ObjectId } from 'mongodb';
import ROLES from "../utils/roles.js";
import MError from '../error.js';
import { ReqBody } from '../utils/ReqBody.js';

/** 
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export async function GetUsers(req, res) {
  const users =  await User.find({}).sort({ updatedAt: -1 });

  return res.status(200).json(users);
}

export class ReqUser extends ReqBody {
  constructor(obj) {
    super(obj);
    this.username = obj.username;
    this.email = obj.email;
    this.password = obj.password || undefined;
    if (typeof this.password == "string" && this.password.length == 0)
        this.password = undefined;
    this.role = obj.role;
  }
}

/*
 * @param {import('express').Request} req
 * @param {import('express').Response} _
 * @param {import('express').NextFunction} next
 */
export async function validateRoleAssign(req, _, next) {
  // assumes req.body.role exist
  if (!req.body) throw new MError(400, "Body is empty");
  if (!req.body.role) {
    return next();
  }

  const tokenRole = req.tokenPayload.role;
  if (tokenRole != ROLES.SUPERADMIN && req.body.role == ROLES.SUPERADMIN) {
    throw new MError(400, `Cannot change role of user with ${ROLES.SUPERADMIN} with ${tokenRole} privileges`);
  }
  next();
}