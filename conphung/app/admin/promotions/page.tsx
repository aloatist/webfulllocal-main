'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, Percent, Calendar, Tag, TrendingUp } from 'lucide-react'

interface Promotion {
  id: string
  code: string
  name: string
  description: string | null
  discountType: 'PERCENTAGE' | 'AMOUNT'
  discountValue: number
  maxDiscount: number | null
  startDate: string | null
  endDate: string | null
  usageLimit: number | null
  usageCount: number
  isActive: boolean
  minimumOrder: number | null
}

export default function PromotionsPage() {
  const [promotions, setPromotions] = useState<Promotion[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPromotions()
  }, [])

  const fetchPromotions = async () => {
    try {
      const response = await fetch('/api/promotions')
      if (response.ok) {
        const data = await response.json()
        // Handle both array and object response
        setPromotions(Array.isArray(data) ? data : data.promotions || [])
      }
    } catch (error) {
      console.error('Error fetching promotions:', error)
      setPromotions([])
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (promotion: Promotion) => {
    if (!promotion.isActive) {
      return <Badge variant="secondary">Inactive</Badge>
    }
    
    const now = new Date()
    const endDate = promotion.endDate ? new Date(promotion.endDate) : null
    
    if (endDate && endDate < now) {
      return <Badge variant="destructive">Expired</Badge>
    }
    
    const usagePercent = promotion.usageLimit 
      ? (promotion.usageCount / promotion.usageLimit) * 100 
      : 0
    
    if (promotion.usageLimit && usagePercent >= 100) {
      return <Badge variant="destructive">Used Up</Badge>
    }
    
    if (usagePercent >= 80) {
      return <Badge variant="outline" className="border-orange-500 text-orange-500">
        Almost Full
      </Badge>
    }
    
    return <Badge className="bg-green-500">Active</Badge>
  }

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
          <p className="mt-4 text-sm text-muted-foreground">Loading promotions...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Promotions & Discounts</h1>
          <p className="text-muted-foreground">
            Manage promotional codes and discount campaigns
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Promotion
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Promotions</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{promotions.length}</div>
            <p className="text-xs text-muted-foreground">
              {promotions.filter(p => p.isActive).length} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Usage</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {promotions.reduce((sum, p) => sum + p.usageCount, 0)}
            </div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Codes</CardTitle>
            <Percent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {promotions.filter(p => p.isActive).length}
            </div>
            <p className="text-xs text-muted-foreground">Currently available</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {promotions.filter(p => {
                if (!p.endDate || !p.isActive) return false
                const daysUntilExpiry = Math.ceil(
                  (new Date(p.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
                )
                return daysUntilExpiry > 0 && daysUntilExpiry <= 7
              }).length}
            </div>
            <p className="text-xs text-muted-foreground">Within 7 days</p>
          </CardContent>
        </Card>
      </div>

      {/* Promotions List */}
      <div className="space-y-4">
        {promotions.map((promotion) => (
          <Card key={promotion.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-xl">{promotion.name}</CardTitle>
                    {getStatusBadge(promotion)}
                  </div>
                  <CardDescription>
                    Code: <span className="font-mono font-semibold">{promotion.code}</span>
                  </CardDescription>
                  {promotion.description && (
                    <p className="text-sm text-muted-foreground">{promotion.description}</p>
                  )}
                </div>
                <Button variant="outline" size="sm">
                  Edit
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Discount</p>
                  <p className="text-lg font-semibold">
                    {promotion.discountType === 'PERCENTAGE'
                      ? `${promotion.discountValue}%`
                      : `${promotion.discountValue.toLocaleString('vi-VN')} ₫`}
                  </p>
                  {promotion.maxDiscount && (
                    <p className="text-xs text-muted-foreground">
                      Max: {promotion.maxDiscount.toLocaleString('vi-VN')} ₫
                    </p>
                  )}
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground">Usage</p>
                  <p className="text-lg font-semibold">
                    {promotion.usageCount}
                    {promotion.usageLimit && ` / ${promotion.usageLimit}`}
                  </p>
                  {promotion.usageLimit && (
                    <div className="mt-1 h-2 rounded-full bg-secondary">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{
                          width: `${Math.min((promotion.usageCount / promotion.usageLimit) * 100, 100)}%`,
                        }}
                      />
                    </div>
                  )}
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground">Valid Period</p>
                  <p className="text-sm">
                    {promotion.startDate
                      ? new Date(promotion.startDate).toLocaleDateString('vi-VN')
                      : 'No start date'}
                  </p>
                  <p className="text-sm">
                    {promotion.endDate
                      ? new Date(promotion.endDate).toLocaleDateString('vi-VN')
                      : 'No end date'}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground">Min. Order</p>
                  <p className="text-lg font-semibold">
                    {promotion.minimumOrder
                      ? `${promotion.minimumOrder.toLocaleString('vi-VN')} ₫`
                      : 'No minimum'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {promotions.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Tag className="mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="mb-2 text-lg font-semibold">No promotions yet</h3>
              <p className="mb-4 text-center text-sm text-muted-foreground">
                Create your first promotion to start offering discounts to customers
              </p>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Promotion
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
