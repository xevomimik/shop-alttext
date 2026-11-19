import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { GenerateAltTextResponse } from '@/types'
import { z } from 'zod'

const schema = z.object({
  image_url: z.string().url(),
  product_id: z.number().int().positive(),
  image_id: z.number().int().positive().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = schema.safeParse(body)
    
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const { image_url, product_id, image_id } = parsed.data

    const supabase = createServerClient()
    
    // Guard for build time
    if (!supabase) {
      return NextResponse.json(
        { error: 'Service unavailable' },
        { status: 503 }
      )
    }

    const { data: job, error } = await supabase
      .from('alt_text_jobs')
      .insert({
        user_id: '00000000-0000-0000-0000-000000000000',
        shopify_product_id: product_id,
        shopify_image_id: image_id,
        image_url,
        status: 'pending',
      })
      .select()
      .single()

    if (error) {
      console.error('Job creation error:', error)
      return NextResponse.json(
        { error: 'Failed to create job' },
        { status: 500 }
      )
    }

    const response: GenerateAltTextResponse = {
      job_id: job.id,
      status: 'pending',
    }

    return NextResponse.json(response, { status: 201 })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
