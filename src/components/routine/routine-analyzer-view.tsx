'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { RoutineAnalysis } from '@/types/ai';
import type { OnboardingState } from '@/types/onboarding';
import type { VerdictFlag } from '@/types/database';
import { INITIAL_ONBOARDING_STATE } from '@/types/onboarding';
import { Skeleton, RoutineStepSkeleton } from '@/components/shared/loading-skeleton';
import { RateLimitBanner } from '@/components/shared/rate-limit-banner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RoutineOverviewCard } from './routine-overview-card';
import { ConflictAlertCard } from './conflict-alert-card';
import { IngredientRecommendationsCard } from './ingredient-recommendations-card';
import { LayeringTimeline } from './layering-timeline';

export function RoutineAnalyzerView() {
  const [profileState, setProfileState] = useState<OnboardingState | null>(null);
  const [analysis, setAnalysis] = useState<RoutineAnalysis | null>(null);
  const [flags, setFlags] = useState<VerdictFlag[]>([]);
  const [metadata, setMetadata] = useState<{
    modelUsed: string;
    provider: string;
    isMock: boolean;
  } | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [rateLimited, setRateLimited] = useState(false);
  const [isDemoData, setIsDemoData] = useState(false);

  // Load profile state
  useEffect(() => {
    let stateToUse: OnboardingState | null = null;

    try {
      // 1. Check permanent user profile or active onboarding draft
      const saved =
        localStorage.getItem('glowledger_user_profile') ||
        localStorage.getItem('glowledger_onboarding_draft_v1');

      if (saved) {
        const parsed = JSON.parse(saved);
        const savedName = localStorage.getItem('glowledger_user_name') || '';
        const hasUserData =
          (parsed.am_routine && parsed.am_routine.length > 0) ||
          (parsed.pm_routine && parsed.pm_routine.length > 0) ||
          Boolean(parsed.skin_type);

        if (hasUserData) {
          stateToUse = {
            ...INITIAL_ONBOARDING_STATE,
            ...parsed,
            name: parsed.name || savedName || '',
          };
        }
      }
    } catch {
      // Ignore parse errors
    }

    if (stateToUse) {
      setProfileState(stateToUse);
      setIsDemoData(false);
      runAnalysis(stateToUse);
    } else {
      // 2. Fetch from Supabase API
      fetch('/api/profile')
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data?.profile) {
            const loaded: OnboardingState = {
              name: (data.profile as any)?.name || (typeof window !== 'undefined' ? localStorage.getItem('glowledger_user_name') || '' : ''),
              skin_type: data.profile.skin_type,
              skin_type_notes: data.profile.skin_type_notes || '',
              concerns: data.concerns || [],
              am_routine:
                data.routines?.find((r: { routine_type: string }) => r.routine_type === 'am')
                  ?.routine_steps || [],
              pm_routine:
                data.routines?.find((r: { routine_type: string }) => r.routine_type === 'pm')
                  ?.routine_steps || [],
              worked_products: [],
              past_reactions: data.reactions || [],
              age_range: data.profile.age_range || '25-34',
              climate: data.profile.climate || 'temperate',
              budget: data.profile.budget || 'balanced',
              is_pregnant: Boolean(data.profile.is_pregnant),
              known_allergies: data.profile.known_allergies || [],
              fragrance_preference: data.profile.fragrance_preference || 'neutral',
              ai_consent_acknowledged: true,
            };
            setProfileState(loaded);
            setIsDemoData(false);
            runAnalysis(loaded);
          } else {
            // 3. Fallback to starter demo preview routine
            setIsDemoData(true);
            const sample: OnboardingState = {
              ...INITIAL_ONBOARDING_STATE,
              skin_type: 'combination',
              concerns: [
                { type: 'acne', severity: 'moderate', affected_areas: ['Cheeks'] },
                { type: 'dark_spots', severity: 'mild', affected_areas: ['Forehead'] },
              ],
              am_routine: [
                { id: '1', product_name: 'CeraVe Hydrating Cleanser', category: 'Cleanser', frequency: 'Daily' },
                { id: '2', product_name: 'The Ordinary Niacinamide 10% + Zinc', category: 'Serum', frequency: 'Daily' },
                { id: '3', product_name: 'La Roche-Posay Anthelios SPF 50', category: 'Sunscreen', frequency: 'Daily' },
              ],
              pm_routine: [
                { id: '4', product_name: 'CeraVe Hydrating Cleanser', category: 'Cleanser', frequency: 'Daily' },
                { id: '5', product_name: 'Paula Choice 2% BHA Liquid Exfoliant', category: 'Exfoliant', frequency: '2-3x per week' },
                { id: '6', product_name: 'Cerave PM Moisturizing Lotion', category: 'Moisturizer', frequency: 'Daily' },
              ],
            };
            setProfileState(sample);
            runAnalysis(sample);
          }
        })
        .catch(() => {
          setIsDemoData(true);
          setProfileState(INITIAL_ONBOARDING_STATE);
          setLoading(false);
        });
    }
  }, []);

  async function runAnalysis(state: OnboardingState) {
    setLoading(true);
    setErrorMsg(null);
    setRateLimited(false);

    try {
      const res = await fetch('/api/routine/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ state }),
      });

      if (res.status === 429) {
        setRateLimited(true);
        setLoading(false);
        return;
      }

      if (!res.ok) {
        throw new Error('Analysis service error');
      }

      const json = await res.json();
      if (json.success && json.analysis) {
        setAnalysis(json.analysis);
        setMetadata(json.metadata);
        setFlags(json.flags || []);
      }
    } catch {
      setErrorMsg('Could not complete routine analysis. Please try again shortly.');
    } finally {
      setLoading(false);
    }
  }

  const amCount = profileState?.am_routine.length || 0;
  const pmCount = profileState?.pm_routine.length || 0;
  const totalStepsCount = amCount + pmCount;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 sm:py-12 space-y-8 animate-fade-in">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold text-charcoal sm:text-4xl">
            {profileState?.name ? `${profileState.name}'s Routine Analyzer` : 'Routine Analyzer'}
          </h1>
          <p className="mt-1 text-sm text-charcoal-light">
            AI-powered dermatological review of {profileState?.name ? `${profileState.name}'s` : 'your'} active products, chemical conflicts, and layering order.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/onboarding?step=2"
            className="rounded-full border border-border bg-card px-4 py-2 text-xs font-semibold text-charcoal hover:bg-cream-dark transition-colors"
          >
            ✎ Edit Routine ({totalStepsCount} Products)
          </Link>
          <Button
            onClick={() => profileState && runAnalysis(profileState)}
            disabled={loading}
            className="rounded-full bg-sage hover:bg-sage-dark text-white px-5 py-2 text-xs font-semibold shadow-xs transition-all"
          >
            {loading ? 'Analyzing...' : '↻ Re-analyze'}
          </Button>
        </div>
      </div>

      {/* Demo Routine Callout Banner if showing sample data */}
      {isDemoData && (
        <div className="rounded-2xl border border-terracotta/40 bg-blush-light/60 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl mt-0.5">ℹ️</span>
            <div>
              <h3 className="font-heading text-sm font-bold text-charcoal">
                Showing Sample Starter Routine (Demo Preview)
              </h3>
              <p className="text-xs text-charcoal-light mt-0.5 leading-relaxed">
                You are currently viewing an illustrative demo routine. To analyze your own personal skincare products and layering, click <strong>Enter Your Routine</strong>.
              </p>
            </div>
          </div>
          <Link
            href="/onboarding?step=2"
            className="rounded-full bg-sage hover:bg-sage-dark text-white px-5 py-2 text-xs font-semibold shadow-xs whitespace-nowrap self-stretch sm:self-auto text-center transition-all"
          >
            Enter Your Routine →
          </Link>
        </div>
      )}

      {/* Rate limit warning if triggered */}
      {rateLimited && (
        <RateLimitBanner
          type="user"
          message="Daily AI analysis limit reached. Try again shortly or tomorrow!"
        />
      )}

      {/* Current Active Routine Summary */}
      {profileState && totalStepsCount > 0 && (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-card space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-4">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">✨</span>
              <div>
                <h2 className="font-heading text-lg font-bold text-charcoal">
                  {profileState?.name ? `${profileState.name}'s Current Skincare Routine` : 'Your Current Skincare Routine'}
                </h2>
                <p className="text-xs text-charcoal-light">
                  {profileState.name && (
                    <strong className="text-terracotta">{profileState.name} · </strong>
                  )}
                  {profileState.age_range && (
                    <span className="font-medium text-charcoal">{profileState.age_range} · </span>
                  )}
                  {profileState.skin_type ? (
                    <span className="capitalize font-medium text-charcoal">
                      {profileState.skin_type} skin
                    </span>
                  ) : (
                    'Personalized profile'
                  )}{' '}
                  · {amCount} Morning (AM), {pmCount} Evening (PM) products
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={isDemoData ? 'outline' : 'good'} className="text-xs">
                {isDemoData ? 'Sample Routine' : 'Your Custom Routine'}
              </Badge>
              <Link
                href="/onboarding?step=2"
                className="rounded-full border border-border bg-white px-3.5 py-1.5 text-xs font-semibold text-charcoal hover:bg-cream-dark transition-colors"
              >
                ✎ Edit Products
              </Link>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 pt-1">
            {/* Morning Column */}
            <div className="rounded-xl border border-sage/30 bg-cream/30 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-charcoal flex items-center gap-1.5">
                  ☀️ Morning (AM)
                </span>
                <span className="text-[11px] text-charcoal-lighter font-medium">
                  {amCount} products
                </span>
              </div>
              {amCount > 0 ? (
                <div className="space-y-2">
                  {profileState.am_routine.map((p, i) => (
                    <div
                      key={p.id || i}
                      className="rounded-lg border border-border bg-white p-2.5 flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="font-semibold text-charcoal">{p.product_name}</div>
                        <div className="text-[10px] text-charcoal-lighter capitalize">
                          {p.category}
                        </div>
                      </div>
                      {p.frequency && (
                        <span className="text-[10px] text-charcoal-light bg-cream px-2 py-0.5 rounded-full border border-border">
                          {p.frequency}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-charcoal-light italic py-2">
                  No morning products entered (e.g. Cleanser, Vitamin C, SPF).
                </p>
              )}
            </div>

            {/* Evening Column */}
            <div className="rounded-xl border border-terracotta/30 bg-cream/30 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-charcoal flex items-center gap-1.5">
                  🌙 Evening (PM)
                </span>
                <span className="text-[11px] text-charcoal-lighter font-medium">
                  {pmCount} products
                </span>
              </div>
              {pmCount > 0 ? (
                <div className="space-y-2">
                  {profileState.pm_routine.map((p, i) => (
                    <div
                      key={p.id || i}
                      className="rounded-lg border border-border bg-white p-2.5 flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="font-semibold text-charcoal">{p.product_name}</div>
                        <div className="text-[10px] text-charcoal-lighter capitalize">
                          {p.category}
                        </div>
                      </div>
                      {p.frequency && (
                        <span className="text-[10px] text-charcoal-light bg-cream px-2 py-0.5 rounded-full border border-border">
                          {p.frequency}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-charcoal-light italic py-2">
                  No evening products entered (e.g. Cleanser, Retinoid, Moisturizer).
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Loading Skeletons */}
      {loading ? (
        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-16 w-full" />
            <div className="space-y-2 pt-4">
              <RoutineStepSkeleton />
              <RoutineStepSkeleton />
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6 space-y-3">
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-24 w-full" />
          </div>
        </div>
      ) : analysis ? (
        <div className="space-y-8">
          {/* Section 1: Overview Assessment */}
          <RoutineOverviewCard
            assessment={analysis.overall_assessment}
            correctSteps={analysis.correct}
            metadata={metadata}
          />

          {/* Section 2: Conflicts & Issues */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">⚠️</span>
              <h2 className="font-heading text-xl font-bold text-charcoal">
                Conflict & Compatibility Checks
              </h2>
            </div>
            <ConflictAlertCard
              conflicts={analysis.conflicts}
              issues={analysis.issues}
              flags={flags}
            />
          </div>

          {/* Section 3: Ingredient Recommendations (Ingredient Primacy) */}
          <IngredientRecommendationsCard
            missing={analysis.missing}
            redundant={analysis.redundant}
          />

          {/* Section 4: Scientific Layering Sequence (Split AM & PM) */}
          <LayeringTimeline layeringOrder={analysis.layering_order} />
        </div>
      ) : (
        <div className="text-center py-16 rounded-2xl border border-dashed border-border bg-card/60 p-8">
          <span className="text-4xl">🧴</span>
          <h3 className="font-heading text-lg font-bold text-charcoal mt-3">
            No Active Products Found
          </h3>
          <p className="text-xs text-charcoal-light mt-1 max-w-sm mx-auto">
            Please add your morning and evening skincare products to analyze chemical compatibility and layering.
          </p>
          <Link
            href="/onboarding?step=2"
            className="mt-5 inline-block rounded-full bg-sage px-6 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-sage-dark transition-all"
          >
            Set Up Your Routine Now →
          </Link>
        </div>
      )}

      {errorMsg && (
        <div className="rounded-xl border border-terracotta bg-blush-light p-4 text-xs text-terracotta-dark">
          {errorMsg}
        </div>
      )}
    </div>
  );
}
