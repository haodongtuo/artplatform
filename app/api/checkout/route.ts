import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { supabaseAdmin } from '@/lib/supabase'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder')

export async function POST(req: NextRequest) {
  try {
    const { workId, buyerName, buyerEmail } = await req.json()

    // Get work details
    const { data: work, error } = await supabaseAdmin
      .from('art_works')
      .select('*, art_artists(*)')
      .eq('id', workId)
      .single()

    if (error || !work) {
      return NextResponse.json({ error: 'Work not found' }, { status: 404 })
    }

    if (work.status !== 'available') {
      return NextResponse.json({ error: 'This work is no longer available' }, { status: 400 })
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://your-site.netlify.app'

    // Reserve the work
    await supabaseAdmin
      .from('art_works')
      .update({ status: 'reserved' })
      .eq('id', workId)

    // Create Stripe session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: buyerEmail,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            unit_amount: Math.round(work.price * 100),
            product_data: {
              name: work.title,
              description: `Original artwork by ${work.art_artists?.name || 'Artist'} · ${work.medium}`,
              images: work.image_url ? [work.image_url] : [],
            },
          },
          quantity: 1,
        },
      ],
      success_url: `${siteUrl}/purchase-success?cert=${work.cert_id}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/work/${workId}`,
      metadata: {
        workId,
        buyerName,
        buyerEmail,
        certId: work.cert_id,
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('Checkout error:', err)
    // If Stripe is not configured, return a friendly error
    return NextResponse.json(
      { error: 'Payment system not configured yet. Please contact the organizer.' },
      { status: 500 }
    )
  }
}
