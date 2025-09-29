'use client'
import { useEffect, useState } from 'react'
import axios from 'axios'
import AgentCard from '@/components/AgentCard'
import Link from 'next/link'

export default function Dashboard() {
    const [agents, setAgents] = useState<any[]>([])

    useEffect(() => {
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/agents`, { withCredentials: true })
            .then(r => setAgents(r.data))
            .catch(() => {/* ignore for now */ })
    }, [])

    return (
        <div>
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">Dashboard</h1>
                <div className="space-x-2">
                    <Link href="/upload" className="px-4 py-2 bg-indigo-600 text-white rounded-lg">Upload CSV</Link>
                    <Link href="/agents" className="px-4 py-2 border rounded-lg">Manage Agents</Link>
                </div>
            </div>

            <section className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                {agents.map(a => <AgentCard key={a.id} agent={a} />)}
                {agents.length === 0 && (
                    <div className="col-span-full bg-white p-6 rounded-xl card-shadow text-center">No agents yet. Create some in <a href="/agents" className="text-indigo-600">Agents</a>.</div>
                )}
            </section>
        </div>
    )
}
