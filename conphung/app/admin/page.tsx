'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Loader2,
  LogOut,
  DollarSign,
  Calendar,
  Users,
  Star,
  TrendingUp,
  Home,
  MapPin,
  Settings,
  FileText,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSession, signOut } from 'next-auth/react';
import { StatCard } from '@/components/admin/analytics/stat-card';
import { RevenueChart } from '@/components/admin/analytics/revenue-chart';
import { BookingStats } from '@/components/admin/analytics/booking-stats';

export default function AdminDashboardPage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    posts: 0,
    categories: 0,
    tags: 0,
    media: 0,
    totalRevenue: 0,
    totalBookings: 0,
    totalCustomers: 0,
    avgRating: 0,
    revenueChange: 0,
    bookingsChange: 0,
    customersChange: 0,
    homepageSettings: {
      exists: false,
      status: null as 'DRAFT' | 'PUBLISHED' | null,
      lastUpdated: null as string | null,
    },
  });
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [bookingData, setBookingData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const router = useRouter();

  const handleLogout = useCallback(async () => {
    await signOut({ redirect: false });
    router.push('/login');
  }, [router]);

  const loadStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/admin/stats');
      if (!response.ok) {
        throw new Error('Không thể tải thống kê bảng điều khiển');
      }
      const data = await response.json();
      setStats({
        posts: data.posts ?? 0,
        categories: data.categories ?? 0,
        tags: data.tags ?? 0,
        media: data.media ?? 0,
        totalRevenue: data.totalRevenue ?? 0,
        totalBookings: data.totalBookings ?? 0,
        totalCustomers: data.totalCustomers ?? 0,
        avgRating: data.avgRating ?? 0,
        revenueChange: data.revenueChange ?? 0,
        bookingsChange: data.bookingsChange ?? 0,
        customersChange: data.customersChange ?? 0,
        homepageSettings: {
          exists: data.homepageSettings?.exists ?? false,
          status: data.homepageSettings?.status ?? null,
          lastUpdated: data.homepageSettings?.lastUpdated ?? null,
        },
      });
      
      // Set chart data
      if (data.revenueData) {
        setRevenueData(data.revenueData);
      }
      if (data.bookingData) {
        setBookingData(data.bookingData);
      }
      
      setLastUpdated(new Date().toLocaleString());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể tải dữ liệu bảng điều khiển');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadStats();
  }, [loadStats]);

  return (
    <div className="mx-auto flex w-full flex-col gap-8 py-6 px-4 lg:px-8">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">Bảng điều khiển</p>
          <h1 className="text-3xl font-semibold sm:text-4xl">Phân tích & Tổng quan</h1>
          <p className="text-sm text-muted-foreground">
            Theo dõi hiệu suất kinh doanh và quản lý hệ thống.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {session?.user?.email}
          </span>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Đăng xuất
          </Button>
        </div>
      </header>

      {loading ? (
        <div className="flex items-center justify-center rounded-xl border border-border/80 bg-background/70 py-16">
          <div className="flex items-center gap-3 text-muted-foreground">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Đang tải dữ liệu bảng điều khiển...</span>
          </div>
        </div>
      ) : (
        <>
          {error && (
            <div className="rounded-lg bg-destructive/10 p-4 text-destructive">
              {error}
            </div>
          )}
          
          {/* Key Metrics */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Tổng doanh thu"
              value={new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND',
                notation: 'compact',
              }).format(stats.totalRevenue)}
              change={stats.revenueChange}
              icon={DollarSign}
              iconColor="text-green-600"
              iconBgColor="bg-green-100"
            />
            <StatCard
              title="Đặt phòng"
              value={stats.totalBookings}
              change={stats.bookingsChange}
              icon={Calendar}
              iconColor="text-blue-600"
              iconBgColor="bg-blue-100"
            />
            <StatCard
              title="Khách hàng"
              value={stats.totalCustomers}
              change={stats.customersChange}
              icon={Users}
              iconColor="text-purple-600"
              iconBgColor="bg-purple-100"
            />
            <StatCard
              title="Đánh giá TB"
              value={`${stats.avgRating.toFixed(1)} ⭐`}
              icon={Star}
              iconColor="text-yellow-600"
              iconBgColor="bg-yellow-100"
            />
          </div>

          {/* Charts */}
          <div className="grid gap-6 lg:grid-cols-2">
            <RevenueChart data={revenueData} period="daily" />
            <BookingStats data={bookingData} />
          </div>

          {/* Content Stats */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <div className="rounded-xl border border-border/80 bg-background/70 p-6 shadow-sm">
              <h3 className="font-semibold">Bài viết</h3>
              <p className="mt-2 text-2xl font-bold">{stats.posts}</p>
              <div className="mt-4">
                <a href="/admin/posts" className="text-sm text-primary hover:underline">
                  Quản lý bài viết →
                </a>
              </div>
            </div>
            
            <div className="rounded-xl border border-border/80 bg-background/70 p-6 shadow-sm">
              <h3 className="font-semibold">Danh mục</h3>
              <p className="mt-2 text-2xl font-bold">{stats.categories}</p>
              <div className="mt-4">
                <a href="/admin/categories" className="text-sm text-primary hover:underline">
                  Quản lý danh mục →
                </a>
              </div>
            </div>
            
            <div className="rounded-xl border border-border/80 bg-background/70 p-6 shadow-sm">
              <h3 className="font-semibold">Thẻ</h3>
              <p className="mt-2 text-2xl font-bold">{stats.tags}</p>
              <div className="mt-4">
                <a href="/admin/tags" className="text-sm text-primary hover:underline">
                  Quản lý thẻ →
                </a>
              </div>
            </div>
            
            <div className="rounded-xl border border-border/80 bg-background/70 p-6 shadow-sm">
              <h3 className="font-semibold">Thư viện</h3>
              <p className="mt-2 text-2xl font-bold">{stats.media}</p>
              <div className="mt-4">
                <a href="/admin/media" className="text-sm text-primary hover:underline">
                  Quản lý thư viện →
                </a>
              </div>
            </div>

            {/* Home Settings Card */}
            <div className="rounded-xl border border-border/80 bg-background/70 p-6 shadow-sm">
              <div className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Home Settings</h3>
              </div>
              <div className="mt-2">
                {stats.homepageSettings.exists ? (
                  <div className="space-y-1">
                    <p className="text-sm font-medium">
                      {stats.homepageSettings.status === 'PUBLISHED' ? (
                        <span className="text-green-600">Đã xuất bản</span>
                      ) : (
                        <span className="text-amber-600">Bản nháp</span>
                      )}
                    </p>
                    {stats.homepageSettings.lastUpdated && (
                      <p className="text-xs text-muted-foreground">
                        {new Date(stats.homepageSettings.lastUpdated).toLocaleDateString('vi-VN')}
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Chưa cấu hình</p>
                )}
              </div>
              <div className="mt-4">
                <a href="/admin/homepage-settings" className="text-sm text-primary hover:underline">
                  Cấu hình →
                </a>
              </div>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-xl border border-border/80 bg-background/70 p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">Tác vụ nhanh</h2>
                  <p className="text-sm text-muted-foreground">Các hành động phổ biến và quản lý nội dung.</p>
                </div>
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <Button variant="outline" onClick={() => router.push('/admin/posts/new')}>
                  <FileText className="mr-2 h-4 w-4" />
                  Tạo bài viết mới
                </Button>
                <Button variant="outline" onClick={() => router.push('/admin/media')}>
                  Tải lên thư viện
                </Button>
                <Button variant="outline" onClick={() => router.push('/admin/homepage-settings')}>
                  <Home className="mr-2 h-4 w-4" />
                  Cấu hình trang chủ
                </Button>
                <Button variant="outline" onClick={() => router.push('/admin/settings')}>
                  <Settings className="mr-2 h-4 w-4" />
                  Cài đặt website
                </Button>
              </div>
            </div>

            <div className="rounded-xl border border-border/80 bg-background/70 p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">Trạng thái hệ thống</h2>
                  <p className="text-sm text-muted-foreground">Thông tin và thống kê hệ thống hiện tại.</p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => void loadStats()}
                  disabled={loading}
                >
                  Làm mới
                </Button>
              </div>
              <div className="mt-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium">Môi trường</p>
                    <p className="text-sm text-muted-foreground">Production</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Trạng thái cơ sở dữ liệu</p>
                    <p className="text-sm text-green-600">Đã kết nối</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Cập nhật lần cuối</p>
                    <p className="text-sm text-muted-foreground">
                      {lastUpdated || '—'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
