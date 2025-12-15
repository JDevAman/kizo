import { Storage } from "@google-cloud/storage";
import config from "../config";

const storage = new Storage({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});

const bucket = storage.bucket(config.gcp.bucketName);

export const storageService = {
  async generateSignedUploadUrl({
    objectPath,
    contentType,
    maxSize,
  }: {
    objectPath: string;
    contentType: string;
    maxSize: number;
  }) {
    const file = bucket.file(objectPath);

    const [uploadUrl] = await file.getSignedUrl({
      version: "v4",
      action: "write",
      expires: Date.now() + 5 * 60 * 1000,
      contentType,
    });

    return {
      uploadUrl,
      publicUrl: `https://storage.googleapis.com/${config.gcp.bucketName}/${objectPath}`,
    };
  },
};
