'use client'
import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/store'
import { fetchAgents } from '@/store/slices/agentsSlice'
import AgentCard from '@/components/AgentCard'
import AgentForm from '@/components/AgentForm'
import useRequireAuth from '@/hooks/useRequireAuth'

export default function AgentsPage() {
    useRequireAuth()
    const dispatch = useAppDispatch()
    const { items: agents, loading } = useAppSelector(s => s.agents)
    useEffect(() => { dispatch(fetchAgents()) }, [dispatch])
    return (
        <div className="max-w-4xl">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-semibold">Agents</h1>
                <div className="text-sm text-slate-500">Manage your team</div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-2xl card-shadow"><h3 className="mb-3 font-medium">Create agent</h3><AgentForm /></div>
                </div>

                <div className="lg:col-span-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {loading ? <div>Loading...</div> : agents.map(a => <AgentCard key={a.id} agent={a} />)}
                        {agents.length === 0 && !loading && <div className="bg-white p-6 rounded-2xl card-shadow">No agents yet</div>}
                    </div>
                </div>
            </div>
        </div>
    )
}
