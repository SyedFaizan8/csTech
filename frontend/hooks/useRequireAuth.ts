'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '../store/store'
import { getCurrentUser } from '../store/slices/authSlice'

export default function useRequireAuth() {
    const dispatch = useAppDispatch()
    const router = useRouter()
    const { user, loading, checked } = useAppSelector(s => s.auth)

    useEffect(() => {
        // If we haven't checked auth yet, attempt to get current user once.
        if (!checked && !loading) {
            dispatch(getCurrentUser())
            return
        }

        // If we've already checked and there's no user, redirect to login.
        if (checked && !user) {
            router.replace('/login')
        }
    }, [checked, loading, user, dispatch, router])

    return { user, loading, checked }
}
