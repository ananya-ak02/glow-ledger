'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleEmailLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // If Supabase is unconfigured or credentials failed, offer demo mode hint
        setErrorMsg(error.message);
      } else {
        router.push('/onboarding');
      }
    } catch {
      setErrorMsg('Could not connect to authentication service. Try demo mode below!');
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleLogin() {
    try {
      const supabase = createClient();
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/callback`,
        },
      });
    } catch {
      setErrorMsg('Google login requires configured Supabase OAuth credentials.');
    }
  }

  function handleDemoLogin() {
    if (typeof window !== 'undefined') {
      localStorage.setItem('glowledger_demo_user', 'demo@glowledger.app');
    }
    router.push('/onboarding');
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
            Continue understanding your skin and routines
          </p>
        </div>

        <Card className="shadow-lg border-border bg-card">
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>
              Enter your credentials to access your saved profile
            </CardDescription>
          </CardHeader>
          <CardContent>
            {errorMsg && (
              <div className="mb-4 rounded-xl border border-terracotta/30 bg-terracotta/10 px-4 py-3 text-xs text-terracotta-dark">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleEmailLogin} className="space-y-4">
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
                className="w-full h-11 rounded-xl bg-sage hover:bg-sage-dark text-white font-medium shadow-sm transition-all"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-3 text-charcoal-lighter font-medium">Or</span>
              </div>
            </div>

            {/* Google Login */}
            <Button
              type="button"
              variant="outline"
              onClick={handleGoogleLogin}
              className="w-full h-11 rounded-xl border-border hover:bg-cream-dark text-charcoal text-sm font-medium flex items-center justify-center gap-2"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              Continue with Google
            </Button>

            {/* Instant Demo Sandbox Access */}
            <div className="mt-4 pt-4 border-t border-border/60 text-center">
              <button
                type="button"
                onClick={handleDemoLogin}
                className="w-full rounded-xl bg-cream-dark px-4 py-2.5 text-xs font-semibold text-charcoal hover:bg-blush-light transition-colors flex items-center justify-center gap-1.5"
              >
                <span>🌿</span>
                <span>Explore with Demo Account (Instant Access)</span>
              </button>
            </div>
          </CardContent>

          <CardFooter className="justify-center border-t border-border text-xs text-charcoal-light">
            Don&apos;t have an account yet?{' '}
            <Link href="/signup" className="ml-1 font-semibold text-terracotta hover:underline">
              Create profile
            </Link>
          </CardFooter>
        </Card>

        {/* Safety & Demo Notice */}
        <p className="mt-6 text-center text-xs leading-relaxed text-charcoal-lighter max-w-sm mx-auto">
          Informational skincare intelligence only. Not medical advice.
          We never share personal info or photos with AI providers.
        </p>
      </div>
    </main>
  );
}
