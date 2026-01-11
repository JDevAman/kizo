import getConfig from "../config.js";

export async function triggerMockBankWebhook(
  transactionId: string,
  process: string,
) {
  try {
    const config = getConfig();
    const baseUrl = config.webhookBaseUrl;

    if (!baseUrl) {
      throw new Error("WEBHOOK_BASE_URL not configured");
    }

    await fetch(`${baseUrl}/webhooks/${process}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        transactionId,
        status: "SUCCESS",
        externalRef: `mock-bank-${Date.now()}`,
      }),
    });
  } catch (err) {
    console.error("Mock bank webhook failed:", err);
    // acceptable for now – tx remains PROCESSING
  }
}
