import { Router, type IRouter } from "express";
import { sendWhatsAppNotification } from "../lib/twilio";

const router: IRouter = Router();

router.post("/candidatura", async (req, res): Promise<void> => {
  const {
    nome,
    cpf,
    crp,
    estado_crp,
    telefone,
    whatsapp,
    email,
    cidade,
    estado,
    instagram,
    site,
    modalidade,
    valor_sessao,
    abordagem,
    especialidades,
    tempo_experiencia,
    formacao,
    especializacoes_detalhe,
    curriculo,
    documentos,
  } = req.body as Record<string, string>;

  if (!nome || !crp || !email || !whatsapp) {
    res.status(400).json({ error: "Campos obrigatórios faltando" });
    return;
  }

  req.log.info({ nome, crp, email }, "Nova candidatura recebida");

  const docsLine =
    documentos
      ? `\n*Documentos enviados:* ${documentos}`
      : "";

  const message =
    `🆕 *Nova candidatura – Seletapsi*\n\n` +
    `*Nome:* ${nome}\n` +
    `*CPF:* ${cpf ?? "-"}\n` +
    `*CRP:* ${crp} / ${estado_crp ?? "-"}\n` +
    `*E-mail:* ${email}\n` +
    `*WhatsApp:* ${whatsapp}\n` +
    `*Telefone:* ${telefone ?? "-"}\n` +
    `*Cidade / Estado:* ${cidade ?? "-"} / ${estado ?? "-"}\n` +
    `*Modalidade:* ${modalidade ?? "-"}\n` +
    `*Valor da sessão:* ${valor_sessao ?? "-"}\n` +
    `*Abordagem:* ${abordagem ?? "-"}\n` +
    `*Especialidades:* ${especialidades ?? "-"}\n` +
    `*Tempo de experiência:* ${tempo_experiencia ?? "-"}\n` +
    `*Formação:* ${formacao ?? "-"}\n` +
    `*Especializações:* ${especializacoes_detalhe ?? "-"}\n` +
    `*Instagram:* ${instagram ?? "-"}\n` +
    `*Site:* ${site ?? "-"}\n` +
    `*Currículo:* ${curriculo ? curriculo.slice(0, 300) + (curriculo.length > 300 ? "…" : "") : "-"}` +
    docsLine +
    `\n\n_Revise a candidatura e entre em contato com o psicólogo(a)._`;

  await sendWhatsAppNotification(message);

  res.status(201).json({ ok: true, message: "Candidatura recebida com sucesso" });
});

export default router;
