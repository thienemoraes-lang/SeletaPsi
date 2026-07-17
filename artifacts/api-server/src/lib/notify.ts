import { logger } from "./logger";

const PHONE = "351964797732"; // destination WhatsApp (no +)

/**
 * Sends a WhatsApp message via CallMeBot (free, no account needed).
 * Requires CALLMEBOT_API_KEY env var.
 * Docs: https://www.callmebot.com/blog/free-api-whatsapp-messages/
 */
export async function sendWhatsAppNotification(message: string): Promise<void> {
  const apiKey = process.env["CALLMEBOT_API_KEY"];

  if (!apiKey) {
    logger.warn("CALLMEBOT_API_KEY not configured – skipping WhatsApp notification");
    return;
  }

  const url = new URL("https://api.callmebot.com/whatsapp.php");
  url.searchParams.set("phone", PHONE);
  url.searchParams.set("text", message);
  url.searchParams.set("apikey", apiKey);

  try {
    const response = await fetch(url.toString());
    if (!response.ok) {
      const text = await response.text();
      logger.error({ status: response.status, body: text }, "CallMeBot send failed");
    } else {
      logger.info("WhatsApp notification sent via CallMeBot");
    }
  } catch (err) {
    logger.error({ err }, "CallMeBot network error");
  }
}
