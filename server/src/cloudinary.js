import { v2 as cloudinary } from 'cloudinary';
import dotenv from "dotenv";
import MError from './error.js';
dotenv.config();

export function configureCloudinary() {
  cloudinary.config({ 
      cloud_name: process.env.CLOUDINARY_NAME,
      api_key: process.env.CLOUDINARY_APIKEY,
      api_secret: process.env.CLOUDINARY_SECRET
  });
}

/**
 * @param {string} id
 * @param {Buffer} buffer
 * @returns {string} returns the url to the resource
 */
export async function uploadStream(id, buffer) {
  const res = new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
      {
        resource_type: "image",
        public_id: id
      },
      (err, uploadRes) => {
        if (!err)
          return resolve(uploadRes.url);
        console.log("UPLOAD_ERR", err);
        return reject(new MError(`Upload Error ${err.http_code}::${err.message}`));
      }
    ).end(buffer)
  });
  return res;
}

/**
 * @param {string} publicId
 */
export async function deleteImg(publicId) {
  const res = await cloudinary.uploader.destroy(publicId, {
    resource_type: "image",
  });
  return res;
}