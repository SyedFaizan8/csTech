'use client'
import Link from 'next/link'

export default function Sidebar() {
    return (
        <aside className="hidden md:block w-72 bg-white border-r min-h-screen p-6">
            <div className="mb-6">
                <div className="text-xl font-semibold">Admin</div>
                <div className="text-xs text-slate-500">Dashboard</div>
            </div>
            <nav className="flex flex-col gap-2 mt-4">
                <Link href="/dashboard" className="px-3 py-2 rounded-md hover:bg-slate-50">Dashboard</Link>
                <Link href="/agents" className="px-3 py-2 rounded-md hover:bg-slate-50">Agents</Link>
                <Link href="/upload" className="px-3 py-2 rounded-md hover:bg-slate-50">Upload</Link>
            </nav>
        </aside>
    )
}
