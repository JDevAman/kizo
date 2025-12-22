export async function triggerMockBankWebhook(
  transactionId: string,
  process: string
) {
  try {
    await fetch(`http://localhost:3001/webhooks/${process}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        transactionId,
        status: "SUCCESS", // or FAILED to test flows
        externalRef: `mock-bank-${Date.now()}`,
      }),
    });
  } catch (err) {
    console.error("Mock bank webhook failed:", err);
    // acceptable for now – tx remains PROCESSING
  }
}
