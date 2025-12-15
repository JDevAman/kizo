import { bucket } from "../lib/storage";

(async () => {
  const [files] = await bucket.getFiles({ maxResults: 1 });
  console.log("✅ GCS access OK");
})();
