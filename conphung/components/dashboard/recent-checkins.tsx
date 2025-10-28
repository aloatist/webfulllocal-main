'use client';

import { useMemo } from 'react';
import { StatusBadge } from '@/components/attendance/status-badge';
import { CheckinLogView } from '@/lib/dashboard/api';

interface RecentCheckinsProps {
  records: CheckinLogView[];
}

export function RecentCheckins({ records }: RecentCheckinsProps) {
  const empty = records.length === 0;
  const formatted = useMemo(
    () =>
      records.map((record) => ({
        ...record,
        createdAtLabel: new Date(record.createdAt).toLocaleString('vi-VN'),
      })),
    [records],
  );

  return (
    <div className="rounded-xl border border-border/80 bg-background/70 shadow-sm backdrop-blur">
      <div className="flex items-center justify-between border-b border-border/80 px-6 py-4">
        <div>
          <h2 className="text-lg font-semibold">Lượt quét gần nhất</h2>
          <p className="text-sm text-muted-foreground">Cập nhật realtime thông qua API backend.</p>
        </div>
      </div>
      <div className="max-h-[420px] overflow-auto">
        <table className="min-w-full divide-y divide-border/40 text-sm">
          <thead className="bg-muted/60 text-xs uppercase tracking-[0.2em] text-muted-foreground">
            <tr>
              <th className="px-4 py-3 text-left">Thời gian</th>
              <th className="px-4 py-3 text-left">Mã</th>
              <th className="px-4 py-3 text-left">Người tham gia</th>
              <th className="px-4 py-3 text-left">Thiết bị</th>
              <th className="px-4 py-3 text-left">Trạng thái</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/20 bg-background/80">
            {empty && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-muted-foreground">
                  Chưa có lượt quét nào.
                </td>
              </tr>
            )}
            {formatted.map((record) => (
              <tr key={record.id} className="transition hover:bg-muted/40">
                <td className="whitespace-nowrap px-4 py-3">{record.createdAtLabel}</td>
                <td className="whitespace-nowrap px-4 py-3 font-semibold uppercase tracking-wide">{record.scanCode}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-col">
                    <span className="font-medium">{record.participant?.fullName ?? '—'}</span>
                    <span className="text-xs text-muted-foreground">{record.participant?.code ?? 'Không xác định'}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-col">
                    <span>{record.scannerId ?? 'Không rõ'}</span>
                    {record.deviceInfo && <span className="text-xs text-muted-foreground">{record.deviceInfo}</span>}
                  </div>
                </td>
                <td className="px-4 py-3"><StatusBadge status={record.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
