import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circle' | 'card' | 'rectangle';
}

export function Skeleton({ className, variant = 'text' }: SkeletonProps) {
  const baseClasses = 'animate-pulse-soft rounded-lg bg-[var(--color-cream-dark)]';

  const variantClasses = {
    text: 'h-4 w-full',
    circle: 'h-10 w-10 rounded-full',
    card: 'h-48 w-full rounded-2xl',
    rectangle: 'h-24 w-full rounded-xl',
  };

  return (
    <div
      className={cn(baseClasses, variantClasses[variant], className)}
      role="status"
      aria-label="Loading..."
    />
  );
}

/** Loading skeleton for a product verdict card */
export function VerdictCardSkeleton() {
  return (
    <div className="space-y-4 rounded-2xl border border-[var(--color-border)] bg-card p-6 shadow-card">
      <div className="flex items-center gap-3">
        <Skeleton variant="circle" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-2/3" />
          <Skeleton className="h-3 w-1/3" />
        </div>
      </div>
      <Skeleton variant="rectangle" />
      <div className="space-y-2">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-5/6" />
        <Skeleton className="h-3 w-4/6" />
      </div>
    </div>
  );
}

/** Loading skeleton for routine steps */
export function RoutineStepSkeleton() {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-[var(--color-border)] bg-card p-4">
      <Skeleton className="h-8 w-8 rounded-lg" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-3 w-1/3" />
      </div>
    </div>
  );
}
