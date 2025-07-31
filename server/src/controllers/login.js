import MError from '../error.js';
import { compare, hash } from '../encryption.js';
import { User } from '../schema/user.js';
import { createToken, TOKEN_KEY } from "../utils/jwt.js"

/** 
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export async function PostLogin(req, res) {
  const body = req.body;
  console.log("PostLogin::BODY", body);
  const user = {
    email: body.email,
    password: body.password,
  };
  for (const key of Object.keys(user)) {
    if (!user[key])
      throw new MError(406, "Missing Credentials");
  }

  const foundUser = await User.findOne({ email: user.email });
  if (foundUser == null) {
    throw new MError(404, "User does not exists");
  }
  console.log(hash(user.password));
  if (!compare(user.password, foundUser.password)) {
    throw new MError(404, "User does not exists");
  }

  const jwtPayload = {
    id: foundUser._id,
    email: foundUser.email,
    username: foundUser.username,
    role: foundUser.role
  };

  const token = createToken(jwtPayload);
  res.cookie(TOKEN_KEY, token, {
    secure: true,
    httpOnly: true
  });

  return res.status(200).json(jwtPayload);
};