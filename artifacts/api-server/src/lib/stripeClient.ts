import Stripe from 'stripe';

function getSecretKey(): string {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error('STRIPE_SECRET_KEY não configurado. Adicione a chave secreta do Stripe nos Secrets do Replit.');
  return key;
}

export async function getUncachableStripeClient(): Promise<Stripe> {
  return new Stripe(getSecretKey());
}

// Kept for compatibility with index.ts — no-op if Stripe not configured
export async function getStripeSync() {
  return null;
}
