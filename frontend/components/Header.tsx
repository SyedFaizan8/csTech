'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import api from '@/lib/api'
import { useAppDispatch, useAppSelector } from '@/store/store'
import { logout } from '@/store/slices/authSlice'
import { push } from '@/store/slices/notificationsSlice'

export default function Header() {
    const router = useRouter()
    const dispatch = useAppDispatch()
    const user = useAppSelector(s => s.auth.user)
    const [busy, setBusy] = useState(false)

    async function handleLogout() {
        setBusy(true)
        try {
            await api.post('/api/auth/logout')
        } catch (err) {
            // ignore API errors — still clear client state so UI isn't stuck
            console.warn('Logout API failed', err)
        } finally {
            dispatch(logout())
            dispatch(push({ id: String(Date.now()), type: 'success', message: 'Logged out' }))
            router.replace('/login')
            setBusy(false)
        }
    }

    return (
        <header className="bg-transparent border-b border-white/6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="text-lg brand font-bold leading-none">MERN Admin</div>
                    <nav className="hidden sm:flex items-center gap-2">
                        <Link href="/dashboard" className="px-3 py-1 rounded-md text-sm hover:bg-white/3">Dashboard</Link>
                        <Link href="/agents" className="px-3 py-1 rounded-md text-sm hover:bg-white/3">Agents</Link>
                        <Link href="/upload" className="px-3 py-1 rounded-md text-sm hover:bg-white/3">Upload</Link>
                    </nav>
                </div>

                <div className="flex items-center gap-3">
                    {/* small-screen nav: hamburger opens simple dropdown menu */}
                    <div className="sm:hidden relative">
                        <MobileNav />
                    </div>

                    {user ? (
                        <>
                            <div className="hidden sm:block text-sm text-muted">{user?.name ?? user?.email}</div>
                            <button
                                onClick={handleLogout}
                                disabled={busy}
                                className="px-3 py-1 rounded-md border border-white/6 text-sm hover:bg-white/2"
                            >
                                {busy ? 'Logging out...' : 'Logout'}
                            </button>
                        </>
                    ) : (
                        <div className="flex gap-2">
                            <Link href="/login" className="text-sm text-indigo-300">Login</Link>
                        </div>
                    )}
                </div>
            </div>
        </header>
    )
}

/* MobileNav: small dropdown of nav links (used on narrow screens) */
function MobileNav() {
    const [open, setOpen] = useState(false)

    return (
        <div className="relative">
            <button onClick={() => setOpen(v => !v)} className="p-2 rounded-md hover:bg-white/5" aria-label="Open menu">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </button>

            {open && (
                <div className="absolute right-0 mt-2 w-44 bg-[#071126] border border-white/6 rounded-md p-2 z-50 shadow-lg">
                    <Link href="/dashboard" onClick={() => setOpen(false)} className="block px-3 py-2 rounded hover:bg-white/3">Dashboard</Link>
                    <Link href="/agents" onClick={() => setOpen(false)} className="block px-3 py-2 rounded hover:bg-white/3">Agents</Link>
                    <Link href="/upload" onClick={() => setOpen(false)} className="block px-3 py-2 rounded hover:bg-white/3">Upload</Link>
                </div>
            )}
        </div>
    )
}
