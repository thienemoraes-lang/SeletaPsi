import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import router from "./routes";
import { logger } from "./lib/logger";
import { getUncachableStripeClient } from "./lib/stripeClient";
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
      const stripe = await getUncachableStripeClient();
      const sig = Array.isArray(signature) ? signature[0] : signature;

      // Parse the event (without webhook secret verification in dev; add STRIPE_WEBHOOK_SECRET for prod)
      let event: { type: string; data: { object: Record<string, unknown> } };
      const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
      if (webhookSecret) {
        event = stripe.webhooks.constructEvent(req.body as Buffer, sig, webhookSecret) as typeof event;
      } else {
        event = JSON.parse((req.body as Buffer).toString()) as typeof event;
      }

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
