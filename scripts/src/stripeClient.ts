import Stripe from "stripe";

export function getUncachableStripeClient(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY não configurado nos Secrets do Replit.");
  return new Stripe(key);
}
