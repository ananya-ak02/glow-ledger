'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [consentChecked, setConsentChecked] = useState(true);

  const hasCloudAuth = isSupabaseConfigured();

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    if (!consentChecked) {
      setErrorMsg('Please review and acknowledge the disclaimer to continue.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    const displayName = name.trim() || email.split('@')[0] || 'Friend';

    try {
      if (hasCloudAuth) {
        const supabase = createClient();
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { display_name: displayName },
          },
        });

        if (error) {
          setErrorMsg(error.message);
          setLoading(false);
          return;
        }
      }

      // Save user session & name for this device
      if (typeof window !== 'undefined') {
        localStorage.setItem('glowledger_demo_user', email);
        localStorage.setItem('glowledger_user_name', displayName);
      }

      router.push('/onboarding');
    } catch {
      // Local device fallback
      if (typeof window !== 'undefined') {
        localStorage.setItem('glowledger_demo_user', email);
        localStorage.setItem('glowledger_user_name', displayName);
      }
      router.push('/onboarding');
    } finally {
      setLoading(false);
    }
  }

  function handleInstantGuestStart() {
    if (typeof window !== 'undefined') {
      const displayName = name.trim() || 'Skincare Friend';
      localStorage.setItem('glowledger_user_name', displayName);
      localStorage.setItem('glowledger_demo_user', 'guest@glowledger.app');
    }
    router.push('/onboarding');
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-[var(--space-page)] py-12 bg-background">
      <div className="absolute top-1/4 left-1/2 -z-10 h-80 w-80 -translate-x-1/2 rounded-full bg-gradient-to-br from-blush via-sage-light to-cream opacity-50 blur-3xl pointer-events-none" />

      <div className="w-full max-w-md animate-fade-in">
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
            Start your skin profile
          </h1>
          <p className="mt-1.5 text-sm text-charcoal-light">
            Understand your routine, conflict rules, and ingredient fits
          </p>
        </div>

        <Card className="shadow-lg border-border bg-card">
          <CardHeader>
            <CardTitle>Create Profile</CardTitle>
            <CardDescription>
              {hasCloudAuth
                ? 'Create a cloud account to sync routines across your phone & laptop'
                : 'Enter your details to personalize your routine on this device'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {errorMsg && (
              <div className="mb-4 rounded-xl border border-terracotta/30 bg-terracotta/10 px-4 py-3 text-xs text-terracotta-dark">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSignup} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-charcoal mb-1.5">
                  What is your name?
                </label>
                <Input
                  type="text"
                  required
                  placeholder="e.g. Priya"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal mb-1.5">
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
                <label className="block text-xs font-semibold text-charcoal mb-1.5">
                  Password
                </label>
                <Input
                  type="password"
                  required
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="flex items-start gap-2.5 pt-1">
                <input
                  type="checkbox"
                  id="consent"
                  checked={consentChecked}
                  onChange={(e) => setConsentChecked(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-border text-sage focus:ring-sage"
                />
                <label htmlFor="consent" className="text-xs text-charcoal-light leading-relaxed">
                  I understand GlowLedger provides informational analysis, not medical advice. Always patch test new products.
                </label>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-11 rounded-xl bg-sage hover:bg-sage-dark text-white font-medium shadow-sm transition-all text-xs"
              >
                {loading ? 'Setting up Profile...' : 'Create Profile & Start Onboarding →'}
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

            {/* Instant Guest Start without password */}
            <button
              type="button"
              onClick={handleInstantGuestStart}
              className="w-full rounded-xl bg-cream-dark px-4 py-2.5 text-xs font-semibold text-charcoal hover:bg-blush-light transition-colors flex items-center justify-center gap-1.5"
            >
              <span>⚡</span>
              <span>Start Instantly on this Device (No Password)</span>
            </button>
          </CardContent>

          <CardFooter className="justify-center border-t border-border text-xs text-charcoal-light">
            Already have a profile?{' '}
            <Link href="/login" className="ml-1 font-semibold text-terracotta hover:underline">
              Log in
            </Link>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}
