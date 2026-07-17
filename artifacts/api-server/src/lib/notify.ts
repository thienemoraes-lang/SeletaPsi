import nodemailer from "nodemailer";
import { logger } from "./logger";

const TO_EMAIL = "thienemoraes@gmail.com";

/**
 * Sends an email notification via Gmail SMTP.
 * Requires GMAIL_USER and GMAIL_APP_PASSWORD env vars.
 * Generate an App Password at: https://myaccount.google.com/apppasswords
 */
export async function sendWhatsAppNotification(message: string): Promise<void> {
  const user = process.env["GMAIL_USER"];
  const pass = process.env["GMAIL_APP_PASSWORD"];

  if (!user || !pass) {
    logger.warn("GMAIL_USER / GMAIL_APP_PASSWORD not configured – skipping email notification");
    return;
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });

  // Convert the WhatsApp-style message to plain HTML for email readability
  const html = message
    .replace(/\*(.*?)\*/g, "<strong>$1</strong>")
    .replace(/_(.*?)_/g, "<em>$1</em>")
    .replace(/\n/g, "<br>");

  try {
    await transporter.sendMail({
      from: `"Seletapsi" <${user}>`,
      to: TO_EMAIL,
      subject: "🆕 Nova candidatura – Seletapsi",
      html,
    });
    logger.info("Email notification sent successfully");
  } catch (err) {
    logger.error({ err }, "Email notification failed");
  }
}
