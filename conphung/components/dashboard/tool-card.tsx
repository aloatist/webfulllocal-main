'use client';

import { ExternalLink, LineChart, Scan, Workflow } from 'lucide-react';
import Link from 'next/link';
import { useMemo } from 'react';
import { cn } from '@/lib/utils';
import { DashboardTool } from '@/lib/dashboard/api';

const ICONS: Record<DashboardTool['category'], JSX.Element> = {
  attendance: <Scan className="h-5 w-5" />,
  automation: <Workflow className="h-5 w-5" />,
  reports: <LineChart className="h-5 w-5" />,
  management: <ExternalLink className="h-5 w-5" />,
};

const CATEGORY_LABELS: Record<DashboardTool['category'], string> = {
  attendance: 'Điểm danh',
  automation: 'Tự động hóa',
  reports: 'Báo cáo',
  management: 'Quản trị',
};

interface ToolCardProps {
  tool: DashboardTool;
}

export function ToolCard({ tool }: ToolCardProps) {
  const isExternal = useMemo(() => tool.href.startsWith('http'), [tool.href]);

  return (
    <Link
      href={tool.href}
      className={cn(
        'group flex h-full flex-col justify-between rounded-xl border border-border/80 bg-background/70 p-5 shadow-sm backdrop-blur transition hover:-translate-y-1 hover:shadow-lg',
      )}
      rel={isExternal ? 'noreferrer noopener' : undefined}
      target={isExternal ? '_blank' : undefined}
    >
      <div className="flex items-center gap-3">
        <span className="rounded-full bg-primary/10 p-2 text-primary">{ICONS[tool.category] ?? ICONS.management}</span>
        <div>
          <p className="text-base font-semibold">{tool.name}</p>
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            {CATEGORY_LABELS[tool.category] ?? 'Khác'}
          </p>
        </div>
      </div>
      <p className="mt-4 text-sm text-muted-foreground">{tool.description}</p>
      <div className="mt-6 flex items-center gap-2 text-sm font-medium text-primary">
        <span>{isExternal ? 'Mở công cụ' : 'Đi tới trang'}</span>
        <ExternalLink className="h-4 w-4 transition group-hover:translate-x-1" />
      </div>
    </Link>
  );
}
