import { Router, type IRouter } from "express";
import { sendWhatsAppNotification } from "../lib/twilio";

const router: IRouter = Router();

router.post("/payment-interest", async (req, res): Promise<void> => {
  const { nome, email, whatsapp, plano } = req.body as Record<string, string>;

  if (!nome || !plano) {
    res.status(400).json({ error: "Campos obrigatórios faltando" });
    return;
  }

  req.log.info({ nome, plano }, "Interesse em pagamento registrado");

  const planLabel =
    plano === "mensal"
      ? "Plano Mensal – R$ 49,00/mês"
      : "Plano Trimestral – R$ 117,00 (equivale a 3x R$ 39,00/mês)";

  const message =
    `💳 *Interesse em pagamento – Seletapsi*\n\n` +
    `*Psicólogo(a):* ${nome}\n` +
    `*E-mail:* ${email ?? "-"}\n` +
    `*WhatsApp:* ${whatsapp ?? "-"}\n` +
    `*Plano escolhido:* ${planLabel}\n\n` +
    `_Entre em contato para finalizar o credenciamento e o pagamento._`;

  await sendWhatsAppNotification(message);

  res.status(201).json({ ok: true, message: "Interesse registrado" });
});

export default router;
