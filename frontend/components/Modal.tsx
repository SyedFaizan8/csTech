'use client'
import React from 'react'

export default function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title?: string; children: React.ReactNode }) {
    if (!open) return null
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
            <div className="bg-white max-w-2xl w-full p-4 rounded-2xl">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">{title}</h3>
                    <button onClick={onClose} className="px-2 py-1 rounded-md">✕</button>
                </div>
                <div>{children}</div>
            </div>
        </div>
    )
}
