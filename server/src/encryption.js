import dotenv from "dotenv";
dotenv.config();
import {
  createCipheriv,
  createDecipheriv
} from "node:crypto";

const algorithm = process.env.ENCRYPTION_ALGO;
const hexkey = process.env.ENCRYPTION_KEY;
const hexiv = process.env.ENCRYPTION_IV;

const key = Buffer.from(hexkey, "hex");
const iv = Buffer.from(hexiv, "hex");

/** @param {string} raw */
function encrypt(raw) {
  const cipher = createCipheriv(algorithm, key, iv);

  let encrypted = cipher.update(raw, "utf8", "hex");
  encrypted += cipher.final("hex");
  console.log(encrypted);
  return encrypted;
}

/** @param {string} encryptedHex */
function decrypt(encryptedHex) {
  const decipher = createDecipheriv(algorithm, key, iv);

  let decrypted = decipher.update(encryptedHex, "hex", "utf-8");
  decrypted += decipher.final("utf-8");
  return decrypted;
}

export default {
  encrypt,
  decrypt
};