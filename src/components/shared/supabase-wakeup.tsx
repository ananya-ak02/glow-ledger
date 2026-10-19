'use client';

import { useState, useEffect } from 'react';

interface SupabaseWakeupProps {
  children: React.ReactNode;
  checkUrl?: string;
}

/**
 * Handles Supabase free-tier pause-on-inactivity.
 * Shows a friendly "waking up" state while the database resumes.
 */
export function SupabaseWakeup({ children, checkUrl = '/api/health' }: SupabaseWakeupProps) {
  const [status, setStatus] = useState<'checking' | 'awake' | 'waking' | 'error'>('checking');

  useEffect(() => {
    let cancelled = false;

    async function check() {
      try {
        const res = await fetch(checkUrl, { cache: 'no-store' });
        if (!cancelled) {
          if (res.ok) {
            setStatus('awake');
          } else if (res.status === 503) {
            setStatus('waking');
            setTimeout(check, 5000);
          } else {
            // In dev without Supabase configured yet, allow viewing
            setStatus('awake');
          }
        }
      } catch {
        if (!cancelled) {
          // In development or when API route isn't up yet, gracefully default to awake
          setStatus('awake');
        }
      }
    }

    check();
    return () => {
      cancelled = true;
    };
  }, [checkUrl]);

  if (status === 'awake') return <>{children}</>;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-6">
      {status === 'checking' || status === 'waking' ? (
        <>
          <div className="relative h-16 w-16">
            <div className="absolute inset-0 rounded-full bg-sage-light opacity-30 animate-pulse-soft" />
            <div
              className="absolute inset-2 rounded-full bg-sage opacity-50 animate-pulse-soft"
              style={{ animationDelay: '0.5s' }}
            />
            <div
              className="absolute inset-4 rounded-full bg-sage-dark animate-pulse-soft"
              style={{ animationDelay: '1s' }}
            />
          </div>
          <div className="text-center">
            <h2 className="font-heading text-xl font-semibold text-charcoal">
              {status === 'checking' ? 'Connecting...' : 'Waking up'}
            </h2>
            <p className="mt-1 text-sm text-charcoal-light">
              {status === 'waking'
                ? 'Our database is waking from sleep mode. This takes about 15 seconds on the free tier.'
                : 'Setting things up...'}
            </p>
          </div>
        </>
      ) : (
        <>
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-verdict-avoid-bg)]">
            <span className="text-2xl">🌿</span>
          </div>
          <div className="text-center">
            <h2 className="font-heading text-xl font-semibold text-charcoal">
              Connection issue
            </h2>
            <p className="mt-1 text-sm text-charcoal-light">
              We couldn&apos;t connect to our servers. Please try again in a moment.
            </p>
            <button
              onClick={() => {
                setStatus('checking');
              }}
              className="mt-4 rounded-full bg-sage px-6 py-2 text-sm font-medium text-white hover:bg-sage-dark"
            >
              Retry
            </button>
          </div>
        </>
      )}
    </div>
  );
}
