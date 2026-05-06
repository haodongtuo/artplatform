import { supabase } from '@/lib/supabase'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export const revalidate = 60

async function getCertificateData(certId: string) {
  const { data: work } = await supabase
    .from('art_works')
    .select('*, art_artists(*)')
    .eq('cert_id', certId)
    .single()
  if (!work) return null

  const { data: order } = await supabase
    .from('art_orders')
    .select('*')
    .eq('work_id', work.id)
    .eq('status', 'completed')
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  return { work, order }
}

export default async function CertificatePage({ params }: { params: Promise<{ cert_id: string }> }) {
  const { cert_id } = await params
  const result = await getCertificateData(cert_id)
  if (!result) notFound()

  const { work, order } = result
  const artist = work.art_artists
  const purchaseDate = order?.created_at
    ? new Date(order.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : null
  const buyerFirstName = order?.buyer_name?.split(' ')[0] || null

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="no-print text-center mb-8">
          <Link href={`/work/${work.id}`} className="text-sm text-gray-400 hover:text-black">
            ← Back to Artwork
          </Link>
        </div>

        {/* Certificate */}
        <div className="certificate-print bg-white shadow-sm p-10">
          {/* Header */}
          <div className="text-center mb-8 pb-8 border-b-2 border-black">
            <p className="text-xs tracking-[0.4em] uppercase text-gray-400 mb-3">Certificate of Authenticity</p>
            <h1 className="serif text-5xl font-light mb-2">Art Exhibition</h1>
            <p className="text-sm text-gray-500">University Graduation Show 2026</p>
          </div>

          {/* Verified badge */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center gap-2 border border-green-200 bg-green-50 text-green-700 px-4 py-2 rounded-full">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium">Verified Original Work</span>
            </div>
          </div>

          {/* Artwork */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="relative aspect-square bg-gray-50 rounded-sm overflow-hidden">
              {work.image_url ? (
                <Image src={work.image_url} alt={work.title} fill className="object-contain p-4" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="serif italic text-2xl text-gray-200">No Image</span>
                </div>
              )}
            </div>

            <div className="flex flex-col justify-center space-y-4">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Artwork</p>
                <h2 className="serif text-2xl font-medium">{work.title}</h2>
              </div>

              {artist && (
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Artist</p>
                  <p className="font-medium">{artist.name}</p>
                  {artist.school && <p className="text-sm text-gray-500">{artist.school}</p>}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">Medium</p>
                  <p>{work.medium}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">Year</p>
                  <p>{work.year_created}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">Dimensions</p>
                  <p>{work.width_cm} × {work.height_cm} cm</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">Price Paid</p>
                  <p className="font-medium">${order?.amount || work.price}</p>
                </div>
              </div>

              {buyerFirstName && (
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">Collector</p>
                  <p className="font-medium">{buyerFirstName}</p>
                </div>
              )}

              {purchaseDate && (
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">Purchase Date</p>
                  <p className="text-sm">{purchaseDate}</p>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="border-t-2 border-black pt-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Certificate Number</p>
              <p className="font-mono text-sm tracking-wider">{work.cert_id}</p>
            </div>
            <div className="text-right">
              <p className="serif text-2xl font-light italic">Art Exhibition 2026</p>
              <p className="text-xs text-gray-400 mt-1">Verify at: /certificate/{work.cert_id}</p>
            </div>
          </div>
        </div>

        {/* Print button */}
        <div className="text-center mt-8 no-print">
          <button
            onClick={() => window.print()}
            className="bg-black text-white px-8 py-3 text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            Print Certificate
          </button>
        </div>
      </div>
    </div>
  )
}
