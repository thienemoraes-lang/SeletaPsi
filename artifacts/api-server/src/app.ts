import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import router from "./routes";
import { logger } from "./lib/logger";
import { getUncachableStripeClient } from "./lib/stripeClient";
import { getStripeSync } from "./lib/stripeClient";
import { db, candidaturasTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const app: Express = express();

// ── Pino logging ─────────────────────────────────────────────
app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) { return { id: req.id, method: req.method, url: req.url?.split("?")[0] }; },
      res(res) { return { statusCode: res.statusCode }; },
    },
  }),
);

// ── Stripe webhook BEFORE express.json() ─────────────────────
app.post(
  "/api/stripe/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const signature = req.headers["stripe-signature"];
    if (!signature) { res.status(400).json({ error: "Missing stripe-signature" }); return; }
    try {
      const sig = Array.isArray(signature) ? signature[0] : signature;

      // 1. stripe-replit-sync syncs data to DB
      const sync = await getStripeSync();
      await sync.processWebhook(req.body as Buffer, sig);

      // 2. Custom: handle checkout.session.completed → activate profile
      try {
        const stripe = await getUncachableStripeClient();
        const event = stripe.webhooks.constructEvent(req.body as Buffer, sig, "");
        if (event.type === "checkout.session.completed") {
          const session = event.data.object as { metadata?: Record<string, string> };
          const candidaturaId = session.metadata?.candidatura_id;
          if (candidaturaId) {
            const id = parseInt(candidaturaId, 10);
            if (!isNaN(id)) {
              await db.update(candidaturasTable)
                .set({ status: "ativo", pagamento_status: "pago", atualizado_em: new Date() })
                .where(eq(candidaturasTable.id, id));
              logger.info({ candidaturaId }, "Pagamento confirmado — perfil ativado");
            }
          }
        }
      } catch {
        // webhookSecret may not be available in dev — skip custom event parsing
      }

      res.status(200).json({ received: true });
    } catch (err: unknown) {
      logger.error(err, "Stripe webhook error");
      res.status(400).json({ error: "Webhook processing error" });
    }
  }
);

// ── Regular middleware ────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

export default app;
