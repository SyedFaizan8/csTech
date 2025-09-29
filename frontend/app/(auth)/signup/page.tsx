'use client'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { useRouter } from 'next/navigation'

type Form = { name?: string; email: string; password: string }

export default function Signup() {
    const { register, handleSubmit } = useForm<Form>()
    const router = useRouter()

    async function onSubmit(data: Form) {
        try {
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/seed-admin`, data)
            alert('Admin created. Now login.')
            router.push('/login')
        } catch (err: any) {
            alert(err?.response?.data?.message || 'Signup failed')
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
                <p className="mt-3 text-sm text-slate-500">Already have an account? <a href="/login" className="text-indigo-600">Login</a></p>
            </div>
        </div>
    )
}
