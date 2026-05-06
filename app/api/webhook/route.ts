import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { supabaseAdmin } from '@/lib/supabase'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder')

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
  } catch (err) {
    console.error('Webhook signature error:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const session = event.data.object as any
    const { workId, buyerName, buyerEmail, certId } = session.metadata || {}

    if (workId && buyerEmail) {
      // Mark work as sold
      await supabaseAdmin
        .from('art_works')
        .update({ status: 'sold' })
        .eq('id', workId)

      // Create order record
      await supabaseAdmin.from('art_orders').insert({
        work_id: workId,
        buyer_name: buyerName || '',
        buyer_email: buyerEmail,
        amount: (session.amount_total || 0) / 100,
        stripe_payment_id: session.payment_intent as string,
        status: 'completed',
      })

      console.log(`Order created for work ${workId}, cert ${certId}`)
    }
  }

  if (event.type === 'checkout.session.expired') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const session = event.data.object as any
    const { workId } = session.metadata || {}
    // Release reserved work
    if (workId) {
      await supabaseAdmin
        .from('art_works')
        .update({ status: 'available' })
        .eq('id', workId)
        .eq('status', 'reserved')
    }
  }

  return NextResponse.json({ received: true })
}
