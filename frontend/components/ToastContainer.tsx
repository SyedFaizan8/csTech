'use client'
import React from 'react'
import { useAppSelector, useAppDispatch } from '@/store/store'
import { remove } from '@/store/slices/notificationsSlice'

export default function ToastContainer() {
    const toasts = useAppSelector(s => s.toasts)
    const dispatch = useAppDispatch()
    return (
        <div className="fixed top-4 right-4 flex flex-col gap-3 z-50">
            {toasts.map(t => (
                <div key={t.id} className={`p-3 rounded-lg shadow-md ${t.type === 'error' ? 'bg-red-600 text-white' : 'bg-white text-slate-800'}`}>
                    <div className="flex items-start justify-between gap-3">
                        <div className="text-sm">{t.message}</div>
                        <button onClick={() => dispatch(remove(t.id))}>✕</button>
                    </div>
                </div>
            ))}
        </div>
    )
}
