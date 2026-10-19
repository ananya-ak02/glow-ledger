'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export function Navbar() {
  const pathname = usePathname();
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    // Check local session or demo user
    const demoUser = typeof window !== 'undefined' ? localStorage.getItem('glowledger_demo_user') : null;
    if (demoUser) {
      setUserEmail(demoUser);
    } else {
      const supabase = createClient();
      supabase.auth.getUser().then(({ data }) => {
        if (data?.user?.email) {
          setUserEmail(data.user.email);
        }
      }).catch(() => {
        // Fallback for unconfigured dev
      });
    }
  }, [pathname]);

  const navLinks = [
    { href: '/onboarding', label: 'Skin Profile' },
    { href: '/research', label: 'Research' },
    { href: '/routine', label: 'Routine' },
    { href: '/routine/builder', label: 'Builder' },
    { href: '/reactions', label: 'Reaction Log' },
    { href: '/wishlist', label: 'Wishlist & Compare' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/85 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-[var(--space-page)]">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sage text-white shadow-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
            >
              <path d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446A9 9 0 1 1 8.25 4.407 7.5 7.5 0 0 0 12 3Z" />
            </svg>
          </div>
          <span className="font-heading text-xl font-bold tracking-tight text-charcoal">
            GlowLedger
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-charcoal',
                  isActive ? 'text-charcoal font-semibold border-b-2 border-sage pb-1' : 'text-charcoal-light'
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Auth / Profile Button */}
        <div className="flex items-center gap-3">
          {userEmail ? (
            <div className="flex items-center gap-3">
              <Link
                href="/profile"
                className="flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-medium text-charcoal shadow-sm hover:bg-cream-dark transition-colors"
              >
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-sage-light text-[10px] text-charcoal font-bold">
                  {userEmail.charAt(0).toUpperCase()}
                </span>
                <span className="hidden sm:inline max-w-[120px] truncate">{userEmail}</span>
              </Link>
              <button
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    localStorage.removeItem('glowledger_demo_user');
                  }
                  const supabase = createClient();
                  supabase.auth.signOut().finally(() => {
                    window.location.href = '/';
                  });
                }}
                className="text-xs text-charcoal-lighter hover:text-charcoal transition-colors px-2 py-1"
              >
                Log out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="rounded-full px-4 py-1.5 text-xs font-medium text-charcoal hover:bg-cream-dark transition-colors"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="rounded-full bg-sage px-4 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-sage-dark transition-colors"
              >
                Get started
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
