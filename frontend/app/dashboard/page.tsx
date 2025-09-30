'use client'
import useRequireAuth from '@/hooks/useRequireAuth'
import { useAppSelector } from '@/store/store'
import Link from 'next/link'

export default function Dashboard() {
    const { user, loading } = useRequireAuth()
    const agents = useAppSelector(s => s.agents.items)
    if (loading) return <div>Loading...</div>
    return (
        <div>
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">Dashboard</h1>
                <div className="space-x-2">
                    <Link href="/upload" className="px-4 py-2 bg-indigo-600 text-white rounded-lg">Upload CSV</Link>
                    <Link href="/agents" className="px-4 py-2 border rounded-lg">Agents</Link>
                </div>
            </div>
            <section className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                {agents.map(a => (<div key={a.id} className="bg-white p-4 rounded-2xl card-shadow"><h3>{a.name}</h3><p className="text-sm">{a.email}</p></div>))}
                {agents.length === 0 && <div className="col-span-full bg-white p-6 rounded-2xl card-shadow">No agents yet</div>}
            </section>
        </div>
    )
}
