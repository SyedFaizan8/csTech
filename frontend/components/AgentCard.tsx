import React from 'react'

export default function AgentCard({ agent }: { agent: any }) {
    return (
        <div className="bg-white p-4 rounded-xl card-shadow">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="font-medium">{agent.name}</h3>
                    <p className="text-sm text-slate-500">{agent.email}</p>
                    <p className="text-sm text-slate-500">{agent.phone}</p>
                </div>
                <div className="text-xs text-green-600">Active</div>
            </div>
        </div>
    )
}
