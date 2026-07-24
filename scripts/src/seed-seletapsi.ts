import { getUncachableStripeClient } from './stripeClient';

async function createProducts() {
  const stripe = await getUncachableStripeClient();

  // --- Plano Mensal ---
  const mensal = await stripe.products.search({ query: "name:'Seletapsi Mensal' AND active:'true'" });
  if (mensal.data.length > 0) {
    console.log('Plano Mensal já existe:', mensal.data[0].id);
  } else {
    const p = await stripe.products.create({
      name: 'Seletapsi Mensal',
      description: 'Anúncio mensal na plataforma Seletapsi',
    });
    const price = await stripe.prices.create({
      product: p.id,
      unit_amount: 4900, // R$ 49,00
      currency: 'brl',
    });
    console.log(`✓ Plano Mensal criado — product: ${p.id} | price: ${price.id}`);
  }

  // --- Plano Trimestral ---
  const trimestral = await stripe.products.search({ query: "name:'Seletapsi Trimestral' AND active:'true'" });
  if (trimestral.data.length > 0) {
    console.log('Plano Trimestral já existe:', trimestral.data[0].id);
  } else {
    const p = await stripe.products.create({
      name: 'Seletapsi Trimestral',
      description: 'Anúncio trimestral na plataforma Seletapsi (≈ R$ 39/mês)',
    });
    const price = await stripe.prices.create({
      product: p.id,
      unit_amount: 11700, // R$ 117,00
      currency: 'brl',
    });
    console.log(`✓ Plano Trimestral criado — product: ${p.id} | price: ${price.id}`);
  }
}

createProducts().catch(err => { console.error(err); process.exit(1); });
