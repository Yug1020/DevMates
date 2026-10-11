import multer from "multer";

export const MAX_PROFILE_IMAGE_SIZE = 5 * 1024 * 1024;

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    files: 1,
    fileSize: MAX_PROFILE_IMAGE_SIZE,
  },
  fileFilter: (_req, file, callback) => {
    if (file.mimetype?.startsWith("image/")) {
      callback(null, true);
      return;
    }

    callback(new Error("Only image files can be used as a profile picture."));
  },
});

export const profileImageUpload = (req, res, next) => {
  upload.single("profileImage")(req, res, (error) => {
    if (!error) {
      next();
      return;
    }

    if (error instanceof multer.MulterError && error.code === "LIMIT_FILE_SIZE") {
      res.status(400).send("Profile image must be 5 MB or smaller.");
      return;
    }

    res.status(400).send(error.message || "Unable to upload the profile image.");
  });
};
