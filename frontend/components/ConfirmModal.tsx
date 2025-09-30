'use client'
import React from 'react'

export default function ConfirmModal({ open, title, description, onCancel, onConfirm }: {
    open: boolean
    title?: string
    description?: string
    onCancel: () => void
    onConfirm: () => void
}) {
    if (!open) return null
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
            <div className="bg-white max-w-md w-full p-5 rounded-2xl">
                <h3 className="text-lg font-semibold mb-2">{title || 'Confirm'}</h3>
                <p className="text-sm text-slate-600 mb-4">{description}</p>
                <div className="flex justify-end gap-3">
                    <button onClick={onCancel} className="px-4 py-2 rounded-md border">Cancel</button>
                    <button onClick={onConfirm} className="px-4 py-2 rounded-md bg-red-600 text-white">Delete</button>
                </div>
            </div>
        </div>
    )
}
