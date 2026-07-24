import { getStripeSync } from './stripeClient';
import { db, candidaturasTable } from '@workspace/db';
import { eq } from 'drizzle-orm';
import { logger } from './logger';

export class WebhookHandlers {
  static async processWebhook(payload: Buffer, signature: string): Promise<void> {
    if (!Buffer.isBuffer(payload)) {
      throw new Error(
        'STRIPE WEBHOOK ERROR: Payload must be a Buffer. ' +
        'This usually means express.json() parsed the body before this handler. ' +
        'FIX: Register the webhook route BEFORE app.use(express.json()).'
      );
    }
    const sync = await getStripeSync();
    await sync.processWebhook(payload, signature);
  }

  /** Called after stripe-replit-sync processes a checkout.session.completed event */
  static async onCheckoutComplete(sessionMetadata: Record<string, string>) {
    const { candidatura_id } = sessionMetadata;
    if (!candidatura_id) return;

    const id = parseInt(candidatura_id, 10);
    if (isNaN(id)) return;

    await db
      .update(candidaturasTable)
      .set({ status: 'ativo', atualizado_em: new Date() })
      .where(eq(candidaturasTable.id, id));

    logger.info({ candidatura_id }, 'Pagamento confirmado — perfil ativado');
  }
}
