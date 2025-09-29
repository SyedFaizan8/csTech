'use client'
import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import * as XLSX from 'xlsx'

export default function FileDropzone({ onFile }: { onFile: (file: File, preview: any[] | null) => void }) {
    const onDrop = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0]
        if (!file) return

        const ext = file.name.split('.').pop()?.toLowerCase()
        if (!['csv', 'xls', 'xlsx'].includes(ext || '')) return alert('Only csv/xls/xlsx allowed')

        const reader = new FileReader()
        reader.onload = (e) => {
            const data = e.target?.result
            if (!data) return

            if (ext === 'csv') {
                const text = String(data)
                const rows = text.split(/\r?\n/).filter(Boolean)
                const cols = rows[0]?.split(',').map((c: string) => c.trim()) || []
                const preview = rows.slice(1, 11).map(r => {
                    const vals = r.split(',')
                    const obj: any = {}
                    cols.forEach((c, i) => obj[c] = vals[i] || '')
                    return { firstName: obj.FirstName || obj.firstName || obj.name || '', phone: obj.Phone || obj.phone || '', notes: obj.Notes || obj.notes || '' }
                })
                onFile(file, preview)
            } else {
                // xls / xlsx
                const wb = XLSX.read(data, { type: 'binary' })
                const sheet = wb.Sheets[wb.SheetNames[0]]
                const json = XLSX.utils.sheet_to_json(sheet, { defval: '' }) as any[]
                const preview = json.slice(0, 10).map(r => ({ firstName: r.FirstName || r.firstName || r.name || '', phone: r.Phone || r.phone || '', notes: r.Notes || r.notes || '' }))
                onFile(file, preview)
            }
        }

        if (ext === 'csv') reader.readAsText(file)
        else reader.readAsBinaryString(file as any)

    }, [onFile])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, multiple: false })

    return (
        <div {...getRootProps()} className={`p-6 border-2 rounded-lg ${isDragActive ? 'border-indigo-400 bg-indigo-50' : 'border-dashed'} text-center` as any}>
            <input {...getInputProps()} />
            <p className="text-sm">Drag & drop your CSV/XLSX here, or click to select</p>
        </div>
    )
}
