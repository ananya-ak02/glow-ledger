'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/shared/navbar';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { type OnboardingState, INITIAL_ONBOARDING_STATE } from '@/types/onboarding';
import { isSupabaseConfigured } from '@/lib/supabase/client';

export default function ProfilePage() {
  const router = useRouter();
  const [profileData, setProfileData] = useState<OnboardingState>(INITIAL_ONBOARDING_STATE);
  const [userName, setUserName] = useState<string>('');
  const [supabaseActive, setSupabaseActive] = useState<boolean>(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    setSupabaseActive(isSupabaseConfigured());

    // Check local storage draft or session
    try {
      const savedName = localStorage.getItem('glowledger_user_name') || '';
      if (savedName) setUserName(savedName);

      const saved =
        localStorage.getItem('glowledger_user_profile') ||
        localStorage.getItem('glowledger_onboarding_draft_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        setProfileData(parsed);
        if (parsed.name) setUserName(parsed.name);
      } else {
        fetch('/api/profile')
          .then((res) => (res.ok ? res.json() : null))
          .then((data) => {
            if (data?.profile) {
              setProfileData({
                name: (data.profile as any)?.name || savedName,
                skin_type: data.profile.skin_type,
                skin_type_notes: data.profile.skin_type_notes || '',
                concerns: data.concerns || [],
                am_routine: data.routines?.find((r: { routine_type: string }) => r.routine_type === 'am')?.routine_steps || [],
                pm_routine: data.routines?.find((r: { routine_type: string }) => r.routine_type === 'pm')?.routine_steps || [],
                worked_products: [],
                past_reactions: data.reactions || [],
                age_range: data.profile.age_range || '25-34',
                climate: data.profile.climate || 'temperate',
                budget: data.profile.budget || 'balanced',
                is_pregnant: Boolean(data.profile.is_pregnant),
                known_allergies: data.profile.known_allergies || [],
                fragrance_preference: data.profile.fragrance_preference || 'neutral',
                ai_consent_acknowledged: true,
              });
            }
          })
          .catch(() => {});
      }
    } catch {
      // Fallback
    }
  }, []);

  function handleDeleteData() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('glowledger_user_profile');
      localStorage.removeItem('glowledger_onboarding_draft_v1');
      localStorage.removeItem('glowledger_onboarding_completed');
      localStorage.removeItem('glowledger_demo_user');
      localStorage.removeItem('glowledger_user_name');
    }
    router.push('/');
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8 sm:py-12 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xl">🌿</span>
              <span className="text-[11px] font-bold uppercase tracking-wider text-sage-dark bg-sage/15 px-2.5 py-0.5 rounded-full border border-sage/30">
                {supabaseActive ? 'Cloud Sync Enabled' : 'Device Storage Active'}
              </span>
            </div>
            <h1 className="font-heading text-3xl font-bold text-charcoal">
              {userName ? `${userName}'s Skin Profile` : 'My Skin Profile'}
            </h1>
            <p className="mt-1 text-sm text-charcoal-light">
              {userName ? `Welcome back, ${userName}! ` : ''}Your personalized skin intelligence parameters and safety limits
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/onboarding"
              className="rounded-full bg-sage hover:bg-sage-dark text-white px-5 py-2 text-xs font-semibold shadow-sm transition-all"
            >
              ✎ Edit Onboarding Answers
            </Link>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Card 1: Skin Type & Barrier */}
          <Card className="p-6 border-border bg-card">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-charcoal-lighter">
                Skin Type & Barrier
              </span>
              <Badge variant="good" className="capitalize text-xs">
                {profileData.skin_type || 'Unspecified'}
              </Badge>
            </div>

            <div className="space-y-3">
              <div>
                <span className="text-xs text-charcoal-light block">Skin Notes:</span>
                <p className="text-xs text-charcoal mt-0.5">
                  {profileData.skin_type_notes || 'No custom notes provided.'}
                </p>
              </div>

              <div className="pt-3 border-t border-border flex items-center justify-between text-xs">
                <span className="text-charcoal-light">Climate Condition:</span>
                <span className="font-semibold text-charcoal capitalize">{profileData.climate}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-charcoal-light">Age Bracket:</span>
                <span className="font-semibold text-charcoal">{profileData.age_range}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-charcoal-light">Budget Tier:</span>
                <span className="font-semibold text-charcoal capitalize">{profileData.budget}</span>
              </div>
            </div>
          </Card>

          {/* Card 2: Safety & Special Modes */}
          <Card className="p-6 border-border bg-card">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-charcoal-lighter">
                Safety & Sensitivities
              </span>
              {profileData.is_pregnant && (
                <Badge variant="caution" className="text-xs">
                  🤰 Pregnancy Mode Active
                </Badge>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-charcoal-light">Fragrance Preference:</span>
                <span className="font-semibold text-charcoal capitalize">
                  {profileData.fragrance_preference}
                </span>
              </div>

              <div>
                <span className="text-xs text-charcoal-light block mb-1">Known Allergies:</span>
                {profileData.known_allergies.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {profileData.known_allergies.map((all) => (
                      <Badge key={all} variant="avoid" className="text-[11px]">
                        🛡️ {all}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <span className="text-xs text-charcoal-lighter">None listed</span>
                )}
              </div>

              {profileData.is_pregnant && (
                <p className="mt-2 text-[11px] text-terracotta-dark leading-relaxed rounded-lg bg-blush-light p-2.5 border border-terracotta/20">
                  ⚠️ Retinoids and high-dose salicylic acid are automatically excluded.
                </p>
              )}
            </div>
          </Card>

          {/* Card 3: Active Concerns */}
          <Card className="p-6 border-border bg-card">
            <span className="text-xs font-semibold uppercase tracking-wider text-charcoal-lighter block mb-4">
              Targeted Skin Concerns ({profileData.concerns.length})
            </span>

            {profileData.concerns.length > 0 ? (
              <div className="space-y-2.5">
                {profileData.concerns.map((c) => (
                  <div
                    key={c.type}
                    className="flex items-center justify-between rounded-xl border border-border bg-cream/40 p-3 text-xs"
                  >
                    <div>
                      <span className="font-semibold text-charcoal capitalize">
                        {c.type.replace(/_/g, ' ')}
                      </span>
                      <div className="text-[11px] text-charcoal-lighter mt-0.5">
                        Areas: {c.affected_areas?.join(', ') || 'All over'}
                      </div>
                    </div>
                    <Badge variant={c.severity === 'severe' ? 'avoid' : 'secondary'} className="capitalize">
                      {c.severity}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-charcoal-lighter">No concerns selected.</p>
            )}
          </Card>

          {/* Card 4: Routine Snapshot */}
          <Card className="p-6 border-border bg-card">
            <span className="text-xs font-semibold uppercase tracking-wider text-charcoal-lighter block mb-4">
              Current Routines
            </span>

            <div className="space-y-3">
              <div>
                <span className="text-xs font-semibold text-charcoal block mb-1">
                  ☀️ AM Routine ({profileData.am_routine.length} steps)
                </span>
                {profileData.am_routine.length > 0 ? (
                  <ul className="text-xs text-charcoal-light space-y-1 list-disc pl-4">
                    {profileData.am_routine.map((s) => (
                      <li key={s.id}>
                        {s.product_name} <span className="text-charcoal-lighter">({s.category})</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-charcoal-lighter">No AM products logged</p>
                )}
              </div>

              <div className="pt-2 border-t border-border">
                <span className="text-xs font-semibold text-charcoal block mb-1">
                  🌙 PM Routine ({profileData.pm_routine.length} steps)
                </span>
                {profileData.pm_routine.length > 0 ? (
                  <ul className="text-xs text-charcoal-light space-y-1 list-disc pl-4">
                    {profileData.pm_routine.map((s) => (
                      <li key={s.id}>
                        {s.product_name} <span className="text-charcoal-lighter">({s.category})</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-charcoal-lighter">No PM products logged</p>
                )}
              </div>
            </div>
          </Card>
        </div>

        {/* Card 5: Device Memory vs. Supabase Cloud Sync */}
        <Card className="mt-8 p-6 border-sage/40 bg-gradient-to-br from-card via-card to-cream/40 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sage/20 text-xl">
                💾
              </div>
              <div>
                <h3 className="font-heading text-base font-bold text-charcoal">
                  Routine Memory & Storage Status
                </h3>
                <p className="text-xs text-charcoal-light">
                  How GlowLedger remembers your custom routine and when you might want Supabase
                </p>
              </div>
            </div>

            <Badge
              variant={supabaseActive ? 'good' : 'secondary'}
              className="self-start sm:self-auto text-xs py-1 px-3"
            >
              {supabaseActive
                ? '🟢 Supabase Cloud Sync Active'
                : '📱 Local Device Storage Active'}
            </Badge>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 text-xs leading-relaxed">
            <div className="rounded-xl border border-border bg-white p-4 space-y-2">
              <span className="font-bold text-charcoal flex items-center gap-1.5">
                <span>📱</span> On This Device (Current Mode)
              </span>
              <p className="text-charcoal-light">
                Your skincare routine, profile, name, and age are saved securely in your browser&apos;s local storage.
              </p>
              <ul className="list-disc pl-4 text-charcoal-lighter space-y-1">
                <li>Instantly accessible every time you open GlowLedger.</li>
                <li>Zero database setup required — works out of the box.</li>
                <li>100% private to this browser and device.</li>
              </ul>
            </div>

            <div className="rounded-xl border border-border bg-white p-4 space-y-2">
              <span className="font-bold text-charcoal flex items-center gap-1.5">
                <span>☁️</span> Supabase Cloud Sync (Optional)
              </span>
              <p className="text-charcoal-light">
                Want to access your routine from your phone, laptop, and tablet simultaneously? That&apos;s when Supabase comes in.
              </p>
              <ul className="list-disc pl-4 text-charcoal-lighter space-y-1">
                <li>Free tier offers 500MB storage and 50,000 monthly active users.</li>
                <li>Create a free account at <strong>supabase.com</strong>.</li>
                <li>Add your <code className="bg-cream px-1 rounded text-[10px]">NEXT_PUBLIC_SUPABASE_URL</code> &amp; anon key to <code className="bg-cream px-1 rounded text-[10px]">.env.local</code>.</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Privacy & Delete Data Section */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-charcoal-lighter text-center sm:text-left">
            <p>Your profile data is stored securely in Supabase with Row Level Security.</p>
            <p className="mt-0.5">We respect your privacy under all zero-cost AI terms.</p>
          </div>

          <div>
            {!showDeleteConfirm ? (
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="text-xs text-terracotta hover:underline font-medium"
              >
                Delete My Data & Reset Profile
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-xs text-terracotta-dark font-medium">Are you sure?</span>
                <button
                  type="button"
                  onClick={handleDeleteData}
                  className="rounded-lg bg-terracotta px-3 py-1 text-xs font-semibold text-white hover:bg-terracotta-dark"
                >
                  Yes, Delete All
                </button>
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="rounded-lg border border-border px-3 py-1 text-xs text-charcoal hover:bg-cream-dark"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
