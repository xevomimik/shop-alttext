import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { getStripe, STRIPE_WEBHOOK_SECRET } from '@/lib/stripe';
import { createServerClient } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 });
  }

  const stripe = getStripe();

  // Guard for build time
  if (!stripe) {
    return NextResponse.json({ error: 'Service unavailable' }, { status: 503 });
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 });
  }

  const supabase = createServerClient();

  // Guard for build time
  if (!supabase) {
    return NextResponse.json({ error: 'Service unavailable' }, { status: 503 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const userId = session.metadata?.user_id;

        if (userId) {
          const priceId = session.line_items?.data[0]?.price?.id;
          let plan = 'starter';

          if (priceId === process.env.STRIPE_PRICE_PRO) plan = 'pro';
          else if (priceId === process.env.STRIPE_PRICE_ENTERPRISE) plan = 'enterprise';

          await supabase.from('users').upsert({
            id: userId,
            plan,
            updated_at: new Date().toISOString(),
          });
        }
        break;
      }

      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        const userId = subscription.metadata?.user_id;

        if (userId) {
          const status = subscription.status;
          let plan = 'free';

          if (status === 'active') {
            const priceId = subscription.items.data[0]?.price?.id;
            if (priceId === process.env.STRIPE_PRICE_PRO) plan = 'pro';
            else if (priceId === process.env.STRIPE_PRICE_ENTERPRISE) plan = 'enterprise';
            else plan = 'starter';
          }

          await supabase.from('users').upsert({
            id: userId,
            plan,
            updated_at: new Date().toISOString(),
          });
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object;
        const userId = invoice.metadata?.user_id;

        if (userId) {
          console.log(`Payment failed for user ${userId}`);
        }
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}
