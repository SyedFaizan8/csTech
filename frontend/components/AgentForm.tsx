'use client'
import { useForm } from 'react-hook-form'
import axios from 'axios'

type Form = { name: string; email: string; phone: string; password: string }

export default function AgentForm({ onCreated }: { onCreated?: () => void }) {
    const { register, handleSubmit, reset } = useForm<Form>()

    async function onSubmit(data: Form) {
        try {
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/agents`, data, { withCredentials: true })
            reset()
            if (onCreated) onCreated()
            alert('Agent created')
        } catch (err: any) {
            alert(err?.response?.data?.message || 'Create failed')
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <input {...register('name')} placeholder="Name" className="w-full p-2 border rounded-md" />
            <input {...register('email')} placeholder="Email" className="w-full p-2 border rounded-md" />
            <input {...register('phone')} placeholder="Phone (with country code)" className="w-full p-2 border rounded-md" />
            <input {...register('password')} placeholder="Password" type="password" className="w-full p-2 border rounded-md" />
            <button className="w-full py-2 bg-indigo-600 text-white rounded-md">Create Agent</button>
        </form>
    )
}
