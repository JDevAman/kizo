import { Logger } from "@kizo/logger";
import { getConfig } from "../config.js";

interface BankResponse {
  success: boolean;
  message?: string;
  externalRef?: string;
}

export async function triggerMockBankWebhook(
  transactionId: string,
  type: "DEPOSIT" | "WITHDRAW",
  log: Logger,
): Promise<BankResponse> {
  const config = getConfig();
  const baseUrl = config?.baseUrl;

  try {
    const endpoint = type.toLowerCase();

    const response = await fetch(`${baseUrl}/bank/${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-trace-id": log.bindings().traceId as string,
      },
      body: JSON.stringify({
        transactionId,
        type,
      }),
    });

    if (!response.ok) {
      throw new Error(`Bank API responded with status: ${response.status}`);
    }

    const data = await response.json();

    return {
      success: data.status === "SUCCESS",
      message: data.message,
      externalRef: data.externalRef,
    };
  } catch (err) {
    throw err;
  }
}
