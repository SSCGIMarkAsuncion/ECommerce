import express from "express";
import bodyParser from "body-parser";
import { DeleteFile, PostUpload } from "../controllers/file.js";
const router = express.Router();

router.use(bodyParser.raw({ limit: "100mb" }));

/*
success return type
{
  url: string,
}
*/
router.post("/upload", PostUpload);
router.delete("/delete", DeleteFile);

export default router;