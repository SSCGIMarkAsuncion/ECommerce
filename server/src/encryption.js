import dotenv from "dotenv";
dotenv.config();
import bcrypt from "bcrypt";

const saltRounds = Number(process.env.HASH_SALT_ROUNDS);

/**
 * TODO rename to hash
 * @param {string} raw
*/
export function hash(raw) {
  const hashed = bcrypt.hashSync(raw, saltRounds);
  return hashed;
}

/**
 * @param {string} raw
 * @param {string} hash
*/
export function compare(raw, hash) {
  return bcrypt.compareSync(raw, hash);
}