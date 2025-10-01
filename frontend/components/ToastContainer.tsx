'use client'
import React, { useEffect, useRef } from 'react'
import { useAppSelector, useAppDispatch } from '@/store/store'
import { remove } from '@/store/slices/notificationsSlice'

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
            {toasts.map((t) => {
                const baseCls = 'p-3 rounded-lg shadow-md max-w-xs flex items-start gap-3'
                const icon = t.type === 'error' ? '⚠️' : t.type === 'success' ? '✅' : 'ℹ️'
                // theme colors: keep background similar to cards, use accent tints
                const bgCls =
                    t.type === 'error'
                        ? 'bg-[#2f1020] text-red-300 border border-red-700'
                        : t.type === 'success'
                            ? 'bg-[#072018] text-green-300 border border-green-700'
                            : 'bg-[#071126] text-slate-200 border border-white/6'

                return (
                    <div key={t.id} className={`${baseCls} ${bgCls}`}>
                        <div className="text-xl leading-none">{icon}</div>
                        <div className="flex-1 text-sm">{t.message}</div>
                        <button onClick={() => dispatch(remove(t.id))} className="ml-2 opacity-80">✕</button>
                    </div>
                )
            })}
        </div>

    )
}