import Stripe from 'stripe';

let stripeClient: Stripe | null = null;

export const getStripe = () => {
  if (!stripeClient) {
    const secretKey = process.env.STRIPE_SECRET_KEY;

    if (!secretKey) {
      return null;
    }

    stripeClient = new Stripe(secretKey, {
      apiVersion: '2026-10-28.endive',
      typescript: true,
    });
  }
  return stripeClient;
};

export const STRIPE_PRICES = {
  starter: process.env.STRIPE_PRICE_STARTER || 'price_starter_monthly',
  pro: process.env.STRIPE_PRICE_PRO || 'price_pro_monthly',
  enterprise: process.env.STRIPE_PRICE_ENTERPRISE || 'price_enterprise_monthly',
};

export const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET!;

// Backwards compatibility - will be null at build time
export const stripe = getStripe();
