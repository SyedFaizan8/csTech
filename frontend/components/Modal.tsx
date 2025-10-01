'use client'
import React, { useEffect, useRef } from 'react'

export default function Modal({
    open,
    onClose,
    title,
    children,
    maxW = '2xl'
}: {
    open: boolean
    onClose: () => void
    title?: string
    children: React.ReactNode
    maxW?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
}) {
    const closeRef = useRef<HTMLButtonElement | null>(null)
    const dialogRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        if (!open) return
        // lock scroll
        const prev = document.body.style.overflow
        document.body.style.overflow = 'hidden'
        // focus close button for accessibility
        closeRef.current?.focus()

        function onKey(e: KeyboardEvent) {
            if (e.key === 'Escape') onClose()
        }
        window.addEventListener('keydown', onKey)
        return () => {
            document.body.style.overflow = prev
            window.removeEventListener('keydown', onKey)
        }
    }, [open, onClose])

    if (!open) return null

    const maxWClass =
        maxW === 'sm'
            ? 'max-w-sm'
            : maxW === 'md'
                ? 'max-w-md'
                : maxW === 'lg'
                    ? 'max-w-lg'
                    : maxW === 'xl'
                        ? 'max-w-xl'
                        : 'max-w-2xl'

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            aria-modal="true"
            role="dialog"
            aria-labelledby={title ? 'modal-title' : undefined}
        >
            {/* overlay */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* panel */}
            <div
                ref={dialogRef}
                className={`relative ${maxWClass} w-full mx-4 transform transition-all duration-200 ease-out`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="card p-5 sm:p-6 rounded-2xl border border-white/6">
                    <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                            {title && <h3 id="modal-title" className="text-lg font-semibold text-slate-50">{title}</h3>}
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                ref={closeRef}
                                onClick={onClose}
                                aria-label="Close"
                                className="inline-flex items-center justify-center rounded-md p-2 hover:bg-white/5 text-slate-200"
                            >
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <div className="mt-4 text-slate-200">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    )
}
