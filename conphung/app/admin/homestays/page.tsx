'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

type Homestay = {
  id: string
  title: string
  slug: string
  city?: string | null
  country?: string | null
  status?: string | null
  rooms?: { id: string }[]
}

type PageData = {
  data: Homestay[]
  pagination: { total: number; page: number; limit: number; totalPages: number }
}

export default function AdminHomestaysPage() {
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [rows, setRows] = useState<Homestay[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      setError(null)
      try {
        // Add timestamp to bypass cache
        const params = new URLSearchParams({ 
          page: String(page), 
          limit: String(limit),
          _t: String(Date.now()) // Cache buster
        })
        if (search.trim()) params.set('search', search.trim())
        const res = await fetch(`/api/homestays?${params.toString()}`)
        if (!res.ok) throw new Error('Không thể tải danh sách homestay')
        const data = (await res.json()) as PageData
        if (!cancelled) {
          setRows(data.data)
          setTotalPages(data.pagination.totalPages)
          console.log('📋 Loaded', data.data.length, 'homestays')
        }
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Lỗi tải dữ liệu')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    void load()
    return () => {
      cancelled = true
    }
  }, [page, limit, search])

  async function handleDelete(homestay: Homestay) {
    if (deletingId) return
    const confirmed = window.confirm(`Bạn có chắc muốn xóa homestay "${homestay.title}"?`)
    if (!confirmed) return
    
    setDeletingId(homestay.id)
    setError(null)
    
    try {
      const res = await fetch(`/api/homestays/${homestay.id}`, {
        method: 'DELETE',
      })
      
      if (res.status === 404) {
        console.log('⚠️ Homestay already deleted (404):', homestay.id)
        // Remove from local state
        setRows((prev) => prev.filter((item) => item.id !== homestay.id))
        // Reload to sync with server
        setTimeout(() => {
          window.location.reload()
        }, 300)
        return
      }
      
      if (!res.ok) {
        const payload = await res.json().catch(() => ({}))
        throw new Error(payload.error || 'Không thể xóa homestay')
      }
      
      console.log('✅ Deleted homestay:', homestay.id)
      
      // Remove from local state immediately for instant feedback
      setRows((prev) => prev.filter((item) => item.id !== homestay.id))
      
      // Also reload to ensure consistency
      setTimeout(() => {
        window.location.reload()
      }, 500)
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể xóa homestay')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-base font-semibold">Homestays</h1>
        <Link href="/admin/homestays/new" className="underline text-sm">Tạo homestay</Link>
      </div>

      <div className="mb-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Tìm theo tiêu đề, thành phố..."
          className="w-full md:w-80 border rounded px-3 py-2 text-sm"
        />
      </div>

      {error && (
        <div className="text-sm text-red-600 mb-2">{error}</div>
      )}

      <div className="overflow-x-auto border rounded">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-2">Tiêu đề</th>
              <th className="text-left p-2">Slug</th>
              <th className="text-left p-2">Thành phố</th>
              <th className="text-left p-2">Quốc gia</th>
              <th className="text-left p-2">Phòng</th>
              <th className="text-left p-2">Trạng thái</th>
              <th className="text-left p-2">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td className="p-3" colSpan={7}>Đang tải...</td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td className="p-3" colSpan={7}>Không có dữ liệu</td>
              </tr>
            ) : (
              rows.map((h) => (
                <tr key={h.id} className="border-t">
                  <td className="p-2">{h.title}</td>
                  <td className="p-2">{h.slug}</td>
                  <td className="p-2">{h.city ?? ''}</td>
                  <td className="p-2">{h.country ?? ''}</td>
                  <td className="p-2">{h.rooms?.length ?? 0}</td>
                  <td className="p-2">{h.status ?? ''}</td>
                  <td className="p-2">
                    <div className="flex gap-3">
                      <Link href={`/homestays/${h.slug}`} className="underline text-blue-600" target="_blank">
                        Xem trang
                      </Link>
                      <Link href={`/admin/homestays/${h.id}`} className="underline">Sửa</Link>
                      <Link href={`/admin/homestays/${h.id}/bookings`} className="underline">Booking</Link>
                      <button
                        type="button"
                        className="underline text-red-600 disabled:opacity-60"
                        onClick={() => void handleDelete(h)}
                        disabled={deletingId === h.id}
                      >
                        {deletingId === h.id ? 'Đang xóa...' : 'Xóa'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-3 text-sm">
        <span>Trang {page}/{totalPages}</span>
        <div className="flex gap-2">
          <button
            className="px-3 py-1 border rounded disabled:opacity-50"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >Trước</button>
          <button
            className="px-3 py-1 border rounded disabled:opacity-50"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >Sau</button>
        </div>
      </div>
    </div>
  )
}
