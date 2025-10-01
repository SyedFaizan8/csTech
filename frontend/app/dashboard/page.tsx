'use client'
import useRequireAuth from '@/hooks/useRequireAuth'
import { useAppSelector, useAppDispatch } from '@/store/store'
import { useEffect, useMemo, useState } from 'react'
import { fetchAgents } from '@/store/slices/agentsSlice'
import api from '@/lib/api'
import Pagination from '@/components/Pagination'

export default function Dashboard() {
    const { user, loading } = useRequireAuth()
    const dispatch = useAppDispatch()
    const agents = useAppSelector(s => s.agents.items)
    const [assignments, setAssignments] = useState<any[]>([])
    const [loadingAssignments, setLoadingAssignments] = useState(false)

    // pagination for agents
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(6)

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

    const total = agents.length
    const totalPages = Math.max(1, Math.ceil(total / pageSize))
    useEffect(() => { if (page > totalPages) setPage(totalPages) }, [totalPages, page])

    const paginatedAgents = useMemo(() => {
        const start = (page - 1) * pageSize
        return agents.slice(start, start + pageSize)
    }, [agents, page, pageSize])

    if (loading) return <div>Loading...</div>

    return (
        <div>
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold">Dashboard</h1>
                    <p className="text-sm text-muted">Overview of agents and workload</p>
                </div>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="card p-4">
                    <div className="text-sm text-muted">Agents</div>
                    <div className="text-2xl font-semibold">{agents.length}</div>
                </div>
                <div className="card p-4">
                    <div className="text-sm text-muted">Assignments</div>
                    <div className="text-2xl font-semibold">{assignments.length}</div>
                </div>
                <div className="card p-4">
                    <div className="text-sm text-muted">Total items</div>
                    <div className="text-2xl font-semibold">{assignments.reduce((s, a) => s + (a.items?.length || 0), 0)}</div>
                </div>
            </div>

            <div className="mt-6">
                <h2 className="text-lg font-semibold mb-2">Agents</h2>
                <div className="card p-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {paginatedAgents.map(a => (
                            <div key={a.id} className="p-4 bg-transparent rounded border border-white/4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="font-semibold">{a.name}</div>
                                        <div className="text-xs text-muted">{a.email}</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xs text-muted">Assigned</div>
                                        <div className="font-bold">{countsByAgent.get(a.id) || 0}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-4">
                        <Pagination page={page} pageSize={pageSize} total={total} onPageChange={p => setPage(p)} onPageSizeChange={s => { setPageSize(s); setPage(1) }} />
                    </div>
                </div>
            </div>
        </div>
    )
}
