import dotenv from "dotenv";
dotenv.config();

const config = {
  jwtsecret: process.env.JWT_SECRET,
  port: process.env.PORT,
  pepper: process.env.PEPPER,
  frontendURI: process.env.FRONTEND_URL,
  accessTokenExpiresIn: process.env.ACCESS_EXPIRES,
  refreshTokenExpiresDays: Number(process.env.REFRESH_DAYS),
  cookie: {
    accessCookieName: "access_token",
    refreshCookieName: "refresh_token",
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  },
  gcp: {
    bucketName: process.env.GCP_BUCKET_NAME!,
  },
  maxAvatarSize: Number(process.env.MAX_AVATAR_SIZE),
};

export default config;
