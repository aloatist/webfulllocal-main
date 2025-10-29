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
            { month: 'Th1', amount: 8500000 },
            { month: 'Th2', amount: 9200000 },
            { month: 'Th3', amount: 10100000 },
            { month: 'Th4', amount: 11500000 },
            { month: 'Th5', amount: 13200000 },
            { month: 'Th6', amount: 15430000 },
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
          <p className="mt-4 text-sm text-muted-foreground">Đang tải dữ liệu phân tích...</p>
        </div>
      </div>
    )
  }

  if (!data) return null

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Bảng điều khiển phân tích</h1>
        <p className="text-muted-foreground">
          Theo dõi hiệu suất kinh doanh và các chỉ số quan trọng
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng doanh thu</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.revenue.total.toLocaleString('vi-VN')} ₫
            </div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+{data.revenue.change}%</span> so với tháng trước
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng lượt đặt</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.bookings.total}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+{data.bookings.change}%</span> so với tháng trước
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng khách hàng</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.customers.total}</div>
            <p className="text-xs text-muted-foreground">
              {data.customers.new} khách mới trong tháng
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Điểm đánh giá trung bình</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.ratings.average}/5.0</div>
            <p className="text-xs text-muted-foreground">
              Từ {data.ratings.total} đánh giá
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
            Xu hướng doanh thu
          </CardTitle>
          <CardDescription>Doanh thu 6 tháng gần nhất</CardDescription>
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
            <CardTitle>Phân bổ đặt chỗ</CardTitle>
            <CardDescription>So sánh đặt tour và homestay</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-blue-500" />
                  <span className="font-medium">Tour du lịch</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {data.bookings.tours} lượt đặt
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
                {((data.bookings.tours / data.bookings.total) * 100).toFixed(1)}% tổng lượt
              </p>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Home className="h-4 w-4 text-green-500" />
                  <span className="font-medium">Homestay</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {data.bookings.homestays} lượt đặt
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
                {((data.bookings.homestays / data.bookings.total) * 100).toFixed(1)}% tổng lượt
              </p>
            </div>

            <div className="rounded-lg bg-muted p-4">
              <div className="mb-2 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                <span className="font-semibold">Nhận định</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Tour đang đạt hiệu quả cao hơn {((data.bookings.tours / data.bookings.homestays - 1) * 100).toFixed(1)}% so với homestay trong tháng này. Hãy cân nhắc chạy khuyến mãi cho homestay.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Customer Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Thông tin khách hàng</CardTitle>
          <CardDescription>Khách mới và khách quay lại</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Tổng khách hàng</p>
              <p className="text-3xl font-bold">{data.customers.total}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Khách mới</p>
              <p className="text-3xl font-bold text-green-600">{data.customers.new}</p>
              <p className="text-xs text-muted-foreground">
                {((data.customers.new / data.customers.total) * 100).toFixed(1)}% tổng số
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Khách quay lại</p>
              <p className="text-3xl font-bold text-blue-600">{data.customers.returning}</p>
              <p className="text-xs text-muted-foreground">
                {((data.customers.returning / data.customers.total) * 100).toFixed(1)}% tổng số
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
