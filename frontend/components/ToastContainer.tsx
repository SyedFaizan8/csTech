'use client'
import React, { useEffect, useRef } from 'react'
import { useAppSelector, useAppDispatch } from '../store/store'
import { remove } from '../store/slices/notificationsSlice'

export default function ToastContainer() {
    const toasts = useAppSelector(s => s.toasts)
    const dispatch = useAppDispatch()
    // keep timers so we can clear on unmount / update
    const timersRef = useRef<Record<string, number>>({})

    useEffect(() => {
        // Clear timers when toasts array changes (previous timers)
        return () => {
            const timers = timersRef.current
            Object.values(timers).forEach(id => clearTimeout(id))
            timersRef.current = {}
        }
    }, [])

    useEffect(() => {
        // For every toast, set a timeout to remove it after 4s
        toasts.forEach(t => {
            if (timersRef.current[t.id]) return // already scheduled
            const timerId = window.setTimeout(() => {
                dispatch(remove(t.id))
                delete timersRef.current[t.id]
            }, 4000)
            timersRef.current[t.id] = timerId
        })
        // cleanup removed toasts' timers
        const aliveIds = new Set(toasts.map(t => t.id))
        Object.keys(timersRef.current).forEach(id => {
            if (!aliveIds.has(id)) {
                clearTimeout(timersRef.current[id])
                delete timersRef.current[id]
            }
        })
    }, [toasts, dispatch])

    return (
        <div className="fixed top-4 right-4 flex flex-col gap-3 z-50">
            {toasts.map(t => (
                <div key={t.id} className={`p-3 rounded-lg shadow-md max-w-xs ${t.type === 'error' ? 'bg-red-600 text-white' : 'bg-white text-slate-800'}`}>
                    <div className="flex items-start justify-between gap-3">
                        <div className="text-sm">{t.message}</div>
                        <button onClick={() => dispatch(remove(t.id))} className="ml-3">✕</button>
                    </div>
                </div>
            ))}
        </div>
    )
}
