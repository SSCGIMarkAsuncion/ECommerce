import express from "express";
import bodyParser from "body-parser";
import { uploadStream } from "../cloudinary.js";
const router = express.Router();

router.use(bodyParser.raw({ limit: "100mb" }));

/*
success return type
{
  url: string,
}
*/
router.post("/upload", async (req, res) => {
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
});

export default router;