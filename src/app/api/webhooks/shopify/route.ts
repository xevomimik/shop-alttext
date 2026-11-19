import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { createServerClient } from '@/lib/supabase';
import crypto from 'crypto';

const SHOPIFY_WEBHOOK_SECRET = process.env.SHOPIFY_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  const body = await request.text();
  const headersList = await headers();
  const hmacHeader = headersList.get('x-shopify-hmac-sha256');
  const shopDomain = headersList.get('x-shopify-shop-domain');
  const topic = headersList.get('x-shopify-topic');

  if (!hmacHeader || !shopDomain) {
    return NextResponse.json({ error: 'Missing required headers' }, { status: 400 });
  }

  // Verify HMAC
  const generatedHash = crypto
    .createHmac('sha256', SHOPIFY_WEBHOOK_SECRET)
    .update(body, 'utf8')
    .digest('base64');

  if (generatedHash !== hmacHeader) {
    console.error('Shopify webhook HMAC verification failed');
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  const supabase = createServerClient();

  // Guard for build time
  if (!supabase) {
    return NextResponse.json({ error: 'Service unavailable' }, { status: 503 });
  }

  const payload = JSON.parse(body);

  try {
    switch (topic) {
      case 'app/uninstalled': {
        const { error } = await supabase
          .from('users')
          .update({
            shopify_shop: null,
            shopify_access_token: null,
            updated_at: new Date().toISOString(),
          })
          .eq('shopify_shop', shopDomain);

        if (error) console.error('Uninstall cleanup error:', error);
        break;
      }

      case 'products/create':
      case 'products/update': {
        const product = payload as {
          id: number;
          images: Array<{ id: number; src: string; alt: string | null }>;
        };

        if (product.images && product.images.length > 0) {
          for (const image of product.images) {
            if (!image.alt || image.alt.trim() === '') {
              await supabase.from('alt_text_jobs').insert({
                user_id: '00000000-0000-0000-0000-000000000000',
                shopify_product_id: product.id,
                shopify_image_id: image.id,
                image_url: image.src,
                status: 'pending',
              });
            }
          }
        }
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Shopify webhook error:', error);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}
