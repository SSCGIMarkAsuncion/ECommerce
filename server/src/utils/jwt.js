import dotenv from "dotenv";
import jwt from "jsonwebtoken";
dotenv.config();

const secret = Buffer.from(process.env.JWT_SECRET, 'hex');
const algo = process.env.JWT_ALGO;

function createToken(payload) {
  const token = jwt.sign(
    payload, secret, {
      algorithm: algo,
      expiresIn: "1d"
    }
  );
  return token;
}

function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, secret, {
      algorithms: algo
    });
    return decoded;
  }
  catch (e) {
    console.log("ERR", e);
  }

  return null;
}

export default {
  createToken,
  verifyToken
};