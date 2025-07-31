import { User } from '../schema/user.js';
import { ObjectId } from 'mongodb';
import ROLES from "../utils/roles.js";
import MError from '../error.js';

/** 
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export async function GetUsers(req, res) {
  const users =  await User.find({});

  return res.status(200).json(users);
}

/** 
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export async function DeleteUser(req, res) {
  const id = new ObjectId(req.params.id);
  const result = await User.findByIdAndDelete(id);

  // returns the deleted User
  return res.status(200).json(result);
}

/** 
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export async function PutUser(req, res) {
  const id = new ObjectId(req.params.id);

  const tokenRole = req.tokenPayload.role;
  const set = {
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    role: req.body.role
  };
  for (const key of Object.keys(set)) {
    const item = set[key];
    if (item == undefined) {
      delete set[key];
    }
  }

  if (set.role) {
    if (!(tokenRole == ROLES.SUPERADMIN && set.role == ROLES.SUPERADMIN)) {
      throw new MError(400, `Cannot change role of user with ${ROLES.SUPERADMIN} with ${tokenRole} privileges`);
    }
  }

  const result = await User.findByIdAndUpdate(id, set);
  return res.status(200).json(result);
}