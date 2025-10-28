'use client';

import { useMemo } from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface RevenueData {
  date: string;
  tours: number;
  homestays: number;
  total: number;
}

interface RevenueChartProps {
  data: RevenueData[];
  period?: 'daily' | 'weekly' | 'monthly';
}

export function RevenueChart({ data, period = 'daily' }: RevenueChartProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(value);
  };

  const totalRevenue = useMemo(() => {
    return data.reduce((sum, item) => sum + item.total, 0);
  }, [data]);

  const avgRevenue = useMemo(() => {
    return data.length > 0 ? totalRevenue / data.length : 0;
  }, [data, totalRevenue]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Doanh thu</CardTitle>
        <CardDescription>
          Tổng: {formatCurrency(totalRevenue)} • Trung bình: {formatCurrency(avgRevenue)}/{period === 'daily' ? 'ngày' : period === 'weekly' ? 'tuần' : 'tháng'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorTours" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorHomestays" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="date"
              className="text-xs"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            <YAxis
              className="text-xs"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
              tickFormatter={formatCurrency}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
              formatter={(value: number) => formatCurrency(value)}
            />
            <Legend />
            <Area
              type="monotone"
              dataKey="tours"
              name="Tours"
              stroke="#3b82f6"
              fillOpacity={1}
              fill="url(#colorTours)"
            />
            <Area
              type="monotone"
              dataKey="homestays"
              name="Homestays"
              stroke="#10b981"
              fillOpacity={1}
              fill="url(#colorHomestays)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
