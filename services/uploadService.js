import { PutObjectCommand } from "@aws-sdk/client-s3";
import crypto from "crypto";
import s3 from "../config/scaleway.js";
const uploadToScaleway = async (file, fileCategory) => {
 const folder = process.env.SCALEWAY_FOLDER;
 const bucket = process.env.SCALEWAY_BUCKET_NAME;
 const endpoint = process.env.SCALEWAY_ENDPOINT;
 const ext = file.originalname.split(".").pop();
 const safeName = `${crypto.randomUUID()}.${ext}`;
 const key = `${folder}/${fileCategory}/${safeName}`;
 await s3.send(
 new PutObjectCommand({
 Bucket: bucket,
 Key: key,
 Body: file.buffer,
 ContentType: file.mimetype,
 ACL: "public-read",
 })
 );
 return `${endpoint}/${bucket}/${key}`;
};
export { uploadToScaleway };