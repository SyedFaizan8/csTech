'use client'
import React from 'react'
import { useForm } from 'react-hook-form'
import { useAppDispatch } from '@/store/store'
import { createAgent } from '@/store/slices/agentsSlice'

export default function AgentForm({ onCreated }: { onCreated?: () => void }) {
    const { register, handleSubmit, reset } = useForm<{ name: string; email: string; phone: string; password: string }>()
    const dispatch = useAppDispatch()
    async function onSubmit(data: any) {
        try {
            await dispatch(createAgent(data)).unwrap()
            reset()
            if (onCreated) onCreated()
            // dispatch toast via store if you want
        } catch (err: any) {
            console.error(err)
        }
    }
    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <input {...register('name')} placeholder="Name" className="w-full p-2 border rounded-md" />
            <input {...register('email')} placeholder="Email" className="w-full p-2 border rounded-md" />
            <input {...register('phone')} placeholder="Phone" className="w-full p-2 border rounded-md" />
            <input {...register('password')} placeholder="Password" type="password" className="w-full p-2 border rounded-md" />
            <button className="w-full py-2 bg-indigo-600 text-white rounded-md">Create Agent</button>
        </form>
    )
}
