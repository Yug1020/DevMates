import cloudinary, { getMissingCloudinaryConfig } from "./cloudinary.js";

const PROFILE_IMAGE_FOLDER = "devmates/profile-images";

/**
 * Upload an in-memory image buffer and return the URL the frontend can render.
 */
export const uploadImage = async (imageBuffer) => {
  if (!Buffer.isBuffer(imageBuffer) || imageBuffer.length === 0) {
    throw new Error("A valid image file is required.");
  }

  const missingConfig = getMissingCloudinaryConfig();
  if (missingConfig.length > 0) {
    throw new Error(`Cloudinary is not configured. Missing: ${missingConfig.join(", ")}.`);
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: PROFILE_IMAGE_FOLDER,
        resource_type: "image",
        use_filename: false,
        unique_filename: true,
        overwrite: false,
      },
      (error, result) => {
        if (error) {
          console.log("cloudinary:-", error)
          reject(error);
          return;
        }

        resolve({
          photoURL: result.secure_url,
          publicId: result.public_id,
        });
      }
    );

    uploadStream.end(imageBuffer);
  });
};
