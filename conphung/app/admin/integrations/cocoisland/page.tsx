'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'

type CocoConfig = {
  siteUrl: string
  apiBase: string
  bookingThreshold: number
}

export default function CocoislandSettingsPage() {
  const { data: session } = useSession()
  const isAdmin = session?.user?.role === 'ADMIN'
  const [config, setConfig] = useState<CocoConfig>({ siteUrl: '', apiBase: '', bookingThreshold: 5 })
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const res = await fetch('/api/admin/integrations/cocoisland')
        if (!res.ok) throw new Error('Không thể tải cấu hình')
        const data = await res.json()
        if (!cancelled) setConfig(data)
      } catch {
        // keep defaults
      }
    }
    void load()
    return () => { cancelled = true }
  }, [])

  async function handleSave() {
    setSaving(true)
    setMessage(null)
    try {
      const res = await fetch('/api/admin/integrations/cocoisland', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      })
      if (!res.ok) {
        const j = await res.json().catch(() => ({}))
        throw new Error(j.error || 'Không thể lưu cấu hình')
      }
      setMessage('Đã lưu cấu hình')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="p-4 max-w-2xl">
      <h1 className="text-base font-semibold mb-4">Cài đặt Cocoisland</h1>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Site URL</label>
          <input
            className="w-full border rounded px-3 py-2 text-sm"
            value={config.siteUrl}
            onChange={(e) => setConfig((c) => ({ ...c, siteUrl: e.target.value }))}
            placeholder="https://cocoisland.vn"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">API Base</label>
          <input
            className="w-full border rounded px-3 py-2 text-sm"
            value={config.apiBase}
            onChange={(e) => setConfig((c) => ({ ...c, apiBase: e.target.value }))}
            placeholder="/api"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Ngưỡng booking chờ alert</label>
          <input
            type="number"
            className="w-full border rounded px-3 py-2 text-sm"
            value={config.bookingThreshold}
            onChange={(e) => setConfig((c) => ({ ...c, bookingThreshold: Number(e.target.value) || 0 }))}
            min={0}
          />
        </div>
        <div className="flex items-center gap-2">
          {isAdmin ? (
            <Button onClick={handleSave} disabled={saving}>
              {saving ? 'Đang lưu...' : 'Lưu cấu hình'}
            </Button>
          ) : (
            <span className="text-xs text-muted-foreground">Chỉ ADMIN được phép lưu cài đặt.</span>
          )}
          {message && <span className="text-xs text-muted-foreground">{message}</span>}
        </div>
      </div>
    </div>
  )
}


