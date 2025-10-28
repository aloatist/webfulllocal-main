'use client'

import { useState, useEffect } from 'react'
import { usePermission } from '@/lib/permissions/hooks'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Facebook, Instagram, Youtube, Twitter, Linkedin, Plus } from 'lucide-react'
import Link from 'next/link'

interface Account {
  id: string
  platform: string
  accountName: string
  isActive: boolean
  _count: {
    posts: number
  }
}

interface SocialMediaPost {
  id: string
  platform: string
  status: string
  publishedAt: string | null
  createdAt: string
  account: {
    accountName: string
  }
  Post: {
    title: string
  }
}

interface Stats {
  totalAccounts: number
  activeAccounts: number
  totalPosts: number
  publishedPosts: number
  pendingPosts: number
  failedPosts: number
}

const PLATFORM_ICONS: Record<string, any> = {
  facebook: Facebook,
  instagram: Instagram,
  youtube: Youtube,
  twitter: Twitter,
  linkedin: Linkedin,
}

const PLATFORM_COLORS: Record<string, string> = {
  facebook: 'bg-blue-500',
  instagram: 'bg-gradient-to-r from-purple-500 to-pink-500',
  youtube: 'bg-red-500',
  twitter: 'bg-sky-500',
  linkedin: 'bg-blue-700',
  tiktok: 'bg-black',
  pinterest: 'bg-red-600',
  zalo: 'bg-blue-600',
}

export default function SocialMediaDashboard() {
  const canView = usePermission('social_media.view')
  const canConnect = usePermission('social_media.connect')

  const [accounts, setAccounts] = useState<Account[]>([])
  const [recentPosts, setRecentPosts] = useState<SocialMediaPost[]>([])
  const [stats, setStats] = useState<Stats>({
    totalAccounts: 0,
    activeAccounts: 0,
    totalPosts: 0,
    publishedPosts: 0,
    pendingPosts: 0,
    failedPosts: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (canView) {
      void loadData()
    }
  }, [canView])

  const loadData = async () => {
    try {
      // Load accounts
      const accountsRes = await fetch('/api/social-media/accounts')
      const accountsData = await accountsRes.json()
      setAccounts(accountsData.accounts || [])

      // Load recent posts
      const postsRes = await fetch('/api/social-media/posts?limit=10')
      const postsData = await postsRes.json()
      setRecentPosts(postsData.posts || [])

      // Calculate stats
      const allPosts = postsData.posts || []
      setStats({
        totalAccounts: accountsData.accounts?.length || 0,
        activeAccounts: accountsData.accounts?.filter((a: Account) => a.isActive).length || 0,
        totalPosts: allPosts.length,
        publishedPosts: allPosts.filter((p: SocialMediaPost) => p.status === 'PUBLISHED').length,
        pendingPosts: allPosts.filter((p: SocialMediaPost) => p.status === 'PENDING' || p.status === 'SCHEDULED').length,
        failedPosts: allPosts.filter((p: SocialMediaPost) => p.status === 'FAILED').length,
      })
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!canView) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p>You don&apos;t have permission to view social media dashboard.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Social Media Automation</h1>
          <p className="text-muted-foreground mt-2">
            Manage social media accounts and auto-posting
          </p>
        </div>
        {canConnect && (
          <Button asChild>
            <Link href="/admin/social-media/connect">
              <Plus className="h-4 w-4 mr-2" />
              Connect Platform
            </Link>
          </Button>
        )}
      </div>

      {loading ? (
        <div className="text-center py-12">Loading...</div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Connected Accounts</CardDescription>
                <CardTitle className="text-3xl">{stats.activeAccounts}/{stats.totalAccounts}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Total Posts</CardDescription>
                <CardTitle className="text-3xl">{stats.totalPosts}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Published</CardDescription>
                <CardTitle className="text-3xl text-green-600">{stats.publishedPosts}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Pending/Failed</CardDescription>
                <CardTitle className="text-3xl">
                  <span className="text-yellow-600">{stats.pendingPosts}</span>
                  <span className="text-muted-foreground mx-2">/</span>
                  <span className="text-red-600">{stats.failedPosts}</span>
                </CardTitle>
              </CardHeader>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="accounts" className="space-y-4">
            <TabsList>
              <TabsTrigger value="accounts">Connected Accounts</TabsTrigger>
              <TabsTrigger value="posts">Recent Posts</TabsTrigger>
              <TabsTrigger value="templates">Templates</TabsTrigger>
            </TabsList>

            {/* Accounts Tab */}
            <TabsContent value="accounts">
              {accounts.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <p className="text-muted-foreground mb-4">No accounts connected yet</p>
                    {canConnect && (
                      <Button asChild>
                        <Link href="/admin/social-media/connect">
                          <Plus className="h-4 w-4 mr-2" />
                          Connect Your First Platform
                        </Link>
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {accounts.map((account) => {
                    const Icon = PLATFORM_ICONS[account.platform] || Facebook
                    const colorClass = PLATFORM_COLORS[account.platform] || 'bg-gray-500'

                    return (
                      <Card key={account.id}>
                        <CardHeader>
                          <div className="flex items-center gap-3">
                            <div className={`${colorClass} p-2 rounded-lg text-white`}>
                              <Icon className="h-5 w-5" />
                            </div>
                            <div className="flex-1">
                              <CardTitle className="text-base capitalize">
                                {account.platform}
                              </CardTitle>
                              <CardDescription>{account.accountName}</CardDescription>
                            </div>
                            <Badge variant={account.isActive ? 'default' : 'secondary'}>
                              {account.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground">
                            {account._count.posts} posts
                          </p>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              )}
            </TabsContent>

            {/* Posts Tab */}
            <TabsContent value="posts">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Posts</CardTitle>
                  <CardDescription>Latest social media posts</CardDescription>
                </CardHeader>
                <CardContent>
                  {recentPosts.length === 0 ? (
                    <p className="text-center py-8 text-muted-foreground">No posts yet</p>
                  ) : (
                    <div className="space-y-4">
                      {recentPosts.map((post) => (
                        <div
                          key={post.id}
                          className="flex items-center justify-between p-4 border rounded-lg"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant="outline" className="capitalize">
                                {post.platform}
                              </Badge>
                              <span className="text-sm text-muted-foreground">
                                {post.account.accountName}
                              </span>
                            </div>
                            <p className="font-medium">{post.Post.title}</p>
                            <p className="text-sm text-muted-foreground">
                              {post.publishedAt
                                ? `Published ${new Date(post.publishedAt).toLocaleDateString()}`
                                : `Created ${new Date(post.createdAt).toLocaleDateString()}`}
                            </p>
                          </div>
                          <Badge
                            variant={
                              post.status === 'PUBLISHED'
                                ? 'default'
                                : post.status === 'FAILED'
                                ? 'destructive'
                                : 'secondary'
                            }
                          >
                            {post.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Templates Tab */}
            <TabsContent value="templates">
              <Card>
                <CardHeader>
                  <CardTitle>Content Templates</CardTitle>
                  <CardDescription>Manage post templates for each platform</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-center py-8 text-muted-foreground">
                    Template management coming soon...
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  )
}
