import { logger } from "./logger";

const TO_EMAIL = "thienemoraes@gmail.com";

/**
 * Sends an email notification via Resend (https://resend.com).
 * Requires RESEND_API_KEY env var.
 * Free plan: 3 000 emails/month, send from onboarding@resend.dev.
 */
export async function sendWhatsAppNotification(message: string): Promise<void> {
  const apiKey = process.env["RESEND_API_KEY"];

  if (!apiKey) {
    logger.warn("RESEND_API_KEY not configured – skipping email notification");
    return;
  }

  // Convert the *bold* and _italic_ markers to HTML
  const html = message
    .replace(/\*(.*?)\*/g, "<strong>$1</strong>")
    .replace(/_(.*?)_/g, "<em>$1</em>")
    .replace(/\n/g, "<br>");

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Seletapsi <onboarding@resend.dev>",
        to: [TO_EMAIL],
        subject: "🆕 Nova candidatura – Seletapsi",
        html,
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      logger.error({ status: response.status, body: text }, "Resend email failed");
    } else {
      logger.info("Email notification sent via Resend");
    }
  } catch (err) {
    logger.error({ err }, "Resend network error");
  }
}
