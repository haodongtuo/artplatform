'use client'
import { useState } from 'react'

interface Props {
  ex: {
    id: string
    name: string
    school: string
    city: string
    country: string
    date: string | null
    status: string
    cover_image: string | null
    description: string | null
    slug: string
  }
}

export default function ExhibitionEditRow({ ex }: Props) {
  const [open, setOpen] = useState(false)

  const statusBadge: Record<string, string> = {
    active: 'background:#d1fae5;color:#065f46',
    upcoming: 'background:#fef3c7;color:#92400e',
    closed: 'background:#f3f4f6;color:#6b7280',
  }

  return (
    <div style={{ border: '1px solid #f0f0f0', borderRadius: '6px', marginBottom: '8px', overflow: 'hidden' }}>
      {/* Row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', cursor: 'pointer', background: open ? '#fefce8' : 'white' }}
        onClick={() => setOpen(!open)}>
        <div style={{ flex: 1 }}>
          <p style={{ margin: 0, fontSize: '14px', fontWeight: 500 }}>{ex.name}</p>
          <small style={{ color: '#999', fontSize: '12px' }}>{ex.school} · {ex.city}, {ex.country} {ex.date ? `· ${ex.date}` : ''}</small>
        </div>
        <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '20px', ...(Object.fromEntries((statusBadge[ex.status] || '').split(';').filter(Boolean).map(s => s.split(':')))) }}>
          {ex.status}
        </span>
        <code style={{ fontSize: '11px', color: '#999' }}>/exhibition/{ex.slug}</code>
        <span style={{ fontSize: '12px', color: '#d97706', marginLeft: '8px' }}>{open ? '▲ Close' : '✏️ Edit'}</span>
      </div>

      {/* Edit form */}
      {open && (
        <div style={{ padding: '16px', background: '#fffbeb', borderTop: '1px solid #fde68a' }}>
          <form method="POST" action="/api/admin-exhibition-update">
            <input type="hidden" name="id" value={ex.id} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Exhibition Name</label>
                <input name="name" defaultValue={ex.name} style={{ width: '100%', border: '1px solid #e5e5e5', borderRadius: '4px', padding: '8px 12px', fontSize: '14px', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>School</label>
                <input name="school" defaultValue={ex.school} style={{ width: '100%', border: '1px solid #e5e5e5', borderRadius: '4px', padding: '8px 12px', fontSize: '14px', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>City</label>
                <input name="city" defaultValue={ex.city} style={{ width: '100%', border: '1px solid #e5e5e5', borderRadius: '4px', padding: '8px 12px', fontSize: '14px', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Country</label>
                <input name="country" defaultValue={ex.country} style={{ width: '100%', border: '1px solid #e5e5e5', borderRadius: '4px', padding: '8px 12px', fontSize: '14px', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Date</label>
                <input name="date" type="date" defaultValue={ex.date || ''} style={{ width: '100%', border: '1px solid #e5e5e5', borderRadius: '4px', padding: '8px 12px', fontSize: '14px', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Status</label>
                <select name="status" defaultValue={ex.status} style={{ width: '100%', border: '1px solid #e5e5e5', borderRadius: '4px', padding: '8px 12px', fontSize: '14px', boxSizing: 'border-box' }}>
                  <option value="upcoming">Upcoming</option>
                  <option value="active">Active</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
              <div style={{ gridColumn: '1/-1' }}>
                <label style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Cover Image URL</label>
                <input name="cover_image" defaultValue={ex.cover_image || ''} placeholder="https://…" style={{ width: '100%', border: '1px solid #e5e5e5', borderRadius: '4px', padding: '8px 12px', fontSize: '14px', boxSizing: 'border-box' }} />
              </div>
              <div style={{ gridColumn: '1/-1' }}>
                <label style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Description</label>
                <textarea name="description" defaultValue={ex.description || ''} style={{ width: '100%', border: '1px solid #e5e5e5', borderRadius: '4px', padding: '8px 12px', fontSize: '14px', height: '80px', resize: 'vertical', boxSizing: 'border-box' }} />
              </div>
            </div>
            <button type="submit" style={{ background: '#d97706', color: 'white', border: 'none', padding: '10px 20px', fontSize: '13px', cursor: 'pointer', borderRadius: '4px', marginTop: '12px' }}>
              Save Changes
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
