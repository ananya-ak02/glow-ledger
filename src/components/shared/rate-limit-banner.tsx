'use client';

interface RateLimitBannerProps {
  type: 'user' | 'global';
  message?: string;
}

/**
 * Shown when rate limits are reached.
 * Friendly, non-alarming UI for free-tier limits.
 */
export function RateLimitBanner({ type, message }: RateLimitBannerProps) {
  const defaultMessage =
    type === 'user'
      ? "You've reached your daily research limit. It resets at midnight UTC."
      : 'High demand right now! Research will be available again shortly.';

  return (
    <div
      className="flex items-center gap-3 rounded-xl border border-blush-dark bg-blush-light px-4 py-3 shadow-sm"
      role="alert"
    >
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blush">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="var(--color-terracotta)"
          className="h-4 w-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
          />
        </svg>
      </div>
      <div>
        <p className="text-sm font-medium text-charcoal">
          {type === 'user' ? 'Daily limit reached' : 'High demand'}
        </p>
        <p className="text-xs text-charcoal-light">
          {message ?? defaultMessage}
        </p>
      </div>
    </div>
  );
}
