'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const hasCloudAuth = isSupabaseConfigured();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const displayName = userName.trim() || email.split('@')[0] || 'Friend';

    try {
      if (hasCloudAuth) {
        const supabase = createClient();
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          setErrorMsg(error.message);
          setLoading(false);
          return;
        }
      }

      // Save user session and display name for this device
      if (typeof window !== 'undefined') {
        localStorage.setItem('glowledger_demo_user', email || 'user@glowledger.app');
        if (displayName) {
          localStorage.setItem('glowledger_user_name', displayName);
        }
      }

      router.push('/routine');
    } catch {
      // Local device fallback
      if (typeof window !== 'undefined') {
        localStorage.setItem('glowledger_demo_user', email || 'user@glowledger.app');
        if (displayName) {
          localStorage.setItem('glowledger_user_name', displayName);
        }
      }
      router.push('/routine');
    } finally {
      setLoading(false);
    }
  }

  function handleInstantGuestLogin() {
    if (typeof window !== 'undefined') {
      const name = userName.trim() || 'Skincare Explorer';
      localStorage.setItem('glowledger_user_name', name);
      localStorage.setItem('glowledger_demo_user', 'guest@glowledger.app');
    }
    router.push('/routine');
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-[var(--space-page)] py-12 bg-background">
      {/* Background ambient blob */}
      <div className="absolute top-1/4 left-1/2 -z-10 h-80 w-80 -translate-x-1/2 rounded-full bg-gradient-to-br from-blush via-sage-light to-cream opacity-50 blur-3xl pointer-events-none" />

      <div className="w-full max-w-md animate-fade-in">
        {/* Brand header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sage text-white shadow-sm">
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
            <span className="font-heading text-2xl font-bold tracking-tight text-charcoal">
              GlowLedger
            </span>
          </Link>
          <h1 className="font-heading text-3xl font-bold text-charcoal">
            Welcome back
          </h1>
          <p className="mt-1.5 text-sm text-charcoal-light">
            Sign in to access your saved skincare routine and intelligence
          </p>
        </div>

        <Card className="shadow-lg border-border bg-card">
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>
              {hasCloudAuth
                ? 'Sign in with your cloud account to sync routines across devices'
                : 'Sign in to access your routine on this device'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {errorMsg && (
              <div className="mb-4 rounded-xl border border-terracotta/30 bg-terracotta/10 px-4 py-3 text-xs text-terracotta-dark">
                {errorMsg}
              </div>
            )}

            {!hasCloudAuth && (
              <div className="mb-4 rounded-xl border border-sage/40 bg-[var(--color-verdict-good-bg)]/60 p-3 text-xs text-charcoal">
                <span className="font-semibold text-charcoal">🌿 Device Storage Active:</span>
                <span className="ml-1 text-charcoal-light">
                  Your routines are automatically saved to this device. Enter your name below to personalize your view!
                </span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-charcoal mb-1.5">
                  Your Name (Optional)
                </label>
                <Input
                  type="text"
                  placeholder="e.g. Priya"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-charcoal mb-1.5">
                  Email address
                </label>
                <Input
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-charcoal mb-1.5">
                  Password
                </label>
                <Input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-11 rounded-xl bg-sage hover:bg-sage-dark text-white font-medium shadow-sm transition-all text-xs"
              >
                {loading ? 'Accessing Profile...' : 'Sign In & View Routine →'}
              </Button>
            </form>

            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-3 text-charcoal-lighter font-medium">Or</span>
              </div>
            </div>

            {/* Instant One-Click Device Access */}
            <button
              type="button"
              onClick={handleInstantGuestLogin}
              className="w-full rounded-xl bg-cream-dark px-4 py-2.5 text-xs font-semibold text-charcoal hover:bg-blush-light transition-colors flex items-center justify-center gap-1.5"
            >
              <span>⚡</span>
              <span>Instant Access on this Device (No Password)</span>
            </button>
          </CardContent>

          <CardFooter className="justify-center border-t border-border text-xs text-charcoal-light">
            Don&apos;t have a profile yet?{' '}
            <Link href="/signup" className="ml-1 font-semibold text-terracotta hover:underline">
              Create profile
            </Link>
          </CardFooter>
        </Card>

        <p className="mt-6 text-center text-xs leading-relaxed text-charcoal-lighter max-w-sm mx-auto">
          Informational skincare intelligence only. Not medical advice.
          We never share personal info or photos with AI providers.
        </p>
      </div>
    </main>
  );
}
