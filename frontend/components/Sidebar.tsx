'use client'
import Link from 'next/link'
export default function Sidebar() {
    return (
        <aside className="hidden md:block w-64 bg-white border-r min-h-screen p-4">
            <div className="mb-6">
                <h2 className="text-lg font-semibold">Admin</h2>
            </div>
            <nav className="space-y-2">
                <Link href="/dashboard" className="block px-3 py-2 rounded-lg hover:bg-gray-50">Dashboard</Link>
                <Link href="/agents" className="block px-3 py-2 rounded-lg hover:bg-gray-50">Agents</Link>
                <Link href="/upload" className="block px-3 py-2 rounded-lg hover:bg-gray-50">Upload</Link>
            </nav>
        </aside>
    )
}
