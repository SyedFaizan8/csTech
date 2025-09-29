import Link from 'next/link'
export default function Sidebar() {
    return (
        <aside className="w-64 bg-white border-r min-h-screen p-4 hidden md:block">
            <div className="mb-6">
                <h2 className="text-lg font-semibold">Admin</h2>
                <p className="text-sm text-slate-500">Dashboard</p>
            </div>
            <nav className="space-y-2">
                <Link href="/dashboard" className="block px-3 py-2 rounded-lg hover:bg-gray-50">Dashboard</Link>
                <Link href="/agents" className="block px-3 py-2 rounded-lg hover:bg-gray-50">Agents</Link>
                <Link href="/upload" className="block px-3 py-2 rounded-lg hover:bg-gray-50">Upload List</Link>
            </nav>
        </aside>
    )
}
