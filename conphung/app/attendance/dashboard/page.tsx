'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  AttendanceSummary,
  CheckinLogEntry,
  fetchAttendanceSummary,
  fetchRecentCheckins,
  getApiBaseUrl,
} from '@/lib/attendance/api';
import { StatusBadge } from '@/components/attendance/status-badge';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCcw } from 'lucide-react';

const POLL_INTERVAL_MS = 7000;

export default function AttendanceDashboardPage() {
  const [summary, setSummary] = useState<AttendanceSummary | null>(null);
  const [logs, setLogs] = useState<CheckinLogEntry[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const apiBaseUrl = useMemo(() => getApiBaseUrl(), []);

  const loadData = useCallback(
    async (options?: { showSpinner?: boolean }) => {
      const showSpinner = options?.showSpinner ?? false;
      if (showSpinner) {
        setIsLoading(true);
      } else {
        setIsRefreshing(true);
      }

      try {
        const [summaryData, logsData] = await Promise.all([
          fetchAttendanceSummary(),
          fetchRecentCheckins(30),
        ]);

        setSummary(summaryData);
        setLogs(logsData);
        setErrorMessage(null);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Không thể tải dữ liệu';
        setErrorMessage(message);
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [],
  );

  useEffect(() => {
    void loadData({ showSpinner: true });
    const interval = setInterval(() => {
      void loadData();
    }, POLL_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [loadData]);

  const checkinRate = useMemo(() => {
    if (!summary || summary.total === 0) {
      return 0;
    }
    return Math.round((summary.checkedIn / summary.total) * 100);
  }, [summary]);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 py-10">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">Dashboard</p>
          <h1 className="text-3xl font-semibold sm:text-4xl">Thống kê điểm danh realtime</h1>
          <p className="text-sm text-muted-foreground">
            Dữ liệu lấy từ máy chủ NestJS ({apiBaseUrl}). Bảng bên dưới tự động cập nhật mỗi {Math.round(POLL_INTERVAL_MS / 1000)} giây.
          </p>
        </div>
        <Button variant="outline" onClick={() => void loadData()} disabled={isRefreshing}>
          {isRefreshing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCcw className="mr-2 h-4 w-4" />}Tải lại
        </Button>
      </header>

      {errorMessage && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {errorMessage}
        </div>
      )}

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-border/80 bg-background/60 p-5 shadow-sm backdrop-blur">
          <p className="text-sm text-muted-foreground">Tổng số khách</p>
          <p className="text-3xl font-semibold">
            {isLoading && !summary ? <Loader2 className="h-6 w-6 animate-spin" /> : summary?.total ?? '--'}
          </p>
        </div>
        <div className="rounded-xl border border-border/80 bg-background/60 p-5 shadow-sm backdrop-blur">
          <p className="text-sm text-muted-foreground">Đã điểm danh</p>
          <p className="text-3xl font-semibold text-green-600 dark:text-green-400">
            {isLoading && !summary ? <Loader2 className="h-6 w-6 animate-spin" /> : summary?.checkedIn ?? '--'}
          </p>
        </div>
        <div className="rounded-xl border border-border/80 bg-background/60 p-5 shadow-sm backdrop-blur">
          <p className="text-sm text-muted-foreground">Chưa điểm danh</p>
          <p className="text-3xl font-semibold text-yellow-600 dark:text-yellow-300">
            {isLoading && !summary ? <Loader2 className="h-6 w-6 animate-spin" /> : summary?.pending ?? '--'}
          </p>
        </div>
        <div className="rounded-xl border border-border/80 bg-background/60 p-5 shadow-sm backdrop-blur">
          <p className="text-sm text-muted-foreground">Tỷ lệ hoàn thành</p>
          <p className="text-3xl font-semibold">
            {isLoading && !summary ? <Loader2 className="h-6 w-6 animate-spin" /> : `${checkinRate}%`}
          </p>
        </div>
      </section>

      <section className="rounded-xl border border-border/80 bg-background/60 shadow-sm backdrop-blur">
        <div className="flex items-center justify-between border-b border-border/80 px-6 py-4">
          <div>
            <h2 className="text-lg font-medium">Lượt quét gần nhất</h2>
            <p className="text-sm text-muted-foreground">Danh sách tối đa 30 lượt theo thời gian thực.</p>
          </div>
          {isLoading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
        </div>
        <div className="max-h-[480px] overflow-auto">
          <table className="min-w-full divide-y divide-border/60 text-sm">
            <thead className="bg-muted/60 text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3 text-left">Thời gian</th>
                <th className="px-4 py-3 text-left">Mã quét</th>
                <th className="px-4 py-3 text-left">Người tham gia</th>
                <th className="px-4 py-3 text-left">Thiết bị</th>
                <th className="px-4 py-3 text-left">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 bg-background/80">
              {logs.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                    {isLoading ? 'Đang tải dữ liệu...' : 'Chưa có lượt quét nào.'}
                  </td>
                </tr>
              )}

              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-muted/40">
                  <td className="whitespace-nowrap px-4 py-3">
                    {new Date(log.createdAt).toLocaleString('vi-VN')}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 font-semibold uppercase tracking-wide">
                    {log.scanCode}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col">
                      <span className="font-medium">{log.participant?.fullName ?? '—'}</span>
                      <span className="text-xs text-muted-foreground">{log.participant?.code ?? 'Không xác định'}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col">
                      <span>{log.scannerId ?? 'Không rõ'}</span>
                      {log.deviceInfo && <span className="text-xs text-muted-foreground">{log.deviceInfo}</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={log.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <p className="text-xs text-muted-foreground">
        Gợi ý: dùng Redis hoặc Supabase Realtime để đẩy sự kiện thay vì polling. Endpoint webhook của n8n có thể đăng ký ngay tại backend khi trạng thái = success/duplicate/invalid.
      </p>
    </div>
  );
}
