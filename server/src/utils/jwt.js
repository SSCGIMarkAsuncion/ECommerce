import dotenv from "dotenv";
import jwt from "jsonwebtoken";
dotenv.config();

const secret = Buffer.from(process.env.JWT_SECRET, 'hex');
const algo = process.env.JWT_ALGO;

export const TOKEN_KEY = "AUTH_TOKEN";

export function createToken(payload) {
  const token = jwt.sign(
    payload, secret, {
      algorithm: algo,
      expiresIn: "1d"
    }
  );
  return token;
}

export function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, secret, {
      algorithms: algo
    });
    return decoded;
  }
  catch (e) {
    console.log("ERR", "TOKEN MODIFIED or EXPIRED");
  }

  return null;
}