'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface BookingData {
  date: string;
  confirmed: number;
  pending: number;
  cancelled: number;
}

interface BookingStatsProps {
  data: BookingData[];
}

export function BookingStats({ data }: BookingStatsProps) {
  const totalBookings = data.reduce(
    (sum, item) => sum + item.confirmed + item.pending + item.cancelled,
    0
  );

  const confirmedRate = data.reduce((sum, item) => sum + item.confirmed, 0);
  const conversionRate = totalBookings > 0 ? (confirmedRate / totalBookings) * 100 : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Thống kê đặt phòng</CardTitle>
        <CardDescription>
          Tổng: {totalBookings} • Tỷ lệ xác nhận: {conversionRate.toFixed(1)}%
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="date"
              className="text-xs"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            <YAxis
              className="text-xs"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
            />
            <Legend />
            <Bar dataKey="confirmed" name="Đã xác nhận" fill="#10b981" radius={[4, 4, 0, 0]} />
            <Bar dataKey="pending" name="Chờ xác nhận" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            <Bar dataKey="cancelled" name="Đã hủy" fill="#ef4444" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
