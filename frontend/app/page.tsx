import Link from 'next/link'
export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center p-8">
        <h1 className="text-3xl font-bold mb-4">MERN Assignment — Admin</h1>
        <p className="mb-6 text-slate-600">Use the login/signup pages to enter the dashboard.</p>
        <div className="space-x-3">
          <Link href="/login" className="px-4 py-2 rounded-lg bg-indigo-600 text-white">Login</Link>
          <Link href="/signup" className="px-4 py-2 rounded-lg border">Sign up</Link>
        </div>
      </div>
    </div>
  )
}
