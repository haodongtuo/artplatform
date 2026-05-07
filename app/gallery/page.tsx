import { supabase } from '@/lib/supabase'
import GalleryFilters from '@/components/GalleryFilters'
import { headers } from 'next/headers'

export const revalidate = 60

async function getAllWorks() {
  const { data } = await supabase
    .from('art_works')
    .select('*, art_artists(*), exhibitions(city, name, slug)')
    .order('created_at', { ascending: false })
  return data || []
}

async function getCities() {
  const { data } = await supabase
    .from('exhibitions')
    .select('city')
    .order('city')
  const unique = Array.from(new Set((data || []).map(r => r.city).filter(Boolean))) as string[]
  return unique
}

export default async function GalleryPage() {
  const [works, cities] = await Promise.all([getAllWorks(), getCities()])
  const mediums = Array.from(new Set(works.map((w) => w.medium).filter(Boolean))) as string[]

  // Netlify IP 地理位置（x-nf-geo header）
  const headerStore = await headers()
  const geoHeader = headerStore.get('x-nf-geo')
  let detectedCity: string | null = null
  if (geoHeader) {
    try {
      const geo = JSON.parse(geoHeader)
      detectedCity = geo.city || null
    } catch {}
  }

  // 找到最近匹配的城市
  const suggestedCity = detectedCity
    ? cities.find(c => c.toLowerCase().includes(detectedCity!.toLowerCase().split(',')[0]))
    : null

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="serif text-4xl font-light">Gallery</h1>
        <p className="text-gray-400 text-sm mt-1">All works · All exhibitions · Worldwide</p>
      </div>

      <GalleryFilters works={works} mediums={mediums} cities={cities} suggestedCity={suggestedCity} />
    </div>
  )
}
