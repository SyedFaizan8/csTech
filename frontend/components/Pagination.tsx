'use client'
import { useMemo } from 'react'

export default function Pagination({
    page,
    pageSize,
    total,
    onPageChange,
    onPageSizeChange
}: {
    page: number
    pageSize: number
    total: number
    onPageChange: (p: number) => void
    onPageSizeChange: (s: number) => void
}) {
    const { totalPages, pages } = useMemo(() => {
        const tPages = Math.max(1, Math.ceil(total / pageSize))
        const start = Math.max(1, page - 2)
        const end = Math.min(tPages, start + 4)
        const pArr: number[] = []
        for (let i = start; i <= end; i++) pArr.push(i)
        return { totalPages: tPages, pages: pArr }
    }, [total, pageSize, page])

    const PAGE_SIZES = [5, 10, 20, 50]

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3 text-sm text-muted">
                <span>Rows</span>

                {/* Native select styled for dark theme */}
                <select
                    value={pageSize}
                    onChange={(e) => onPageSizeChange(Number(e.target.value))}
                    aria-label="Rows per page"
                    className="rounded px-2 py-1 bg-transparent border border-white/6 text-slate-200 focus:outline-none"
                >
                    {PAGE_SIZES.map((n) => (
                        <option key={n} value={n} className="bg-[#071126] text-slate-200">
                            {n}
                        </option>
                    ))}
                </select>

                <span className="ml-2">Total: {total}</span>
            </div>

            <div className="flex items-center gap-2">
                <button
                    onClick={() => onPageChange(Math.max(1, page - 1))}
                    disabled={page <= 1}
                    className="px-3 py-1 rounded-md border border-white/6 hover:bg-white/2 disabled:opacity-40 text-sm"
                >
                    Prev
                </button>

                {pages.map((p) => (
                    <button
                        key={p}
                        onClick={() => onPageChange(p)}
                        className={`px-3 py-1 rounded-md text-sm ${p === page ? 'bg-indigo-600 text-white' : 'border border-white/6 hover:bg-white/2'}`}
                    >
                        {p}
                    </button>
                ))}

                <button
                    onClick={() => onPageChange(Math.min(totalPages, page + 1))}
                    disabled={page >= totalPages}
                    className="px-3 py-1 rounded-md border border-white/6 hover:bg-white/2 disabled:opacity-40 text-sm"
                >
                    Next
                </button>
            </div>
        </div>
    )
}
