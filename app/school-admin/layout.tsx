export default function SchoolAdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontFamily: '-apple-system, sans-serif', background: '#f9fafb', minHeight: '100vh', color: '#111' }}>
      {children}
    </div>
  )
}
