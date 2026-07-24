import app from "./app";
import { logger } from "./lib/logger";
import { getUncachableStripeClient } from "./lib/stripeClient";

const rawPort = process.env["PORT"];
if (!rawPort) throw new Error("PORT environment variable is required but was not provided.");
const port = Number(rawPort);
if (Number.isNaN(port) || port <= 0) throw new Error(`Invalid PORT value: "${rawPort}"`);

async function initStripe() {
  try {
    const stripe = await getUncachableStripeClient();
    const account = await stripe.accounts.retrieve();
    logger.info({ accountId: account.id }, "Stripe conectado com sucesso");
  } catch (err) {
    logger.error(err, "Stripe init error — continuing without Stripe");
  }
}

await initStripe();

app.listen(port, (err) => {
  if (err) { logger.error({ err }, "Error listening on port"); process.exit(1); }
  logger.info({ port }, "Server listening");
});
