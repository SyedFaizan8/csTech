'use client'
import { useState } from 'react'
import axios from 'axios'
import FileDropzone from '@/components/FileDropzone'

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null)
  const [previewRows, setPreviewRows] = useState<any[] | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleUpload() {
    if (!file) return alert('Select file')
    const fd = new FormData()
    fd.append('file', file)

    try {
      setLoading(true)
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/upload`, fd, { withCredentials: true, headers: { 'Content-Type': 'multipart/form-data' } })
      alert('Distributed successfully')
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Upload failed')
    } finally { setLoading(false) }
  }

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-semibold">Upload List</h1>
      <p className="text-sm text-slate-500 mt-1">Accepts .csv, .xls, .xlsx. Rows must include FirstName and Phone.</p>

      <div className="mt-6 bg-white p-6 rounded-xl card-shadow">
        <FileDropzone onFile={(f, preview) => { setFile(f); setPreviewRows(preview) }} />

        {previewRows && (
          <div className="mt-4">
            <h3 className="font-medium mb-2">Preview (first 10 rows)</h3>
            <div className="overflow-auto border rounded-lg">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-2 text-left">First Name</th>
                    <th className="p-2 text-left">Phone</th>
                    <th className="p-2 text-left">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {previewRows.slice(0, 10).map((r: any, i: number) => (
                    <tr key={i} className="border-t">
                      <td className="p-2">{r.firstName}</td>
                      <td className="p-2">{r.phone}</td>
                      <td className="p-2">{r.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="mt-4 flex items-center gap-3">
          <button onClick={handleUpload} disabled={!file || loading} className="px-4 py-2 bg-indigo-600 text-white rounded-lg">{loading ? 'Uploading...' : 'Upload & Distribute'}</button>
        </div>
      </div>
    </div>
  )
}
