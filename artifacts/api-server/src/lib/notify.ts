import { logger } from "./logger";

const ADMIN_EMAIL = "thienemoraes@gmail.com";

async function resendPost(to: string[], subject: string, html: string): Promise<void> {
  const apiKey = process.env["RESEND_API_KEY"];
  if (!apiKey) { logger.warn("RESEND_API_KEY not configured – skipping email"); return; }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: "Seletapsi <onboarding@resend.dev>", to, subject, html }),
  });

  if (!response.ok) {
    const text = await response.text();
    logger.error({ status: response.status, body: text }, "Resend email failed");
  } else {
    logger.info({ to, subject }, "Email sent via Resend");
  }
}

/** Notificação interna de nova candidatura (para o admin) */
export async function sendWhatsAppNotification(message: string): Promise<void> {
  const html = message
    .replace(/\*(.*?)\*/g, "<strong>$1</strong>")
    .replace(/_(.*?)_/g, "<em>$1</em>")
    .replace(/\n/g, "<br>");
  try {
    await resendPost([ADMIN_EMAIL], "🆕 Nova candidatura – Seletapsi", html);
  } catch (err) {
    logger.error({ err }, "Resend network error");
  }
}

/** Link de pagamento enviado ao psicólogo após aprovação */
export async function sendPaymentLinkEmail(opts: {
  email: string;
  nome: string;
  plano: string;
  paymentUrl: string;
}): Promise<void> {
  const planLabel =
    opts.plano === "trimestral"
      ? "Trimestral – R$ 117,00 (≈ R$ 39/mês)"
      : "Mensal – R$ 49,00/mês";

  const html = `
    <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#1a3a5c">
      <div style="background:#1a3a5c;padding:32px 24px;border-radius:16px 16px 0 0;text-align:center">
        <h1 style="color:#fff;margin:0;font-size:22px">🎉 Sua candidatura foi aprovada!</h1>
      </div>
      <div style="background:#f9f9f9;padding:32px 24px;border-radius:0 0 16px 16px;border:1px solid #e5e5e5">
        <p style="font-size:16px;margin:0 0 16px">Olá, <strong>${opts.nome}</strong>!</p>
        <p style="font-size:15px;color:#444;line-height:1.6;margin:0 0 24px">
          Estamos felizes em informar que sua candidatura foi <strong style="color:#1a3a5c">aprovada</strong> pela equipe Seletapsi.
          Para ativar seu perfil na plataforma, realize o pagamento do plano escolhido:
        </p>

        <div style="background:#fff;border:2px solid #e07a5f;border-radius:12px;padding:20px;text-align:center;margin:0 0 24px">
          <p style="margin:0 0 4px;font-size:13px;color:#888;text-transform:uppercase;letter-spacing:.05em">Plano selecionado</p>
          <p style="margin:0;font-size:20px;font-weight:700;color:#1a3a5c">${planLabel}</p>
        </div>

        <div style="text-align:center;margin:0 0 24px">
          <a href="${opts.paymentUrl}"
             style="display:inline-block;background:#e07a5f;color:#fff;font-weight:700;font-size:16px;
                    padding:16px 40px;border-radius:50px;text-decoration:none">
            Pagar agora →
          </a>
        </div>

        <p style="font-size:13px;color:#999;text-align:center;margin:0">
          Aceitamos PIX, cartão de crédito e cartão de débito.<br>
          Após o pagamento, seu perfil será publicado automaticamente.
        </p>
      </div>
      <p style="font-size:12px;color:#bbb;text-align:center;margin:16px 0 0">
        Dúvidas? Entre em contato pelo WhatsApp com nossa equipe.
      </p>
    </div>
  `;

  try {
    await resendPost(
      [opts.email],
      "✅ Candidatura aprovada – finalize seu pagamento | Seletapsi",
      html
    );
  } catch (err) {
    logger.error({ err }, "Resend network error (payment link)");
  }
}
