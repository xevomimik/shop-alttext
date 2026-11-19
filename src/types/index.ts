export interface User {
  id: string
  email: string
  shopify_shop?: string
  shopify_access_token?: string
  plan: 'free' | 'starter' | 'pro' | 'enterprise'
  created_at: string
  updated_at: string
}

export interface AltTextJob {
  id: string
  user_id: string
  shopify_product_id: number
  shopify_image_id?: number
  image_url: string
  alt_text?: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  model_used?: string
  tokens_used?: number
  error_message?: string
  created_at: string
  completed_at?: string
}

export interface UsageEvent {
  id: string
  user_id: string
  event_type: 'alt_text_generated' | 'api_call' | 'webhook_received'
  metadata: Record<string, unknown>
  created_at: string
}

export interface ShopifyProduct {
  id: number
  title: string
  handle: string
  images: ShopifyImage[]
}

export interface ShopifyImage {
  id: number
  src: string
  alt: string | null
  product_id: number
}

export interface GenerateAltTextRequest {
  image_url: string
  product_id: number
  image_id?: number
}

export interface GenerateAltTextResponse {
  job_id: string
  alt_text?: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
}
