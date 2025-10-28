import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  title: string;
  value: ReactNode;
  description?: string;
  className?: string;
  accent?: 'default' | 'success' | 'warning' | 'info';
}

const ACCENT_STYLES: Record<NonNullable<MetricCardProps['accent']>, string> = {
  default: 'border-border/80',
  success: 'border-emerald-400/40 bg-emerald-400/5',
  warning: 'border-amber-400/40 bg-amber-400/5',
  info: 'border-sky-400/40 bg-sky-400/5',
};

export function MetricCard({ title, value, description, className, accent = 'default' }: MetricCardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border bg-background/70 p-5 shadow-sm backdrop-blur transition hover:shadow-md',
        ACCENT_STYLES[accent],
        className,
      )}
    >
      <p className="text-sm uppercase tracking-[0.25em] text-muted-foreground">{title}</p>
      <div className="mt-3 text-3xl font-semibold sm:text-4xl">{value}</div>
      {description && <p className="mt-3 text-sm text-muted-foreground">{description}</p>}
    </div>
  );
}
