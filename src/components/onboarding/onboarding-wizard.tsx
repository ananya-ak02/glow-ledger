'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import {
  type OnboardingState,
  INITIAL_ONBOARDING_STATE,
} from '@/types/onboarding';
import { StepSkinType } from './step-skin-type';
import { StepConcerns } from './step-concerns';
import { StepRoutine } from './step-routine';
import { StepHistory } from './step-history';
import { StepContext } from './step-context';

const STEPS = [
  { id: 'skin_type', title: 'Skin Type', subtitle: 'Barrier & Texture' },
  { id: 'concerns', title: 'Concerns', subtitle: 'Targeted Goals' },
  { id: 'routine', title: 'Current Routine', subtitle: 'AM & PM Products' },
  { id: 'history', title: 'History & Triggers', subtitle: 'Safe Staples & Reactions' },
  { id: 'context', title: 'Safety & Context', subtitle: 'Climate & Allergies' },
];

const LOCAL_STORAGE_KEY = 'glowledger_onboarding_draft_v1';

export function OnboardingWizard() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [state, setState] = useState<OnboardingState>(INITIAL_ONBOARDING_STATE);
  const [saving, setSaving] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load draft from local storage if available, and support ?step=X in URL
  useEffect(() => {
    try {
      const saved =
        localStorage.getItem('glowledger_user_profile') ||
        localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        setState((prev) => ({ ...prev, ...JSON.parse(saved) }));
      }

      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        const stepParam = params.get('step');
        if (stepParam !== null) {
          const stepIdx = parseInt(stepParam, 10);
          if (!isNaN(stepIdx) && stepIdx >= 0 && stepIdx < STEPS.length) {
            setCurrentStep(stepIdx);
          }
        }
      }
    } catch {
      // Ignore parse errors
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Sync draft to local storage on changes
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
        localStorage.setItem('glowledger_user_profile', JSON.stringify(state));
      } catch {
        // Storage quota issues or private mode
      }
    }
  }, [state, isLoaded]);

  const progressPercent = Math.round(((currentStep + 1) / STEPS.length) * 100);

  function nextStep() {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      completeOnboarding();
    }
  }

  function prevStep() {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  function skipStep() {
    nextStep();
  }

  async function completeOnboarding() {
    setSaving(true);
    try {
      // Persist profile to API
      await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(state),
      }).catch(() => {
        // Fallback gracefully in dev/demo
      });

      // Save user profile permanently in localStorage so user's entered routine is NEVER erased
      localStorage.setItem('glowledger_user_profile', JSON.stringify(state));
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
      // Mark onboarding completed in session
      localStorage.setItem('glowledger_onboarding_completed', 'true');

      // Navigate to Routine Analyzer
      router.push('/routine');
    } catch {
      router.push('/routine');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 sm:py-12">
      {/* Wizard Header & Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-xs font-semibold text-charcoal mb-2">
          <span>
            Step {currentStep + 1} of {STEPS.length}:{' '}
            <strong className="text-terracotta">{STEPS[currentStep].title}</strong>
          </span>
          <span className="text-charcoal-lighter">{progressPercent}% Completed</span>
        </div>
        <Progress value={progressPercent} className="h-2" />

        {/* Step indicator breadcrumbs on larger screens */}
        <div className="hidden sm:flex justify-between mt-3 text-[11px] text-charcoal-lighter">
          {STEPS.map((s, idx) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setCurrentStep(idx)}
              className={`hover:text-charcoal transition-colors ${
                idx === currentStep
                  ? 'font-bold text-charcoal'
                  : idx < currentStep
                  ? 'text-sage font-medium'
                  : ''
              }`}
            >
              {idx + 1}. {s.title}
            </button>
          ))}
        </div>
      </div>

      {/* Active Step Content */}
      <div className="min-h-[460px] pb-10">
        {currentStep === 0 && (
          <StepSkinType
            selectedType={state.skin_type}
            notes={state.skin_type_notes}
            onChangeType={(type) => setState((prev) => ({ ...prev, skin_type: type }))}
            onChangeNotes={(notes) => setState((prev) => ({ ...prev, skin_type_notes: notes }))}
          />
        )}

        {currentStep === 1 && (
          <StepConcerns
            concerns={state.concerns}
            onChangeConcerns={(concerns) => setState((prev) => ({ ...prev, concerns }))}
          />
        )}

        {currentStep === 2 && (
          <StepRoutine
            amRoutine={state.am_routine}
            pmRoutine={state.pm_routine}
            onChangeAm={(am) => setState((prev) => ({ ...prev, am_routine: am }))}
            onChangePm={(pm) => setState((prev) => ({ ...prev, pm_routine: pm }))}
          />
        )}

        {currentStep === 3 && (
          <StepHistory
            workedProducts={state.worked_products}
            pastReactions={state.past_reactions}
            onChangeWorked={(worked) => setState((prev) => ({ ...prev, worked_products: worked }))}
            onChangeReactions={(reactions) => setState((prev) => ({ ...prev, past_reactions: reactions }))}
          />
        )}

        {currentStep === 4 && (
          <StepContext
            ageRange={state.age_range}
            climate={state.climate}
            budget={state.budget}
            isPregnant={state.is_pregnant}
            knownAllergies={state.known_allergies}
            fragrancePreference={state.fragrance_preference}
            aiConsent={state.ai_consent_acknowledged}
            onChangeAge={(age) => setState((prev) => ({ ...prev, age_range: age }))}
            onChangeClimate={(climate) => setState((prev) => ({ ...prev, climate }))}
            onChangeBudget={(budget) => setState((prev) => ({ ...prev, budget }))}
            onChangePregnant={(preg) => setState((prev) => ({ ...prev, is_pregnant: preg }))}
            onChangeAllergies={(allergies) => setState((prev) => ({ ...prev, known_allergies: allergies }))}
            onChangeFragrance={(frag) => setState((prev) => ({ ...prev, fragrance_preference: frag }))}
            onChangeConsent={(consent) => setState((prev) => ({ ...prev, ai_consent_acknowledged: consent }))}
          />
        )}
      </div>

      {/* Bottom Sticky Action Bar */}
      <div className="sticky bottom-0 z-30 -mx-4 -mb-8 sm:-mx-8 border-t border-border bg-background/95 backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <div>
          {currentStep > 0 ? (
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              className="rounded-full px-5 text-xs text-charcoal border-border hover:bg-cream-dark"
            >
              ← Back
            </Button>
          ) : (
            <span className="text-xs text-charcoal-lighter">You can edit these anytime later</span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={skipStep}
            className="text-xs font-medium text-charcoal-light hover:text-charcoal transition-colors px-3 py-2"
          >
            Skip this step
          </button>

          <Button
            type="button"
            onClick={nextStep}
            disabled={saving}
            className="rounded-full bg-sage hover:bg-sage-dark text-white px-7 py-2.5 text-xs font-semibold shadow-sm transition-all"
          >
            {saving
              ? 'Saving Profile...'
              : currentStep === STEPS.length - 1
              ? 'Complete Profile & View Routine →'
              : 'Continue →'}
          </Button>
        </div>
      </div>
    </div>
  );
}
