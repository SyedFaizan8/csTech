import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-2xl text-center card p-10">
        <h1 className="text-3xl font-bold mb-2">MERN Assignment — Admin</h1>
        <p className="text-slate-600 mb-6">Login to manage agents, upload lists and distribute leads.</p>
        <div className="flex items-center justify-center gap-3">
          <Link href="/login" className="px-5 py-3 rounded-md bg-indigo-600 text-white">Login</Link>
          <Link href="/signup" className="px-5 py-3 rounded-md border">Create Admin</Link>
        </div>
      </div>
    </div>
  )
}
