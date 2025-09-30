'use client'
import React from 'react'
import { useForm } from 'react-hook-form'
import api from '@/lib/api'
import { useRouter } from 'next/navigation'
import { useAppDispatch } from '@/store/store'
import { getCurrentUser } from '@/store/slices/authSlice'
import { push } from '@/store/slices/notificationsSlice'

export default function LoginPage() {
    const { register, handleSubmit, formState: { errors } } = useForm<{ email: string; password: string }>()
    const router = useRouter()
    const dispatch = useAppDispatch()

    async function onSubmit(data: any) {
        try {
            await api.post('/api/auth/login', data)
            await dispatch(getCurrentUser()).unwrap()
            router.push('/dashboard')
        } catch (err: any) {
            dispatch(push({ id: String(Date.now()), type: 'error', message: err?.response?.data?.message || 'Login failed' }))
        }
    }

    return (
        <div className="min-h-[70vh] flex items-center justify-center">
            <div className="w-full max-w-md bg-white p-8 rounded-2xl card-shadow">
                <h2 className="text-2xl font-semibold mb-4">Admin Login</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <input {...register('email', { required: 'Email required' })} placeholder="Email" className="w-full p-3 border rounded-lg" />
                        {errors.email && <div className="text-red-600 text-sm">{errors.email.message}</div>}
                    </div>
                    <div>
                        <input {...register('password', { required: 'Password required' })} placeholder="Password" type="password" className="w-full p-3 border rounded-lg" />
                        {errors.password && <div className="text-red-600 text-sm">{errors.password.message}</div>}
                    </div>
                    <button className="w-full py-3 bg-indigo-600 text-white rounded-lg">Login</button>
                </form>
            </div>
        </div>
    )
}
