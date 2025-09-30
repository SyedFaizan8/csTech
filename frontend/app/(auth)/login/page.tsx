'use client'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import api from '@/lib/api'
import { useRouter } from 'next/navigation'
import { useAppDispatch } from '@/store/store'
import { getCurrentUser } from '@/store/slices/authSlice'
import { push } from '@/store/slices/notificationsSlice'

type Form = { email: string; password: string }
function getErrorMessage(err: any) { if (!err) return 'Unknown'; if (err.response?.data?.message) return err.response.data.message; if (err.message) return err.message; return String(err) }

export default function LoginPage() {
    const { register, handleSubmit, setError, formState: { errors } } = useForm<Form>()
    const router = useRouter()
    const dispatch = useAppDispatch()
    const [loading, setLoading] = useState(false)

    async function onSubmit(data: Form) {
        setLoading(true)
        try {
            await api.post('/api/auth/login', data)
            await dispatch(getCurrentUser()).unwrap()
            dispatch(push({ id: String(Date.now()), type: 'success', message: 'Logged in' }))
            router.push('/dashboard')
        } catch (err: any) {
            const msg = getErrorMessage(err)
            setError('root' as any, { type: 'server', message: msg })
            dispatch(push({ id: String(Date.now()), type: 'error', message: msg }))
        } finally { setLoading(false) }
    }

    return (
        <div className="min-h-[70vh] flex items-center justify-center px-4">
            <div className="w-full max-w-md p-8 card">
                <h2 className="text-2xl font-semibold mb-4">Admin Login</h2>

                {errors.root?.message && <div className="mb-3 p-3 bg-red-50 text-red-700 rounded">{errors.root.message}</div>}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
                    <div>
                        <label className="block text-sm mb-1">Email</label>
                        <input {...register('email', { required: 'Email required' })} className="w-full p-3 border rounded-lg" />
                        {errors.email && <div className="text-red-600 text-sm">{errors.email.message}</div>}
                    </div>
                    <div>
                        <label className="block text-sm mb-1">Password</label>
                        <input {...register('password', { required: 'Password required' })} type="password" className="w-full p-3 border rounded-lg" />
                        {errors.password && <div className="text-red-600 text-sm">{errors.password.message}</div>}
                    </div>
                    <button className="w-full py-3 bg-indigo-600 text-white rounded-lg">{loading ? 'Signing in...' : 'Sign In'}</button>
                </form>

                <p className="mt-4 text-sm text-slate-500">No admin? <a href="/signup" className="text-indigo-600">Create one</a></p>
            </div>
        </div>
    )
}
