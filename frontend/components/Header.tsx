'use client'
import React from 'react'
export default function Header() {
    return (
        <header className="bg-white border-b">
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                <div className="text-sm font-semibold">MERN Admin</div>
                <div className="text-sm text-slate-500">Admin Dashboard</div>
            </div>
        </header>
    )
}
