import MError from '../error.js';
import { uploadStream } from "../cloudinary.js";

/** 
 * success return type
 * {
 *  url: string,
 * }
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export async function PostUpload(req, res) {
  const body = req.body; // raw buffer
  const name = crypto.randomUUID();
  let url = null;
  try {
    url = await uploadStream(name, body);
  }
  catch (e) {
    return res.status(400).json(e);
  }

  return res.status(200).json({
    url,
  });
}

/**
 * body string
 * url
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export async function DeleteFile(req, res) {
  const url = req.body;
  if (!url) {
    throw new MError(404, "URL is missing from body");
  }

  throw new MError(500, "NOT IMPLEMENTED YET");
}