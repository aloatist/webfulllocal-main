'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Facebook, Instagram, Youtube, Twitter, Linkedin, Calendar, Send } from 'lucide-react'
import { usePermission } from '@/lib/permissions/hooks'

interface Account {
  id: string
  platform: string
  accountName: string
  isActive: boolean
}

interface SocialMediaSectionProps {
  postId?: string
  postTitle?: string
  postExcerpt?: string
  onPublish?: (data: PublishData) => Promise<void>
}

interface PublishData {
  accountIds: string[]
  customContent?: Record<string, string>
  scheduledAt?: string
}

const PLATFORM_ICONS: Record<string, any> = {
  facebook: Facebook,
  instagram: Instagram,
  youtube: Youtube,
  twitter: Twitter,
  linkedin: Linkedin,
}

const PLATFORM_COLORS: Record<string, string> = {
  facebook: 'text-blue-500',
  instagram: 'text-pink-500',
  youtube: 'text-red-500',
  twitter: 'text-sky-500',
  linkedin: 'text-blue-700',
}

export function SocialMediaSection({
  postId,
  postTitle,
  postExcerpt,
  onPublish,
}: SocialMediaSectionProps) {
  const canPost = usePermission('social_media.post')
  const canSchedule = usePermission('social_media.schedule')

  const [enabled, setEnabled] = useState(false)
  const [accounts, setAccounts] = useState<Account[]>([])
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([])
  const [customContent, setCustomContent] = useState<Record<string, string>>({})
  const [scheduleDate, setScheduleDate] = useState('')
  const [publishing, setPublishing] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (canPost) {
      void loadAccounts()
    }
  }, [canPost])

  const loadAccounts = async () => {
    try {
      const response = await fetch('/api/social-media/accounts?isActive=true')
      const data = await response.json()
      setAccounts(data.accounts || [])
    } catch (error) {
      console.error('Error loading accounts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleToggleAccount = (accountId: string) => {
    setSelectedAccounts((prev) =>
      prev.includes(accountId)
        ? prev.filter((id) => id !== accountId)
        : [...prev, accountId]
    )
  }

  const handlePublish = async () => {
    if (!postId || selectedAccounts.length === 0) {
      alert('Please select at least one platform')
      return
    }

    setPublishing(true)
    try {
      const publishData: PublishData = {
        accountIds: selectedAccounts,
        customContent: Object.keys(customContent).length > 0 ? customContent : undefined,
        scheduledAt: scheduleDate || undefined,
      }

      if (onPublish) {
        await onPublish(publishData)
      } else {
        // Default publish via API
        const response = await fetch('/api/social-media/publish', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            postId,
            ...publishData,
          }),
        })

        if (!response.ok) {
          throw new Error('Failed to publish')
        }

        const result = await response.json()
        alert(result.message || 'Published successfully!')
      }
    } catch (error) {
      console.error('Error publishing:', error)
      alert('Failed to publish to social media')
    } finally {
      setPublishing(false)
    }
  }

  if (!canPost) {
    return null
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Social Media Auto-Post</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Loading...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Social Media Auto-Post</CardTitle>
            <CardDescription>
              Automatically post to social media when publishing
            </CardDescription>
          </div>
          <Switch checked={enabled} onCheckedChange={setEnabled} />
        </div>
      </CardHeader>

      {enabled && (
        <CardContent className="space-y-6">
          {/* No accounts warning */}
          {accounts.length === 0 && (
            <div className="rounded-lg border border-yellow-300 bg-yellow-50 p-4 text-sm text-yellow-800">
              No social media accounts connected. Please connect accounts first.
            </div>
          )}

          {/* Platform selection */}
          {accounts.length > 0 && (
            <>
              <div className="space-y-3">
                <Label className="text-base font-semibold">Select Platforms</Label>
                <div className="space-y-2">
                  {accounts.map((account) => {
                    const Icon = PLATFORM_ICONS[account.platform] || Facebook
                    const colorClass = PLATFORM_COLORS[account.platform] || 'text-gray-500'

                    return (
                      <div
                        key={account.id}
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <Checkbox
                            id={account.id}
                            checked={selectedAccounts.includes(account.id)}
                            onCheckedChange={() => handleToggleAccount(account.id)}
                          />
                          <Icon className={`h-5 w-5 ${colorClass}`} />
                          <div>
                            <Label
                              htmlFor={account.id}
                              className="font-medium capitalize cursor-pointer"
                            >
                              {account.platform}
                            </Label>
                            <p className="text-sm text-muted-foreground">
                              {account.accountName}
                            </p>
                          </div>
                        </div>
                        <Badge variant="outline">Active</Badge>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Custom content per platform */}
              {selectedAccounts.length > 0 && (
                <div className="space-y-3">
                  <Label className="text-base font-semibold">
                    Custom Content (Optional)
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Leave blank to use default template. Use {'{'}
                    {'{'}title{'}'}
                    {'}'}, {'{'}
                    {'{'}excerpt{'}'}
                    {'}'}, {'{'}
                    {'{'}url{'}'} {'}'} as placeholders.
                  </p>
                  {selectedAccounts.map((accountId) => {
                    const account = accounts.find((a) => a.id === accountId)
                    if (!account) return null

                    return (
                      <div key={accountId} className="space-y-2">
                        <Label className="capitalize">{account.platform}</Label>
                        <Textarea
                          placeholder={`Custom content for ${account.platform}...`}
                          value={customContent[account.platform] || ''}
                          onChange={(e) =>
                            setCustomContent({
                              ...customContent,
                              [account.platform]: e.target.value,
                            })
                          }
                          rows={3}
                        />
                      </div>
                    )
                  })}
                </div>
              )}

              {/* Schedule */}
              {canSchedule && selectedAccounts.length > 0 && (
                <div className="space-y-3">
                  <Label className="text-base font-semibold flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Schedule Post (Optional)
                  </Label>
                  <input
                    type="datetime-local"
                    value={scheduleDate}
                    onChange={(e) => setScheduleDate(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
              )}

              {/* Publish button */}
              {selectedAccounts.length > 0 && postId && (
                <Button
                  onClick={handlePublish}
                  disabled={publishing}
                  className="w-full"
                  size="lg"
                >
                  <Send className="h-4 w-4 mr-2" />
                  {publishing
                    ? 'Publishing...'
                    : scheduleDate
                    ? 'Schedule Post'
                    : 'Publish Now'}
                </Button>
              )}

              {!postId && (
                <div className="rounded-lg border border-blue-300 bg-blue-50 p-4 text-sm text-blue-800">
                  Save the post first to enable social media publishing.
                </div>
              )}
            </>
          )}
        </CardContent>
      )}
    </Card>
  )
}
