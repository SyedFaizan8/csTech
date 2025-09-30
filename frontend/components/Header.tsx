'use client'
import React from 'react'
import { useRouter } from 'next/navigation'
import api from '@/lib/api'
import { useAppDispatch } from '@/store/store'
import { logout } from '@/store/slices/authSlice'
import { push } from '@/store/slices/notificationsSlice'

export default function Header() {
    const router = useRouter()
    const dispatch = useAppDispatch()
    async function handleLogout() {
        try {
            await api.post('/api/auth/logout')
            dispatch(logout())
            dispatch(push({ id: String(Date.now()), type: 'success', message: 'Logged out' }))
            router.replace('/login')
        } catch (err: any) {
            dispatch(push({ id: String(Date.now()), type: 'error', message: err?.response?.data?.message || 'Logout failed' }))
        }
    }

    return (
        <header className="bg-white border-b">
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="text-lg font-bold brand">MERN Admin</div>
                    <div className="text-sm text-slate-500 hidden sm:block">Manage agents & lists</div>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={handleLogout} className="px-3 py-1 rounded-md border text-sm">Logout</button>
                </div>
            </div>
        </header>
    )
}
