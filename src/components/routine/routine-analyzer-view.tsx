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

  // Load profile state
  useEffect(() => {
    let stateToUse: OnboardingState = INITIAL_ONBOARDING_STATE;

    try {
      const saved = localStorage.getItem('glowledger_onboarding_draft_v1');
      if (saved) {
        stateToUse = { ...INITIAL_ONBOARDING_STATE, ...JSON.parse(saved) };
        setProfileState(stateToUse);
        runAnalysis(stateToUse);
      } else {
        // Fetch from API
        fetch('/api/profile')
          .then((res) => (res.ok ? res.json() : null))
          .then((data) => {
            if (data?.profile) {
              const loaded: OnboardingState = {
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
              runAnalysis(loaded);
            } else {
              // Sample starter routine for demo
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
            setProfileState(INITIAL_ONBOARDING_STATE);
            setLoading(false);
          });
      }
    } catch {
      setLoading(false);
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

  const totalStepsCount =
    (profileState?.am_routine.length || 0) + (profileState?.pm_routine.length || 0);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 sm:py-12 space-y-8 animate-fade-in">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold text-charcoal sm:text-4xl">
            Routine Analyzer
          </h1>
          <p className="mt-1 text-sm text-charcoal-light">
            AI-powered dermatological review of your active products, chemical conflicts, and layering order.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/onboarding"
            className="rounded-full border border-border bg-card px-4 py-2 text-xs font-semibold text-charcoal hover:bg-cream-dark transition-colors"
          >
            ✎ Edit Routine ({totalStepsCount} Products)
          </Link>
          <Button
            onClick={() => profileState && runAnalysis(profileState)}
            disabled={loading}
            className="rounded-full bg-sage hover:bg-sage-dark text-white px-5 py-2 text-xs font-semibold shadow-sm transition-all"
          >
            {loading ? 'Analyzing...' : '↻ Re-analyze'}
          </Button>
        </div>
      </div>

      {/* Rate limit warning if triggered */}
      {rateLimited && (
        <RateLimitBanner
          type="user"
          message="Daily AI analysis limit reached. Try again shortly or tomorrow!"
        />
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

          {/* Section 4: Scientific Layering Sequence */}
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
            href="/onboarding"
            className="mt-5 inline-block rounded-full bg-sage px-6 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-sage-dark"
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
