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

/*** 
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

async function example() {

    // Configuration
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_NAME,
        api_key: process.env.CLOUDINARY_APIKEY,
        api_secret: process.env.CLOUDINARY_SECRET
    });
    
    // Upload an image
     const uploadResult = await cloudinary.uploader
       .upload(
           'https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg', {
               public_id: 'shoes',
           }
       )
       .catch((error) => {
           console.log(error);
       });
    
    console.log(uploadResult);
    
    // Optimize delivery by resizing and applying auto-format and auto-quality
    const optimizeUrl = cloudinary.url('shoes', {
        fetch_format: 'auto',
        quality: 'auto'
    });
    
    console.log(optimizeUrl);
    
    // Transform the image: auto-crop to square aspect_ratio
    const autoCropUrl = cloudinary.url('shoes', {
        crop: 'auto',
        gravity: 'auto',
        width: 500,
        height: 500,
    });
    
    console.log(autoCropUrl);    
};