'use client'
import React, { useEffect, useRef } from 'react'

export default function ConfirmModal({
    open,
    title,
    description,
    onCancel,
    onConfirm,
    confirmLabel = 'Delete',
    cancelLabel = 'Cancel',
    destructive = true
}: {
    open: boolean
    title?: string
    description?: string
    onCancel: () => void
    onConfirm: () => void
    confirmLabel?: string
    cancelLabel?: string
    destructive?: boolean
}) {
    const confirmRef = useRef<HTMLButtonElement | null>(null)

    useEffect(() => {
        if (!open) return
        // lock scroll and focus confirm button
        const prev = document.body.style.overflow
        document.body.style.overflow = 'hidden'
        confirmRef.current?.focus()

        function onKey(e: KeyboardEvent) {
            if (e.key === 'Escape') onCancel()
        }
        window.addEventListener('keydown', onKey)
        return () => {
            document.body.style.overflow = prev
            window.removeEventListener('keydown', onKey)
        }
    }, [open, onCancel])

    if (!open) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* overlay */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />

            <div className="relative mx-4 w-full max-w-md">
                <div className="card p-5 rounded-2xl border border-white/6">
                    <div className="mb-2">
                        <h3 className="text-lg font-semibold text-slate-50">{title ?? 'Confirm'}</h3>
                    </div>

                    {description && <p className="text-sm text-slate-300 mb-4">{description}</p>}

                    <div className="flex items-center justify-end gap-3">
                        <button onClick={onCancel} className="px-4 py-2 rounded-md border border-white/6 text-slate-200 hover:bg-white/3">
                            {cancelLabel}
                        </button>

                        <button
                            ref={confirmRef}
                            onClick={onConfirm}
                            className={`px-4 py-2 rounded-md text-white ${destructive ? 'bg-red-600 hover:bg-red-500' : 'bg-indigo-600 hover:bg-indigo-500'}`}
                        >
                            {confirmLabel}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
