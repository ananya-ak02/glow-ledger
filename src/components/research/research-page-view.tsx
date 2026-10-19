'use client';

import { useState, useEffect } from 'react';
import { ProductSearchInput } from './product-search-input';
import { PipelineProgress } from './pipeline-progress';
import { VerdictCard } from './verdict-card';
import { RateLimitBanner } from '@/components/shared/rate-limit-banner';
import { INITIAL_ONBOARDING_STATE, type OnboardingState } from '@/types/onboarding';
import type { ResearchPipelineResult } from '@/lib/research/pipeline';

export function ResearchPageView() {
  const [profileState, setProfileState] = useState<OnboardingState>(INITIAL_ONBOARDING_STATE);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStage, setCurrentStage] = useState('');
  const [result, setResult] = useState<ResearchPipelineResult | null>(null);
  const [rateLimited, setRateLimited] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('glowledger_onboarding_draft_v1');
      if (saved) {
        setProfileState(JSON.parse(saved));
      } else {
        fetch('/api/profile')
          .then((res) => (res.ok ? res.json() : null))
          .then((data) => {
            if (data?.profile) {
              setProfileState({
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
              });
            }
          })
          .catch(() => {});
      }
    } catch {
      // Fallback
    }
  }, []);

  async function handleSearch(data: {
    productName: string;
    brand?: string;
    userPastedIngredients?: string;
    userPastedReviews?: string;
  }) {
    setIsLoading(true);
    setResult(null);
    setErrorMsg(null);
    setRateLimited(false);
    setCurrentStage('Checking shared database cache...');

    try {
      const res = await fetch('/api/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName: data.productName,
          brand: data.brand,
          userPastedIngredients: data.userPastedIngredients,
          userPastedReviews: data.userPastedReviews,
          userProfile: profileState,
        }),
      });

      if (res.status === 429) {
        setRateLimited(true);
        setIsLoading(false);
        return;
      }

      if (!res.ok) {
        throw new Error('Research pipeline encountered an error');
      }

      const json = await res.json();
      if (json.success && json.data) {
        setResult(json.data);
      }
    } catch {
      setErrorMsg('Could not complete product research. Please verify your connection and try again.');
    } finally {
      setIsLoading(false);
      setCurrentStage('');
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 sm:py-12 space-y-8 animate-fade-in">
      {/* Title banner */}
      <div className="text-center max-w-2xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-wider text-sage-dark mb-1 block">
          Hero Product Intelligence
        </span>
        <h1 className="font-heading text-3xl font-bold text-charcoal sm:text-4xl">
          Is this product right for you?
        </h1>
        <p className="mt-2 text-sm text-charcoal-light">
          Search by product name, paste a link, or paste raw ingredients. We cross-reference clinical INCI data, Reddit reviews, and your personal skin profile.
        </p>
      </div>

      {/* Quota rate limit warning */}
      {rateLimited && (
        <RateLimitBanner
          type="user"
          message="Daily research limit reached. Cached reports remain instantly accessible!"
        />
      )}

      {/* Search Input Box */}
      <ProductSearchInput onSearch={handleSearch} isLoading={isLoading} />

      {/* Live Pipeline Progress Indicator */}
      {isLoading && <PipelineProgress currentStage={currentStage} />}

      {/* Error alert */}
      {errorMsg && (
        <div className="rounded-xl border border-terracotta bg-blush-light p-4 text-xs text-terracotta-dark">
          {errorMsg}
        </div>
      )}

      {/* Verdict Result Card */}
      {result && (
        <VerdictCard
          synthesis={result.synthesis}
          personalization={result.personalization}
          isCached={result.isCached}
          sourceLinks={result.sourceLinks}
          conflicts={result.conflicts}
          flags={result.flags}
          ingredientsList={result.ingredientsList}
        />
      )}
    </div>
  );
}
