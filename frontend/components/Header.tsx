'use client'
import React from 'react'
import { useRouter } from 'next/navigation'
import api from '../lib/api'
import { useAppDispatch, useAppSelector } from '../store/store'
import { logout } from '../store/slices/authSlice'
import { push } from '../store/slices/notificationsSlice'

export default function Header() {
    const router = useRouter()
    const dispatch = useAppDispatch()
    const user = useAppSelector(s => s.auth.user)

    async function handleLogout() {
        try {
            await api.post('/api/auth/logout')
        } catch (err) {
            // Even if logout endpoint fails, we'll clear client state to avoid stuck sessions
            console.warn('Logout API error (ignoring):', err)
        } finally {
            // ensure local state is cleared and checked=true to avoid re-check loops
            dispatch(logout())
            dispatch(push({ id: String(Date.now()), type: 'success', message: 'Logged out' }))
            router.replace('/login')
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
                    {/* Show logout button only if user is logged in */}
                    {user ? (
                        <>
                            <div className="text-sm text-slate-600 mr-2 hidden sm:block">{user?.name ?? user?.email}</div>
                            <button onClick={handleLogout} className="px-3 py-1 rounded-md border text-sm">Logout</button>
                        </>
                    ) : (
                        <div className="flex gap-2">
                            <a href="/login" className="text-sm text-indigo-600">Login</a>
                        </div>
                    )}
                </div>
            </div>
        </header>
    )
}
