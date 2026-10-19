import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number; // 0 to 100
}

export function Progress({ value, className, ...props }: ProgressProps) {
  const clampedValue = Math.min(100, Math.max(0, value));

  return (
    <div
      className={cn('relative h-2.5 w-full overflow-hidden rounded-full bg-cream-dark', className)}
      role="progressbar"
      aria-valuenow={clampedValue}
      aria-valuemin={0}
      aria-valuemax={100}
      {...props}
    >
      <div
        className="h-full bg-gradient-to-r from-sage to-terracotta transition-all duration-300 ease-out rounded-full"
        style={{ width: `${clampedValue}%` }}
      />
    </div>
  );
}
