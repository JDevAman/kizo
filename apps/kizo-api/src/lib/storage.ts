import { Storage } from "@google-cloud/storage";
import config from "../config";

export const storage = new Storage(); // auto-uses service account
export const bucket = storage.bucket(config.gcp.bucketName);
