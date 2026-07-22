export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 bg-[#1a1a1a] text-white overflow-auto">
      {children}
    </div>
  )
}
