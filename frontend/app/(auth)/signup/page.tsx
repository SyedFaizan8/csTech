'use client'
import React from 'react'
import { useForm } from 'react-hook-form'
import api from '@/lib/api'
import { useRouter } from 'next/navigation'
import { useAppDispatch } from '@/store/store'
import { push } from '@/store/slices/notificationsSlice'

export default function Signup() {
    const { register, handleSubmit } = useForm<{ name?: string; email: string; password: string }>()
    const router = useRouter()
    const dispatch = useAppDispatch()

    async function onSubmit(data: any) {
        try {
            await api.post('/api/auth/signup', data)
            dispatch(push({ id: String(Date.now()), type: 'success', message: 'Admin created. Please login.' }))
            router.push('/login')
        } catch (err: any) {
            dispatch(push({ id: String(Date.now()), type: 'error', message: err?.response?.data?.message || 'Signup failed' }))
        }
    }

    return (
        <div className="min-h-[70vh] flex items-center justify-center">
            <div className="w-full max-w-md bg-white p-8 rounded-2xl card-shadow">
                <h2 className="text-2xl font-semibold mb-4">Create Admin</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <input {...register('name')} placeholder="Name (optional)" className="w-full p-3 border rounded-lg" />
                    <input {...register('email')} placeholder="Email" className="w-full p-3 border rounded-lg" />
                    <input {...register('password')} placeholder="Password" type="password" className="w-full p-3 border rounded-lg" />
                    <button className="w-full py-3 bg-indigo-600 text-white rounded-lg">Create Admin</button>
                </form>
            </div>
        </div>
    )
}
