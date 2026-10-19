'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { buildOptimizedRoutine, type BuiltRoutinePlan } from '@/lib/routine/routine-builder';
import { getLocalWishlist } from '@/lib/wishlist/storage';
import { INITIAL_ONBOARDING_STATE, type OnboardingState } from '@/types/onboarding';

export function RoutineBuilderView() {
  const [profileState, setProfileState] = useState<OnboardingState>(INITIAL_ONBOARDING_STATE);
  const [plan, setPlan] = useState<BuiltRoutinePlan | null>(null);
  const [shortlist, setShortlist] = useState<{ name: string; category: string }[]>([]);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('glowledger_onboarding_draft_v1');
      const wishlist = getLocalWishlist();

      const initialShortlist = wishlist.map((w) => ({
        name: w.productName,
        category: w.category || 'Treatment',
      }));
      setShortlist(initialShortlist);

      if (saved) {
        const parsed: OnboardingState = JSON.parse(saved);
        setProfileState(parsed);
        const built = buildOptimizedRoutine(parsed, initialShortlist);
        setPlan(built);
      } else {
        const built = buildOptimizedRoutine(INITIAL_ONBOARDING_STATE, initialShortlist);
        setPlan(built);
      }
    } catch {
      // Fallback
    }
  }, []);

  function handleSaveRoutine() {
    if (!plan) return;
    try {
      const updatedProfile: OnboardingState = {
        ...profileState,
        am_routine: plan.amRoutine,
        pm_routine: plan.pmRoutine,
      };
      localStorage.setItem('glowledger_onboarding_draft_v1', JSON.stringify(updatedProfile));
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch {
      // Storage error
    }
  }

  if (!plan) return null;

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 sm:py-12 space-y-8 animate-fade-in">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-sage-dark mb-1 block">
            Routine Architecture
          </span>
          <h1 className="font-heading text-3xl font-bold text-charcoal sm:text-4xl">
            Routine Builder & Intro Timeline
          </h1>
          <p className="mt-1 text-sm text-charcoal-light max-w-xl">
            Integrate new products with a safe, sequential one-new-active-at-a-time introduction schedule to protect your moisture barrier.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={handleSaveRoutine}
            className="rounded-full bg-sage hover:bg-sage-dark text-white px-6 py-2.5 text-xs font-semibold shadow-sm transition-all"
          >
            {savedSuccess ? '✓ Saved to Routine!' : 'Save Routine Plan'}
          </Button>
        </div>
      </div>

      {/* Rationale Notice */}
      <div className="rounded-2xl border border-sage/40 bg-[var(--color-verdict-good-bg)] p-4 text-xs text-charcoal flex items-start gap-3">
        <span className="text-xl">🌿</span>
        <div>
          <strong className="font-semibold block mb-0.5">Clinical Formulation Logic:</strong>
          {plan.scientificRationale}
        </div>
      </div>

      {/* AM vs PM Built Routine Columns */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Morning Column */}
        <Card className="p-6 border-border bg-card shadow-card space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div className="flex items-center gap-2">
              <span className="text-xl">☀️</span>
              <h3 className="font-heading text-lg font-bold text-charcoal">
                Optimized Morning Routine
              </h3>
            </div>
            <Badge variant="good" className="text-xs">
              {plan.amRoutine.length} Steps
            </Badge>
          </div>

          <div className="space-y-3">
            {plan.amRoutine.map((step, idx) => (
              <div
                key={step.id || idx}
                className="flex items-center justify-between rounded-xl bg-cream/40 p-3.5 border border-border"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-sage text-white text-xs font-bold">
                    {idx + 1}
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-charcoal">
                      {step.product_name}
                    </h4>
                    <span className="text-[11px] text-charcoal-lighter capitalize">
                      {step.category} • {step.frequency}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Evening Column */}
        <Card className="p-6 border-border bg-card shadow-card space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div className="flex items-center gap-2">
              <span className="text-xl">🌙</span>
              <h3 className="font-heading text-lg font-bold text-charcoal">
                Optimized Evening Routine
              </h3>
            </div>
            <Badge variant="good" className="text-xs">
              {plan.pmRoutine.length} Steps
            </Badge>
          </div>

          <div className="space-y-3">
            {plan.pmRoutine.map((step, idx) => (
              <div
                key={step.id || idx}
                className="flex items-center justify-between rounded-xl bg-cream/40 p-3.5 border border-border"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-charcoal text-white text-xs font-bold">
                    {idx + 1}
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-charcoal">
                      {step.product_name}
                    </h4>
                    <span className="text-[11px] text-charcoal-lighter capitalize">
                      {step.category} • {step.frequency}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* ─── Hero Feature: One-New-Active-at-a-Time Intro Timeline ───── */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">⏳</span>
          <div>
            <h2 className="font-heading text-2xl font-bold text-charcoal">
              Phased Introduction Schedule (One-Active-at-a-Time)
            </h2>
            <p className="text-xs text-charcoal-light">
              Introducing multiple actives simultaneously makes it impossible to identify which product triggered a breakout or damaged your barrier. Follow this staggered timeline.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {plan.introSchedule.map((phase) => (
            <Card
              key={phase.phaseNumber}
              className="p-6 border-border bg-card shadow-card space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border">
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-sage-light text-charcoal font-bold text-xs">
                    P{phase.phaseNumber}
                  </span>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-sage-dark block">
                      {phase.timeframe}
                    </span>
                    <h3 className="font-heading text-base font-bold text-charcoal">
                      Focus: {phase.focusProduct}
                    </h3>
                  </div>
                </div>

                <Badge variant="outline" className="text-xs">
                  {phase.frequency}
                </Badge>
              </div>

              {/* Instructions */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-charcoal block">
                  Action Steps for This Phase:
                </span>
                <ul className="text-xs text-charcoal-light space-y-1 list-disc pl-5">
                  {phase.instructions.map((inst, idx) => (
                    <li key={idx}>{inst}</li>
                  ))}
                </ul>
              </div>

              {/* Watchouts */}
              {phase.watchouts.length > 0 && (
                <div className="rounded-xl bg-amber-50/80 p-3 border border-amber-200/60 text-xs text-amber-900 leading-relaxed">
                  <strong>Safety Rule:</strong> {phase.watchouts.join(' ')}
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
