'use client'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import api from '@/lib/api'
import { useRouter } from 'next/navigation'
import { useAppDispatch } from '@/store/store'
import { push } from '@/store/slices/notificationsSlice'

export default function Signup() {
    const { register, handleSubmit, setError, formState: { errors } } = useForm<{ name?: string; email: string; password: string }>()
    const router = useRouter()
    const dispatch = useAppDispatch()
    const [loading, setLoading] = useState(false)

    async function onSubmit(data: any) {
        setLoading(true)
        try {
            await api.post('/api/auth/signup', data)
            dispatch(push({ id: String(Date.now()), type: 'success', message: 'Admin created. Please login.' }))
            router.push('/login')
        } catch (err: any) {
            const msg = err?.response?.data?.message || err?.message || 'Signup failed'
            setError('root' as any, { type: 'server', message: msg })
            dispatch(push({ id: String(Date.now()), type: 'error', message: msg }))
        } finally { setLoading(false) }
    }

    return (
        <div className="min-h-[70vh] flex items-center justify-center px-4">
            <div className="w-full max-w-md p-8 card">
                <h2 className="text-2xl font-semibold mb-4">Create Admin</h2>

                {errors.root?.message && <div className="mb-3 p-3 bg-red-50 text-red-700 rounded">{errors.root.message}</div>}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
                    <input {...register('name')} placeholder="Name (optional)" className="w-full p-3 border rounded-lg" />
                    <input {...register('email', { required: 'Email required' })} placeholder="Email" className="w-full p-3 border rounded-lg" />
                    <input {...register('password', { required: 'Password required', minLength: { value: 6, message: 'At least 6 chars' } })} placeholder="Password" type="password" className="w-full p-3 border rounded-lg" />
                    <button className="w-full py-3 bg-indigo-600 text-white rounded-lg">{loading ? 'Creating...' : 'Create Admin'}</button>
                </form>
            </div>
        </div>
    )
}
