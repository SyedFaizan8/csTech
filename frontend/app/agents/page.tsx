'use client'
import React, { useEffect, useMemo, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/store'
import { fetchAgents, deleteAgent } from '@/store/slices/agentsSlice'
import AgentForm from '@/components/AgentForm'
import AgentCard from '@/components/AgentCard'
import useRequireAuth from '@/hooks/useRequireAuth'
import api from '@/lib/api'
import { push } from '@/store/slices/notificationsSlice'
import Modal from '@/components/Modal'
import ConfirmModal from '@/components/ConfirmModal'

export default function AgentsPage() {
    useRequireAuth()
    const dispatch = useAppDispatch()
    const { items: agents, loading } = useAppSelector(s => s.agents)
    const [assignments, setAssignments] = useState<any[]>([])
    const [loadingAssignments, setLoadingAssignments] = useState(false)

    const [viewModalOpen, setViewModalOpen] = useState(false)
    const [viewModalItems, setViewModalItems] = useState<any[]>([])
    const [viewAgentName, setViewAgentName] = useState<string | null>(null)

    const [confirmOpen, setConfirmOpen] = useState(false)
    const [confirmTargetAgent, setConfirmTargetAgent] = useState<{ id: string; name: string } | null>(null)

    useEffect(() => { dispatch(fetchAgents()) }, [dispatch])
    useEffect(() => {
        let mounted = true
        setLoadingAssignments(true)
        api.get('/api/assignments').then(r => { if (mounted) setAssignments(r.data.assignments || []) }).catch(() => { }).finally(() => { if (mounted) setLoadingAssignments(false) })
        return () => { mounted = false }
    }, [])

    const countsByAgent = useMemo(() => {
        const map = new Map<string, number>()
        for (const a of assignments) map.set(a.agentId, (map.get(a.agentId) || 0) + (a.items?.length || 0))
        return map
    }, [assignments])

    function handleViewAssigned(agentId: string, agentName?: string) {
        const agentAssignments = assignments.filter(x => x.agentId === agentId)
        const items = agentAssignments.flatMap(a => a.items || [])
        setViewModalItems(items)
        setViewAgentName(agentName ?? null)
        setViewModalOpen(true)
    }

    function handleRequestDelete(agentId: string, name: string) {
        setConfirmTargetAgent({ id: agentId, name })
        setConfirmOpen(true)
    }

    async function handleConfirmDelete() {
        if (!confirmTargetAgent) return
        try {
            await dispatch(deleteAgent(confirmTargetAgent.id)).unwrap()
            dispatch(push({ id: String(Date.now()), type: 'success', message: 'Agent deleted' }))
            const r = await api.get('/api/assignments')
            setAssignments(r.data.assignments || [])
        } catch (err: any) {
            dispatch(push({ id: String(Date.now()), type: 'error', message: err?.message || 'Delete failed' }))
        } finally {
            setConfirmOpen(false); setConfirmTargetAgent(null)
        }
    }

    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-semibold">Agents</h1>
                <div className="text-sm text-slate-500">Manage your team</div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-2xl card">
                        <h3 className="mb-3 font-medium">Create agent</h3>
                        <AgentForm onCreated={() => dispatch(fetchAgents())} />
                    </div>
                </div>

                <div className="lg:col-span-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {loading ? <div>Loading agents...</div> : agents.map(a => (
                            <AgentCard
                                key={a.id}
                                agent={a}
                                assignedCount={countsByAgent.get(a.id) || 0}
                                onViewAssigned={() => handleViewAssigned(a.id, a.name)}
                                onDelete={() => handleRequestDelete(a.id, a.name)}
                            />
                        ))}
                        {agents.length === 0 && !loading && <div className="bg-white p-6 rounded-2xl card">No agents yet</div>}
                    </div>
                </div>
            </div>

            <Modal open={viewModalOpen} onClose={() => setViewModalOpen(false)} title={`Assigned to ${viewAgentName ?? ''}`}>
                {loadingAssignments ? <div>Loading...</div> : viewModalItems.length ? (
                    <div className="space-y-2 max-h-[60vh] overflow-auto">
                        {viewModalItems.map(it => (
                            <div key={it.id} className="p-3 border rounded">
                                <div className="font-medium">{it.firstName}</div>
                                <div className="text-sm text-slate-500">{it.phone}</div>
                                <div className="text-xs text-slate-400">{it.notes}</div>
                            </div>
                        ))}
                    </div>
                ) : <div>No assigned items</div>}
            </Modal>

            <ConfirmModal
                open={confirmOpen}
                title="Delete Agent"
                description={`Delete agent "${confirmTargetAgent?.name}"? This removes assignments and unassigns their items.`}
                onCancel={() => setConfirmOpen(false)}
                onConfirm={handleConfirmDelete}
            />
        </div>
    )
}
