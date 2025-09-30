// import React from 'react'

// export default function AgentCard({
//     agent,
//     assignedCount = 0,
//     onDelete,
//     onViewAssigned
// }: {
//     agent: any,
//     assignedCount?: number,
//     onDelete?: () => void,
//     onViewAssigned?: () => void
// }) {
//     return (
//         <div className="bg-white p-4 rounded-2xl card-shadow flex flex-col justify-between">
//             <div className="flex items-start justify-between gap-4">
//                 <div>
//                     <h3 className="font-semibold">{agent.name}</h3>
//                     <p className="text-sm text-slate-500">{agent.email}</p>
//                     <p className="text-xs text-slate-400 mt-1">{agent.phone}</p>
//                 </div>

//                 <div className="text-right">
//                     <div className="text-xs text-slate-500">Assigned</div>
//                     <div className="text-lg font-semibold mt-1">{assignedCount}</div>
//                 </div>
//             </div>

//             <div className="mt-4 flex items-center gap-2">
//                 <button onClick={onViewAssigned} className="px-3 py-2 bg-indigo-600 text-white rounded-lg text-sm">View</button>
//                 <button onClick={onDelete} className="px-3 py-2 border rounded-lg text-sm text-red-600">Delete</button>
//             </div>
//         </div>
//     )
// }

// frontend/components/AgentCard.tsx
import React from 'react'

export default function AgentCard({
    agent,
    assignedCount = 0,
    onViewAssigned,
    onDelete
}: {
    agent: any
    assignedCount?: number
    onViewAssigned?: () => void
    onDelete?: () => void
}) {
    return (
        <div className="bg-white p-4 rounded-2xl card-shadow flex flex-col justify-between">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h3 className="font-semibold">{agent.name}</h3>
                    <p className="text-sm text-slate-500">{agent.email}</p>
                    <p className="text-xs text-slate-400 mt-1">{agent.phone}</p>
                </div>

                <div className="text-right">
                    <div className="text-xs text-slate-500">Assigned</div>
                    <div className="text-lg font-semibold mt-1">{assignedCount}</div>
                </div>
            </div>

            <div className="mt-4 flex items-center gap-2">
                <button onClick={onViewAssigned} className="px-3 py-2 bg-indigo-600 text-white rounded-lg text-sm">View</button>
                <button onClick={onDelete} className="px-3 py-2 border rounded-lg text-sm text-red-600">Delete</button>
            </div>
        </div>
    )
}
