import * as React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'good' | 'caution' | 'avoid';
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  const variantClasses = {
    default: 'bg-sage text-white',
    secondary: 'bg-blush text-charcoal',
    outline: 'border border-border text-charcoal bg-transparent',
    good: 'bg-[var(--color-verdict-good-bg)] text-charcoal border border-[var(--color-verdict-good)]',
    caution: 'bg-[var(--color-verdict-caution-bg)] text-charcoal border border-[var(--color-verdict-caution)]',
    avoid: 'bg-[var(--color-verdict-avoid-bg)] text-[var(--color-terracotta-dark)] border border-[var(--color-terracotta)]',
  };

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors',
        variantClasses[variant],
        className
      )}
      {...props}
    />
  );
}
