import { logger } from "./logger";

/**
 * Sends a WhatsApp message via the Twilio REST API.
 * Credentials are injected by the Twilio Replit connector as env vars.
 * If credentials are absent the function logs a warning and returns silently
 * so the rest of the request is not broken.
 */
export async function sendWhatsAppNotification(message: string): Promise<void> {
  const accountSid = process.env["TWILIO_ACCOUNT_SID"];
  const authToken = process.env["TWILIO_AUTH_TOKEN"];
  // The Twilio WhatsApp sandbox sender – override with a real approved sender
  // once the Twilio account is fully set up.
  const fromNumber =
    process.env["TWILIO_WHATSAPP_FROM"] ?? "whatsapp:+14155238886";
  const toNumber = "whatsapp:+351964797732";

  if (!accountSid || !authToken) {
    logger.warn(
      "Twilio credentials not configured – skipping WhatsApp notification",
    );
    return;
  }

  const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;

  const body = new URLSearchParams({
    From: fromNumber,
    To: toNumber,
    Body: message,
  });

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body.toString(),
    });

    if (!response.ok) {
      const text = await response.text();
      logger.error(
        { status: response.status, body: text },
        "Twilio WhatsApp send failed",
      );
    } else {
      logger.info("WhatsApp notification sent successfully");
    }
  } catch (err) {
    logger.error({ err }, "Twilio WhatsApp network error");
  }
}
