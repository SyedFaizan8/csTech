import React from 'react'

export default function Header() {
    return (
        <header className="bg-white border-b">
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold">MA</div>
                    <div>
                        <div className="text-sm font-semibold">MERN Admin</div>
                        <div className="text-xs text-slate-500">Manage agents & lists</div>
                    </div>
                </div>
                <div className="text-sm text-slate-600">Signed in as Admin</div>
            </div>
        </header>
    )
}
