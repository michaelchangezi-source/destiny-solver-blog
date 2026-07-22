export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <style>{`
        body > header, body > footer { display: none !important; }
        body > main { padding: 0 !important; }
      `}</style>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          background: '#1a1a1a',
          color: '#fff',
          overflow: 'auto',
        }}
      >
        {children}
      </div>
    </>
  )
}
