'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  BarChart3,
  TrendingUp,
  Users,
  DollarSign,
  Calendar,
  Home,
  MapPin,
  Star,
} from 'lucide-react'

interface AnalyticsData {
  revenue: {
    total: number
    change: number
    chartData: Array<{ month: string; amount: number }>
  }
  bookings: {
    total: number
    change: number
    tours: number
    homestays: number
  }
  customers: {
    total: number
    new: number
    returning: number
  }
  ratings: {
    average: number
    total: number
  }
}

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<AnalyticsData | null>(null)

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setData({
        revenue: {
          total: 125430000,
          change: 12.5,
          chartData: [
            { month: 'Jan', amount: 8500000 },
            { month: 'Feb', amount: 9200000 },
            { month: 'Mar', amount: 10100000 },
            { month: 'Apr', amount: 11500000 },
            { month: 'May', amount: 13200000 },
            { month: 'Jun', amount: 15430000 },
          ],
        },
        bookings: {
          total: 342,
          change: 8.3,
          tours: 198,
          homestays: 144,
        },
        customers: {
          total: 1247,
          new: 156,
          returning: 1091,
        },
        ratings: {
          average: 4.7,
          total: 523,
        },
      })
      setLoading(false)
    }, 1000)
  }, [])

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
          <p className="mt-4 text-sm text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    )
  }

  if (!data) return null

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
        <p className="text-muted-foreground">
          Track your business performance and insights
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.revenue.total.toLocaleString('vi-VN')} ₫
            </div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+{data.revenue.change}%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.bookings.total}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+{data.bookings.change}%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.customers.total}</div>
            <p className="text-xs text-muted-foreground">
              {data.customers.new} new this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.ratings.average}/5.0</div>
            <p className="text-xs text-muted-foreground">
              From {data.ratings.total} reviews
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Stats */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Revenue Trend
            </CardTitle>
            <CardDescription>Monthly revenue over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.revenue.chartData.map((item) => (
                <div key={item.month} className="flex items-center gap-4">
                  <div className="w-12 text-sm font-medium">{item.month}</div>
                  <div className="flex-1">
                    <div className="h-8 rounded-md bg-primary/10">
                      <div
                        className="h-full rounded-md bg-primary"
                        style={{
                          width: `${(item.amount / 16000000) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                  <div className="w-24 text-right text-sm font-medium">
                    {(item.amount / 1000000).toFixed(1)}M ₫
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Booking Distribution</CardTitle>
            <CardDescription>Tours vs Homestays bookings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-blue-500" />
                  <span className="font-medium">Tours</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {data.bookings.tours} bookings
                </span>
              </div>
              <div className="h-3 rounded-full bg-secondary">
                <div
                  className="h-full rounded-full bg-blue-500"
                  style={{
                    width: `${(data.bookings.tours / data.bookings.total) * 100}%`,
                  }}
                />
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {((data.bookings.tours / data.bookings.total) * 100).toFixed(1)}% of total
              </p>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Home className="h-4 w-4 text-green-500" />
                  <span className="font-medium">Homestays</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {data.bookings.homestays} bookings
                </span>
              </div>
              <div className="h-3 rounded-full bg-secondary">
                <div
                  className="h-full rounded-full bg-green-500"
                  style={{
                    width: `${(data.bookings.homestays / data.bookings.total) * 100}%`,
                  }}
                />
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {((data.bookings.homestays / data.bookings.total) * 100).toFixed(1)}% of total
              </p>
            </div>

            <div className="rounded-lg bg-muted p-4">
              <div className="mb-2 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                <span className="font-semibold">Insight</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Tours are performing {((data.bookings.tours / data.bookings.homestays - 1) * 100).toFixed(1)}% 
                better than homestays this month. Consider running promotions for homestays.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Customer Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Insights</CardTitle>
          <CardDescription>New vs returning customers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Total Customers</p>
              <p className="text-3xl font-bold">{data.customers.total}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">New Customers</p>
              <p className="text-3xl font-bold text-green-600">{data.customers.new}</p>
              <p className="text-xs text-muted-foreground">
                {((data.customers.new / data.customers.total) * 100).toFixed(1)}% of total
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Returning Customers</p>
              <p className="text-3xl font-bold text-blue-600">{data.customers.returning}</p>
              <p className="text-xs text-muted-foreground">
                {((data.customers.returning / data.customers.total) * 100).toFixed(1)}% of total
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
