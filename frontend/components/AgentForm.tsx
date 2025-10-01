'use client'
import React from 'react'
import { useForm } from 'react-hook-form'
import { useAppDispatch } from '@/store/store'
import { createAgent, fetchAgents } from '@/store/slices/agentsSlice'
import { push } from '@/store/slices/notificationsSlice'

type Form = { name: string; email: string; phone: string; password: string }

export default function AgentForm({ onCreated }: { onCreated?: () => void }) {
    const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<Form>({ mode: 'onBlur' })
    const dispatch = useAppDispatch()

    async function onSubmit(data: Form) {
        try {
            await dispatch(createAgent(data)).unwrap()
            dispatch(push({ id: String(Date.now()), type: 'success', message: 'Agent created' }))
            reset()
            // refresh list
            dispatch(fetchAgents())
            if (onCreated) onCreated()
        } catch (err: any) {
            dispatch(push({ id: String(Date.now()), type: 'error', message: err?.message || 'Create failed' }))
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <div>
                <label className="text-sm text-muted">Full name</label>
                <input {...register('name', { required: 'Name is required' })} className={`w-full mt-1 p-3 rounded-lg bg-transparent border border-white/6 focus:ring-2 focus:ring-indigo-500`} />
                {errors.name && <div className="text-xs text-red-400 mt-1">{errors.name.message}</div>}
            </div>

            <div>
                <label className="text-sm text-muted">Email</label>
                <input {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' } })} className="w-full mt-1 p-3 rounded-lg bg-transparent border border-white/6" />
                {errors.email && <div className="text-xs text-red-400 mt-1">{errors.email.message}</div>}
            </div>

            <div>
                <label className="text-sm text-muted">Phone (with country code)</label>
                <input {...register('phone', { required: 'Phone is required' })} className="w-full mt-1 p-3 rounded-lg bg-transparent border border-white/6" />
                {errors.phone && <div className="text-xs text-red-400 mt-1">{errors.phone.message}</div>}
            </div>

            <div>
                <label className="text-sm text-muted">Password</label>
                <input {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Minimum 6 characters' } })} type="password" className="w-full mt-1 p-3 rounded-lg bg-transparent border border-white/6" />
                {errors.password && <div className="text-xs text-red-400 mt-1">{errors.password.message}</div>}
            </div>

            <div>
                <button type="submit" disabled={isSubmitting} className="w-full py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500">
                    {isSubmitting ? 'Creating…' : 'Create Agent'}
                </button>
            </div>
        </form>
    )
}
