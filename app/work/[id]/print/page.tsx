import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import PrintQR from '@/components/PrintQR'

async function getWork(id: string) {
  const { data } = await supabase
    .from('art_works')
    .select('*, art_artists(*)')
    .eq('id', id)
    .single()
  return data
}

export default async function PrintPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const work = await getWork(id)
  if (!work) notFound()

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://beforetheyrise.com'
  const workUrl = `${siteUrl}/work/${work.id}`
  const artist = work.art_artists

  return (
    <PrintQR
      workUrl={workUrl}
      title={work.title}
      artistName={artist?.name || ''}
      medium={work.medium || ''}
      dimensions={work.width_cm && work.height_cm ? `${work.width_cm} × ${work.height_cm} cm` : ''}
      year={work.year_created || ''}
      price={work.price}
      certId={work.cert_id || ''}
    />
  )
}
