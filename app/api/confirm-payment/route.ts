import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://beforetheyrise.com'

export async function POST(req: NextRequest) {
  try {
    const { workId, buyerName, buyerEmail } = await req.json()

    if (!workId || !buyerName || !buyerEmail) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Get work + artist
    const { data: work, error } = await supabaseAdmin
      .from('art_works')
      .select('*, art_artists(*)')
      .eq('id', workId)
      .single()

    if (error || !work) {
      return NextResponse.json({ error: 'Work not found' }, { status: 404 })
    }

    if (work.status === 'sold') {
      return NextResponse.json({ error: 'This work has already been sold' }, { status: 400 })
    }

    const artist = work.art_artists
    const certUrl = `${siteUrl}/certificate/${work.cert_id}`

    // Mark as sold + create order
    await Promise.all([
      supabaseAdmin
        .from('art_works')
        .update({ status: 'sold' })
        .eq('id', workId),
      supabaseAdmin
        .from('art_orders')
        .insert({
          work_id: workId,
          buyer_name: buyerName,
          buyer_email: buyerEmail,
          amount: work.price,
          stripe_payment_id: `venmo-zelle-${Date.now()}`,
          status: 'completed',
        }),
    ])

    // Send certificate email
    await resend.emails.send({
      from: 'Before They Rise <noreply@bighongshu.com>',
      to: buyerEmail,
      subject: `Your Certificate of Authenticity — ${work.title}`,
      html: `
        <div style="font-family: Georgia, serif; max-width: 560px; margin: 0 auto; padding: 40px 24px; color: #111;">
          <p style="font-size: 12px; letter-spacing: 0.3em; text-transform: uppercase; color: #d97706; margin-bottom: 32px;">Before They Rise</p>

          <h1 style="font-size: 28px; font-weight: 300; margin-bottom: 8px;">Thank you, ${buyerName}.</h1>
          <p style="color: #666; font-size: 15px; margin-bottom: 32px;">
            You've just collected an original work from an emerging artist. Here's your certificate of authenticity.
          </p>

          <div style="border: 1px solid #e5e5e5; border-radius: 8px; padding: 24px; margin-bottom: 32px; background: #fdfaf5;">
            <p style="font-size: 20px; font-weight: 500; margin: 0 0 4px;">${work.title}</p>
            <p style="color: #666; font-size: 14px; margin: 0 0 20px;">by ${artist?.name || 'Unknown Artist'}</p>
            <table style="width: 100%; font-size: 13px; color: #555; border-collapse: collapse;">
              ${work.medium ? `<tr><td style="padding: 4px 0; color: #999;">Medium</td><td>${work.medium}</td></tr>` : ''}
              ${work.width_cm && work.height_cm ? `<tr><td style="padding: 4px 0; color: #999;">Dimensions</td><td>${work.width_cm} × ${work.height_cm} cm</td></tr>` : ''}
              ${work.year_created ? `<tr><td style="padding: 4px 0; color: #999;">Year</td><td>${work.year_created}</td></tr>` : ''}
              <tr><td style="padding: 4px 0; color: #999;">Certificate No.</td><td style="font-family: monospace;">${work.cert_id}</td></tr>
              <tr><td style="padding: 4px 0; color: #999;">Collected by</td><td>${buyerName}</td></tr>
              <tr><td style="padding: 4px 0; color: #999;">Purchase Price</td><td>$${work.price}</td></tr>
            </table>
          </div>

          <a href="${certUrl}"
            style="display: inline-block; background: #111; color: white; text-decoration: none; padding: 14px 32px; font-size: 14px; border-radius: 4px; margin-bottom: 32px;">
            View Full Certificate →
          </a>

          <p style="color: #999; font-size: 12px; line-height: 1.8; border-top: 1px solid #f0f0f0; padding-top: 24px;">
            This certificate is permanently recorded on <a href="${siteUrl}" style="color: #d97706;">beforetheyrise.com</a>
            and verifiable by anyone at any time. The artwork is now part of your collection.
          </p>

          <p style="color: #ccc; font-size: 11px; font-style: italic; margin-top: 8px;">
            "The best time to collect art is before everyone else knows the name."
          </p>
        </div>
      `,
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('confirm-payment error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
