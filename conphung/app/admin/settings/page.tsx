'use client'

import { useState, useEffect } from 'react'
import { defaultSettings, categoryLabels, SettingCategory } from '@/lib/settings/types'
import { SettingField } from '@/components/admin/settings/setting-field'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle2, AlertCircle, Loader2, Save } from 'lucide-react'

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  // Initialize settings with defaults
  useEffect(() => {
    const initialSettings: Record<string, string> = {}
    defaultSettings.forEach(setting => {
      initialSettings[setting.key] = setting.value
    })
    setSettings(initialSettings)
    setIsLoading(false)
  }, [])

  const handleSettingChange = (key: string, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    setStatus('idle')
    setErrorMessage('')

    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ settings }),
      })

      const data = await response.json()

      if (response.ok) {
        setStatus('success')
        setTimeout(() => setStatus('idle'), 3000)
      } else {
        setStatus('error')
        setErrorMessage(data.error || 'Có lỗi xảy ra')
      }
    } catch (error) {
      setStatus('error')
      setErrorMessage('Không thể kết nối. Vui lòng thử lại sau.')
    } finally {
      setIsSaving(false)
    }
  }

  const getSettingsByCategory = (category: SettingCategory) => {
    return defaultSettings.filter(s => s.category === category)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Thiết lập hệ thống</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Quản lý cấu hình website
          </p>
        </div>
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="btn-gradient w-full md:w-auto"
          size="lg"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Đang lưu...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Lưu thay đổi
            </>
          )}
        </Button>
      </div>

      {/* Status Messages */}
      {status === 'success' && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-green-900">Lưu thành công!</p>
            <p className="text-sm text-green-700">Cài đặt đã được cập nhật.</p>
          </div>
        </div>
      )}

      {status === 'error' && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-red-900">Có lỗi xảy ra</p>
            <p className="text-sm text-red-700">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Settings Tabs */}
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2">
          <TabsTrigger value="general">Chung</TabsTrigger>
          <TabsTrigger value="contact">Liên hệ</TabsTrigger>
          <TabsTrigger value="social">Mạng XH</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
          <TabsTrigger value="booking">Đặt phòng</TabsTrigger>
        </TabsList>

        {Object.entries(categoryLabels).slice(0, 5).map(([category, label]) => (
          <TabsContent key={category} value={category} className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{label}</CardTitle>
                <CardDescription>
                  Cấu hình {label.toLowerCase()}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {getSettingsByCategory(category as SettingCategory).map(setting => (
                  <SettingField
                    key={setting.key}
                    id={setting.key}
                    label={setting.label}
                    description={setting.description}
                    type={setting.type}
                    value={settings[setting.key] || ''}
                    onChange={(value) => handleSettingChange(setting.key, value)}
                    placeholder={setting.placeholder}
                    required={setting.required}
                    disabled={isSaving}
                  />
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      {/* Save Button (Bottom) */}
      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="btn-gradient w-full md:w-auto"
          size="lg"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Đang lưu...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Lưu thay đổi
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
