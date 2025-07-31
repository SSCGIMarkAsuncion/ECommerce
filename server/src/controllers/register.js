import { encrypt } from "../encryption.js";
import MError from "../error.js";
import { User } from "../schema/user.js";
import ROLES from "../utils/roles.js";

/** 
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export async function PostRegister(req, res) {
  const body = req.body;
  console.log("PostRegister::BODY", body);
  const role = req.query.role || ROLES.USER;
  const tokenRole = req.tokenPayload? req.tokenPayload.role:null;

  if ((role == ROLES.ADMIN || role == ROLES.SUPERADMIN) && tokenRole != ROLES.SUPERADMIN) {
    throw new MError(400, "Request Not Allowed");
  }

  const user = {
    email: body.email,
    username: body.username,
    password: body.password,
    role: role
  };
  for (const key of Object.keys(user)) {
    if (!user[key])
      throw new MError(406, "Missing Credentials");
  }

  const foundUser = await User.findOne({
    $or: [
      { username: user.username },
      { email: user.email }
    ]
  });

  if (foundUser != null) {
    throw new MError(409, "User already exists");
  }

  const newUser = new User(user);
  try {
    await newUser.save();
  }
  catch (e) {
    if (e instanceof Error)
      throw new MError(500, e.message);
    else
      throw new MError(500, e);
  }

  res.status(200).send("");
}