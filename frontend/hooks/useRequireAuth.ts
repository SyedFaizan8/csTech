'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '@/store/store'
import { getCurrentUser } from '@/store/slices/authSlice'

export default function useRequireAuth() {
    const dispatch = useAppDispatch()
    const router = useRouter()
    const { user, loading } = useAppSelector(s => s.auth)
    useEffect(() => {
        if (!user && !loading) {
            dispatch(getCurrentUser()).unwrap().catch(() => router.replace('/login'))
        }
    }, [user, loading, dispatch, router])
    return { user, loading }
}
