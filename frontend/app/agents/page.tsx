'use client'
import React, { useEffect, useMemo, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../store/store'
import { fetchAgents, deleteAgent } from '../../store/slices/agentsSlice'
import AgentForm from '../../components/AgentForm'
import AgentCard from '../../components/AgentCard'
import useRequireAuth from '../../hooks/useRequireAuth'
import api from '../../lib/api'
import { push } from '../../store/slices/notificationsSlice'
import Modal from '../../components/Modal'
import ConfirmModal from '../../components/ConfirmModal'
import Pagination from '../../components/Pagination'

export default function AgentsPage() {
    useRequireAuth()
    const dispatch = useAppDispatch()
    const { items: agents, loading } = useAppSelector((s) => s.agents)

    const [assignments, setAssignments] = useState<any[]>([])
    const [loadingAssignments, setLoadingAssignments] = useState(false)

    const [filter, setFilter] = useState('')
    // pagination state
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)

    // modal state
    const [viewModalOpen, setViewModalOpen] = useState(false)
    const [viewModalItems, setViewModalItems] = useState<any[]>([])
    const [viewAgentName, setViewAgentName] = useState<string | null>(null)

    const [confirmOpen, setConfirmOpen] = useState(false)
    const [confirmTargetAgent, setConfirmTargetAgent] = useState<{ id: string; name: string } | null>(null)

    useEffect(() => {
        dispatch(fetchAgents())
    }, [dispatch])

    useEffect(() => {
        let mounted = true
        setLoadingAssignments(true)
        api
            .get('/api/assignments')
            .then((r) => {
                if (mounted) setAssignments(r.data.assignments || [])
            })
            .catch(() => { })
            .finally(() => {
                if (mounted) setLoadingAssignments(false)
            })
        return () => {
            mounted = false
        }
    }, [])

    // derived data: filtered list
    const filteredAgents = useMemo(() => {
        const q = filter.trim().toLowerCase()
        if (!q) return agents
        return agents.filter(
            (a) =>
                a.name?.toLowerCase().includes(q) ||
                a.email?.toLowerCase().includes(q) ||
                a.phone?.toLowerCase().includes(q)
        )
    }, [agents, filter])

    const total = filteredAgents.length
    const totalPages = Math.max(1, Math.ceil(total / pageSize))
    useEffect(() => {
        if (page > totalPages) setPage(totalPages)
    }, [totalPages, page])

    const paginated = useMemo(() => {
        const start = (page - 1) * pageSize
        return filteredAgents.slice(start, start + pageSize)
    }, [filteredAgents, page, pageSize])

    const countsByAgent = useMemo(() => {
        const map = new Map<string, number>()
        for (const a of assignments) map.set(a.agentId, (map.get(a.agentId) || 0) + (a.items?.length || 0))
        return map
    }, [assignments])

    function handleViewAssigned(agentId: string, agentName?: string) {
        const agentAssignments = assignments.filter((x) => x.agentId === agentId)
        const items = agentAssignments.flatMap((a) => a.items || [])
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
            // adjust page if last item was deleted on this page
            if (paginated.length === 1 && page > 1) setPage(page - 1)
        } catch (err: any) {
            dispatch(push({ id: String(Date.now()), type: 'error', message: err?.message || 'Delete failed' }))
        } finally {
            setConfirmOpen(false)
            setConfirmTargetAgent(null)
        }
    }

    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-semibold">Agents</h1>
                    <p className="text-sm text-muted">Manage agents and view assigned items</p>
                </div>

                <div className="flex items-center gap-3">
                    <input
                        value={filter}
                        onChange={(e) => {
                            setFilter(e.target.value)
                            setPage(1)
                        }}
                        placeholder="Search agents..."
                        className="p-2 rounded border border-white/6 bg-transparent text-slate-200"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                    <div className="card p-6">
                        <h3 className="mb-3 text-lg font-medium">Create agent</h3>
                        <AgentForm
                            onCreated={() => {
                                dispatch(fetchAgents())
                                setPage(1)
                            }}
                        />
                    </div>
                </div>

                <div className="lg:col-span-2">
                    <div className="card p-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {loading ? (
                                <div>Loading agents...</div>
                            ) : (
                                paginated.map((a) => (
                                    <AgentCard
                                        key={a.id}
                                        agent={a}
                                        assignedCount={countsByAgent.get(a.id) || 0}
                                        onViewAssigned={() => handleViewAssigned(a.id, a.name)}
                                        onDelete={() => handleRequestDelete(a.id, a.name)}
                                    />
                                ))
                            )}
                        </div>

                        {/* single pagination (kept at the bottom) */}
                        <div className="mt-6">
                            <Pagination
                                page={page}
                                pageSize={pageSize}
                                total={total}
                                onPageChange={(p) => setPage(p)}
                                onPageSizeChange={(s) => {
                                    setPageSize(s)
                                    setPage(1)
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <Modal open={viewModalOpen} onClose={() => setViewModalOpen(false)} title={`Assigned to ${viewAgentName ?? ''}`}>
                {loadingAssignments ? (
                    <div>Loading assignments...</div>
                ) : viewModalItems.length ? (
                    <div className="space-y-2 max-h-[60vh] overflow-auto">
                        {viewModalItems.map((it) => (
                            <div key={it.id} className="p-3 border rounded bg-transparent">
                                <div className="font-medium">{it.firstName}</div>
                                <div className="text-sm text-muted">{it.phone}</div>
                                <div className="text-xs text-slate-400">{it.notes}</div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div>No assigned items</div>
                )}
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
