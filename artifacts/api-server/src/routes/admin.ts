import { Router, type IRouter, type Request, type Response, type NextFunction } from "express";
import { db, candidaturasTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { getUncachableStripeClient } from "../lib/stripeClient";
import { sendPaymentLinkEmail } from "../lib/notify";

const router: IRouter = Router();

/* ── Auth middleware ───────────────────────────────────────── */
function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  const password = req.headers["x-admin-password"] as string | undefined;
  const expected = process.env.ADMIN_PASSWORD ?? "seletapsi@admin";
  if (!password || password !== expected) {
    res.status(401).json({ error: "Não autorizado" });
    return;
  }
  next();
}

/* ── List all candidaturas ─────────────────────────────────── */
router.get("/admin/candidaturas", requireAdmin, async (req, res): Promise<void> => {
  try {
    const rows = await db.select().from(candidaturasTable).orderBy(candidaturasTable.criado_em);
    res.json(rows);
  } catch (err) {
    req.log.error(err, "Erro ao listar candidaturas");
    res.status(500).json({ error: "Erro interno" });
  }
});

/* ── Get single candidatura ────────────────────────────────── */
router.get("/admin/candidaturas/:id", requireAdmin, async (req, res): Promise<void> => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) { res.status(400).json({ error: "ID inválido" }); return; }
  try {
    const [row] = await db.select().from(candidaturasTable).where(eq(candidaturasTable.id, id));
    if (!row) { res.status(404).json({ error: "Não encontrado" }); return; }
    res.json(row);
  } catch (err) {
    req.log.error(err, "Erro ao buscar candidatura");
    res.status(500).json({ error: "Erro interno" });
  }
});

/* ── Update plano ──────────────────────────────────────────── */
router.patch("/admin/candidaturas/:id/plano", requireAdmin, async (req, res): Promise<void> => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) { res.status(400).json({ error: "ID inválido" }); return; }
  const { plano } = req.body as { plano?: string };
  if (!plano) { res.status(400).json({ error: "plano obrigatório" }); return; }
  try {
    await db.update(candidaturasTable)
      .set({ plano, atualizado_em: new Date() })
      .where(eq(candidaturasTable.id, id));
    res.json({ ok: true });
  } catch (err) {
    req.log.error(err, "Erro ao atualizar plano");
    res.status(500).json({ error: "Erro interno" });
  }
});

/* ── Approve + create Stripe payment link ──────────────────── */
router.put("/admin/candidaturas/:id/aprovar", requireAdmin, async (req, res): Promise<void> => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) { res.status(400).json({ error: "ID inválido" }); return; }

  try {
    const [cand] = await db.select().from(candidaturasTable).where(eq(candidaturasTable.id, id));
    if (!cand) { res.status(404).json({ error: "Não encontrado" }); return; }

    let paymentLink: string | null = cand.stripe_payment_link;

    try {
      const stripe = await getUncachableStripeClient();

      // Find the right Stripe price by product name
      const planoNome = cand.plano === "trimestral" ? "Seletapsi Trimestral" : "Seletapsi Mensal";
      const products = await stripe.products.search({ query: `name:'${planoNome}' AND active:'true'` });

      if (products.data.length > 0) {
        const productId = products.data[0].id;
        const prices = await stripe.prices.list({ product: productId, active: true, limit: 1 });

        if (prices.data.length > 0) {
          const priceId = prices.data[0].id;

          // Create payment link with candidatura metadata
          const link = await stripe.paymentLinks.create({
            line_items: [{ price: priceId, quantity: 1 }],
            payment_method_types: ["card", "boleto"],
            metadata: { candidatura_id: String(id) },
            after_completion: {
              type: "redirect",
              redirect: { url: `https://${process.env.REPLIT_DOMAINS?.split(",")[0] ?? "seletapsi.com"}` },
            },
          });

          paymentLink = link.url;
          req.log.info({ candidatura_id: id, paymentLink }, "Stripe payment link criado");
        } else {
          req.log.warn({ planoNome }, "Nenhum preço ativo encontrado — execute o seed-seletapsi.ts");
        }
      } else {
        req.log.warn({ planoNome }, "Produto Stripe não encontrado — execute o seed-seletapsi.ts");
      }
    } catch (stripeErr) {
      req.log.error(stripeErr, "Erro ao criar link Stripe — aprovando sem pagamento automático");
    }

    // Update candidatura
    const newStatus = paymentLink ? "aguardando_pagamento" : "aprovado";
    await db.update(candidaturasTable)
      .set({
        status: newStatus,
        stripe_payment_link: paymentLink,
        pagamento_status: paymentLink ? "link_enviado" : "manual",
        atualizado_em: new Date(),
      })
      .where(eq(candidaturasTable.id, id));

    // Send payment email if we have a link and email
    if (paymentLink && cand.email) {
      sendPaymentLinkEmail({
        email: cand.email,
        nome: cand.nome,
        plano: cand.plano ?? "mensal",
        paymentUrl: paymentLink,
      }).catch((err) => req.log.error(err, "Falha ao enviar email de pagamento"));
    }

    res.json({ ok: true, status: newStatus, paymentLink });
  } catch (err) {
    req.log.error(err, "Erro ao aprovar candidatura");
    res.status(500).json({ error: "Erro interno" });
  }
});

/* ── Reject ────────────────────────────────────────────────── */
router.put("/admin/candidaturas/:id/rejeitar", requireAdmin, async (req, res): Promise<void> => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) { res.status(400).json({ error: "ID inválido" }); return; }
  try {
    await db.update(candidaturasTable)
      .set({ status: "rejeitado", atualizado_em: new Date() })
      .where(eq(candidaturasTable.id, id));
    res.json({ ok: true, status: "rejeitado" });
  } catch (err) {
    req.log.error(err, "Erro ao rejeitar candidatura");
    res.status(500).json({ error: "Erro interno" });
  }
});

/* ── Delete ────────────────────────────────────────────────── */
router.delete("/admin/candidaturas/:id", requireAdmin, async (req, res): Promise<void> => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) { res.status(400).json({ error: "ID inválido" }); return; }
  try {
    await db.delete(candidaturasTable).where(eq(candidaturasTable.id, id));
    res.json({ ok: true });
  } catch (err) {
    req.log.error(err, "Erro ao deletar candidatura");
    res.status(500).json({ error: "Erro interno" });
  }
});

export default router;
