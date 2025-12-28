import multer from "multer";
import getConfig from "../config.js";

const config = getConfig();
export const avatarUpload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: config.maxAvatarSize * 1024, // 100 KB
  },
  fileFilter: (_req, file, cb) => {
    if (!["image/png", "image/jpeg", "image/webp"].includes(file.mimetype)) {
      cb(new Error("Invalid file type"));
    } else {
      cb(null, true);
    }
  },
});
