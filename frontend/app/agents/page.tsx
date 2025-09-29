'use client'
import { useEffect, useState } from 'react'
import axios from 'axios'
import AgentForm from '@/components/AgentForm'
import AgentCard from '@/components/AgentCard'

export default function AgentsPage() {
    const [agents, setAgents] = useState<any[]>([])

    async function load() {
        try {
            const r = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/agents`, { withCredentials: true })
            setAgents(r.data)
        } catch (err) { console.error(err) }
    }

    useEffect(() => { load() }, [])

    return (
        <div className="max-w-4xl">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">Agents</h1>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="col-span-1 md:col-span-1">
                    <div className="bg-white p-4 rounded-xl card-shadow">
                        <h3 className="font-medium mb-3">Create agent</h3>
                        <AgentForm onCreated={load} />
                    </div>
                </div>

                <div className="col-span-2">
                    <div className="space-y-3">
                        {agents.map(a => <AgentCard key={a.id} agent={a} />)}
                        {agents.length === 0 && <div className="bg-white p-6 rounded-xl card-shadow">No agents. Create one on the left.</div>}
                    </div>
                </div>
            </div>
        </div>
    )
}
