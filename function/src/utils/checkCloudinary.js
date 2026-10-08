import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "drnttd8k",
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

async function checkCloudinary() {
  try {
    const result = await cloudinary.api.ping();
    console.log("Cloudinary Connection Successful:", result);
  } catch (error) {
    console.error("Cloudinary Auth Failed:", error);
  }
}

checkCloudinary();