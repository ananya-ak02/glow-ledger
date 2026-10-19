import * as React from 'react';
import { cn } from '@/lib/utils';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          'flex min-h-[90px] w-full rounded-xl border border-input bg-card px-4 py-3 text-sm text-charcoal placeholder:text-charcoal-lighter/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:border-sage disabled:cursor-not-allowed disabled:opacity-50 transition-all resize-y',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = 'Textarea';
