import { supabase } from '@/lib/supabase'
import WorkCard from '@/components/WorkCard'
import GalleryFilters from '@/components/GalleryFilters'

export const revalidate = 60

async function getAllWorks() {
  const { data } = await supabase
    .from('art_works')
    .select('*, art_artists(*)')
    .order('created_at', { ascending: false })
  return data || []
}

export default async function GalleryPage() {
  const works = await getAllWorks()
  const mediums = Array.from(new Set(works.map((w) => w.medium).filter(Boolean))) as string[]

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="mb-10">
        <h1 className="serif text-4xl font-light">Gallery</h1>
        <p className="text-gray-400 text-sm mt-1">University Art Exhibition 2026</p>
      </div>

      <GalleryFilters works={works} mediums={mediums} />
    </div>
  )
}
