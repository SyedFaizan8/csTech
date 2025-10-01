'use client'
import React, { useState } from 'react'
import FileDropzone from '@/components/FileDropZone'
import { useAppDispatch, useAppSelector } from '@/store/store'
import { uploadFile, reset } from '@/store/slices/uploadSlice'
import useRequireAuth from '@/hooks/useRequireAuth'
import { push } from '@/store/slices/notificationsSlice'

export default function UploadPage() {
  useRequireAuth()
  const dispatch = useAppDispatch()
  const { uploading, progress, error } = useAppSelector(s => s.upload)
  const [file, setFile] = useState<File | null>(null)
  const [previewRows, setPreviewRows] = useState<any[] | null>(null)

  async function handleUpload() {
    if (!file) { dispatch(push({ id: String(Date.now()), type: 'error', message: 'Select a file first' })); return }
    try {
      await dispatch(uploadFile({ file })).unwrap()
      dispatch(push({ id: String(Date.now()), type: 'success', message: 'Distributed successfully' }))
      dispatch(reset())
      setFile(null); setPreviewRows(null)
    } catch (err: any) {
      dispatch(push({ id: String(Date.now()), type: 'error', message: err?.message || 'Upload failed' }))
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Upload List</h1>
        <div className="text-sm text-slate-500">Accepts .csv, .xls, .xlsx</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl card">
          <FileDropzone onFile={(f, preview) => { setFile(f); setPreviewRows(preview) }} />
          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-slate-500">{file ? `Selected: ${file.name}` : 'No file selected'}</div>
            <button onClick={handleUpload} disabled={!file || uploading} className="px-4 py-2 bg-indigo-600 text-white rounded-lg disabled:opacity-50">
              {uploading ? `Uploading ${progress}%` : 'Upload & Distribute'}
            </button>
          </div>
          {error && <div className="mt-2 text-red-600">Error: {error}</div>}
        </div>

        <div className="bg-white p-4 rounded-2xl card">
          <h3 className="font-medium mb-2">Preview (first 10 rows)</h3>
          {previewRows ? (
            <div className="overflow-auto">
              <table className="min-w-full text-sm">
                <thead className="sticky top-0">
                  <tr>
                    <th className="p-2 text-left">First Name</th>
                    <th className="p-2 text-left">Phone</th>
                    <th className="p-2 text-left">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {previewRows.map((r, i) => (
                    <tr key={i} className="border-t">
                      <td className="p-2">{r.firstName}</td>
                      <td className="p-2">{r.phone}</td>
                      <td className="p-2">{r.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : <div className="text-sm text-slate-400">Drop a file to see preview</div>}
        </div>
      </div>
    </div>
  )
}
