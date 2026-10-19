'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [consentChecked, setConsentChecked] = useState(true);

  async function handleEmailSignup(e: React.FormEvent) {
    e.preventDefault();
    if (!consentChecked) {
      setErrorMsg('Please review and acknowledge the disclaimer to continue.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        setErrorMsg(error.message);
      } else if (data?.user) {
        // Successful signup, redirect to onboarding wizard
        router.push('/onboarding');
      }
    } catch {
      setErrorMsg('Authentication service unavailable. You can use the Demo mode below to start immediately!');
    } finally {
      setLoading(false);
    }
  }

  function handleDemoSignup() {
    if (typeof window !== 'undefined') {
      localStorage.setItem('glowledger_demo_user', 'newuser@glowledger.app');
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
            Let&apos;s understand your skin
          </h1>
          <p className="mt-1.5 text-sm text-charcoal-light">
            Create your free profile to start personalized analysis
          </p>
        </div>

        <Card className="shadow-lg border-border bg-card">
          <CardHeader>
            <CardTitle>Create Skin Profile</CardTitle>
            <CardDescription>
              Sign up to save your skin concerns, routine, and research reports
            </CardDescription>
          </CardHeader>
          <CardContent>
            {errorMsg && (
              <div className="mb-4 rounded-xl border border-terracotta/30 bg-terracotta/10 px-4 py-3 text-xs text-terracotta-dark">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleEmailSignup} className="space-y-4">
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
                  Choose a password
                </label>
                <Input
                  type="password"
                  required
                  minLength={6}
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {/* Consent & Privacy Notice */}
              <div className="rounded-xl bg-cream-dark/60 p-3.5 border border-border/80">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consentChecked}
                    onChange={(e) => setConsentChecked(e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-border text-sage focus:ring-sage"
                  />
                  <span className="text-xs text-charcoal-light leading-relaxed">
                    I understand GlowLedger provides educational insights, <strong>not medical advice</strong>.
                    Free-tier AI APIs never receive personal identifiers (names, photos, emails).
                  </span>
                </label>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-11 rounded-xl bg-sage hover:bg-sage-dark text-white font-medium shadow-sm transition-all"
              >
                {loading ? 'Creating Profile...' : 'Begin Skin Onboarding'}
              </Button>
            </form>

            {/* Instant Demo Sandbox Access */}
            <div className="mt-4 pt-4 border-t border-border/60 text-center">
              <button
                type="button"
                onClick={handleDemoSignup}
                className="w-full rounded-xl bg-cream-dark px-4 py-2.5 text-xs font-semibold text-charcoal hover:bg-blush-light transition-colors flex items-center justify-center gap-1.5"
              >
                <span>🌿</span>
                <span>Continue without sign-up (Instant Demo Mode)</span>
              </button>
            </div>
          </CardContent>

          <CardFooter className="justify-center border-t border-border text-xs text-charcoal-light">
            Already have an account?{' '}
            <Link href="/login" className="ml-1 font-semibold text-terracotta hover:underline">
              Sign in
            </Link>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}
