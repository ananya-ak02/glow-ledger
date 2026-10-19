'use client';

import { useState } from 'react';
import type { FragrancePreference } from '@/types/database';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { SAFETY_DISCLAIMERS } from '@/config/safety';

interface StepContextProps {
  ageRange: string;
  climate: string;
  budget: string;
  isPregnant: boolean;
  knownAllergies: string[];
  fragrancePreference: FragrancePreference;
  aiConsent: boolean;
  onChangeAge: (val: string) => void;
  onChangeClimate: (val: string) => void;
  onChangeBudget: (val: string) => void;
  onChangePregnant: (val: boolean) => void;
  onChangeAllergies: (allergies: string[]) => void;
  onChangeFragrance: (pref: FragrancePreference) => void;
  onChangeConsent: (consent: boolean) => void;
}

const AGE_RANGES = ['Under 18', '18-24', '25-34', '35-44', '45-54', '55+'];
const CLIMATES = [
  { id: 'temperate', label: 'Temperate / Moderate', desc: 'Mild seasons with balanced humidity' },
  { id: 'humid', label: 'Hot & Humid', desc: 'High moisture; skin tends to produce excess oil' },
  { id: 'arid', label: 'Dry / Arid', desc: 'Low humidity; causes transepidermal water loss' },
  { id: 'cold', label: 'Cold / Harsh Winters', desc: 'Wind exposure; severe barrier dehydration' },
];

const BUDGETS = [
  { id: 'budget', label: 'Drugstore / Accessible', desc: 'Affordable heroes (< $15)' },
  { id: 'balanced', label: 'Mid-Tier / Balanced', desc: 'Great clinical formulas ($15 - $35)' },
  { id: 'premium', label: 'High-End / Luxury', desc: 'Premium ingredients & textures ($35+)' },
];

const FRAGRANCE_PREFS: { id: FragrancePreference; label: string; desc: string }[] = [
  { id: 'loves', label: 'Loves Scent', desc: 'Enjoys subtle botanicals or luxurious aromas' },
  { id: 'neutral', label: 'Neutral', desc: 'Doesn&apos;t mind either way as long as it works' },
  { id: 'avoids', label: 'Prefers Fragrance-Free', desc: 'Prefers unfragranced formulas to minimize sensitizing risk' },
  { id: 'sensitive', label: 'Severe Fragrance Sensitivity', desc: 'Fragrance causes contact redness or eczema' },
];

export function StepContext({
  ageRange,
  climate,
  budget,
  isPregnant,
  knownAllergies,
  fragrancePreference,
  aiConsent,
  onChangeAge,
  onChangeClimate,
  onChangeBudget,
  onChangePregnant,
  onChangeAllergies,
  onChangeFragrance,
  onChangeConsent,
}: StepContextProps) {
  const [allergyInput, setAllergyInput] = useState('');

  function addAllergy() {
    if (!allergyInput.trim()) return;
    if (!knownAllergies.includes(allergyInput.trim())) {
      onChangeAllergies([...knownAllergies, allergyInput.trim()]);
    }
    setAllergyInput('');
  }

  function removeAllergy(item: string) {
    onChangeAllergies(knownAllergies.filter((a) => a !== item));
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center max-w-lg mx-auto">
        <h2 className="font-heading text-2xl font-bold text-charcoal sm:text-3xl">
          Context & Safety Preferences
        </h2>
        <p className="mt-2 text-sm text-charcoal-light">
          Your environment, life stage, and sensitivities guide how your skin responds to actives.
        </p>
      </div>

      <div className="max-w-2xl mx-auto space-y-6">
        {/* Pregnancy Mode Safety Toggle */}
        <div
          className={cn(
            'rounded-2xl border p-5 transition-all',
            isPregnant
              ? 'border-terracotta bg-blush-light shadow-sm'
              : 'border-border bg-card'
          )}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl">🤰</span>
              <div>
                <h3 className="font-heading text-base font-semibold text-charcoal">
                  Pregnancy & Nursing Safety Mode
                </h3>
                <p className="mt-1 text-xs text-charcoal-light leading-relaxed">
                  Automatically flags and excludes oral/topical retinoids, high-strength salicylic acid (&gt;2%), and hydroquinone from all verdicts.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onChangePregnant(!isPregnant)}
              className={cn(
                'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none',
                isPregnant ? 'bg-terracotta' : 'bg-cream-dark'
              )}
              role="switch"
              aria-checked={isPregnant}
            >
              <span
                className={cn(
                  'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                  isPregnant ? 'translate-x-5' : 'translate-x-0'
                )}
              />
            </button>
          </div>

          {isPregnant && (
            <div className="mt-3 pt-3 border-t border-terracotta/20 text-[11px] text-terracotta-dark leading-relaxed">
              <strong>Medical Disclaimer:</strong> {SAFETY_DISCLAIMERS.pregnancy}
            </div>
          )}
        </div>

        {/* Climate & Age Bracket */}
        <Card className="p-6 border-border bg-card space-y-5">
          {/* Age selection */}
          <div>
            <label className="block text-xs font-semibold text-charcoal mb-2">
              Age Range
            </label>
            <div className="flex flex-wrap gap-2">
              {AGE_RANGES.map((age) => (
                <button
                  key={age}
                  type="button"
                  onClick={() => onChangeAge(age)}
                  className={cn(
                    'rounded-xl px-4 py-2 text-xs font-medium transition-all',
                    ageRange === age
                      ? 'bg-sage text-white shadow-sm font-semibold'
                      : 'bg-cream text-charcoal-light hover:bg-cream-dark'
                  )}
                >
                  {age}
                </button>
              ))}
            </div>
          </div>

          {/* Climate */}
          <div>
            <label className="block text-xs font-semibold text-charcoal mb-2">
              Your Climate / Weather
            </label>
            <div className="grid gap-2 sm:grid-cols-2">
              {CLIMATES.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => onChangeClimate(c.id)}
                  className={cn(
                    'p-3 rounded-xl border text-left transition-all',
                    climate === c.id
                      ? 'border-sage bg-sage/10 font-semibold'
                      : 'border-border bg-cream/40 hover:bg-cream'
                  )}
                >
                  <div className="text-xs font-semibold text-charcoal">{c.label}</div>
                  <div className="text-[11px] text-charcoal-lighter mt-0.5">{c.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Budget */}
          <div>
            <label className="block text-xs font-semibold text-charcoal mb-2">
              Budget Preference
            </label>
            <div className="grid gap-2 sm:grid-cols-3">
              {BUDGETS.map((b) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => onChangeBudget(b.id)}
                  className={cn(
                    'p-3 rounded-xl border text-left transition-all',
                    budget === b.id
                      ? 'border-sage bg-sage/10 font-semibold'
                      : 'border-border bg-cream/40 hover:bg-cream'
                  )}
                >
                  <div className="text-xs font-semibold text-charcoal">{b.label}</div>
                  <div className="text-[11px] text-charcoal-lighter mt-0.5">{b.desc}</div>
                </button>
              ))}
            </div>
          </div>
        </Card>

        {/* Fragrance Preference & Known Allergies */}
        <Card className="p-6 border-border bg-card space-y-5">
          <div>
            <label className="block text-xs font-semibold text-charcoal mb-2">
              Fragrance in Skincare
            </label>
            <div className="grid gap-2 sm:grid-cols-2">
              {FRAGRANCE_PREFS.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => onChangeFragrance(f.id)}
                  className={cn(
                    'p-3 rounded-xl border text-left transition-all',
                    fragrancePreference === f.id
                      ? 'border-sage bg-sage/10 font-semibold'
                      : 'border-border bg-cream/40 hover:bg-cream'
                  )}
                >
                  <div className="text-xs font-semibold text-charcoal">{f.label}</div>
                  <div className="text-[11px] text-charcoal-lighter mt-0.5">{f.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Known Allergies */}
          <div>
            <label className="block text-xs font-semibold text-charcoal mb-1.5">
              Known Allergies (Optional)
            </label>
            <div className="flex gap-2">
              <Input
                placeholder="e.g. Aspirin, Nut oils, Essential oils, Lanolin..."
                value={allergyInput}
                onChange={(e) => setAllergyInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addAllergy();
                  }
                }}
              />
              <Button
                type="button"
                onClick={addAllergy}
                className="bg-charcoal hover:bg-charcoal-light text-white text-xs shrink-0"
              >
                Add Allergy
              </Button>
            </div>

            {knownAllergies.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {knownAllergies.map((all) => (
                  <span
                    key={all}
                    className="inline-flex items-center gap-1 rounded-full bg-blush px-3 py-1 text-xs text-charcoal font-medium"
                  >
                    <span>🛡️ {all}</span>
                    <button
                      type="button"
                      onClick={() => removeAllergy(all)}
                      className="text-charcoal-light hover:text-terracotta ml-1"
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </Card>

        {/* AI & Data Privacy Consent */}
        <div className="rounded-2xl border border-border bg-cream p-5 text-xs text-charcoal-light leading-relaxed">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={aiConsent}
              onChange={(e) => onChangeConsent(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-border text-sage focus:ring-sage"
            />
            <div>
              <span className="font-semibold text-charcoal block mb-0.5">
                Privacy & Free-Tier AI Model Notice
              </span>
              <span>
                {SAFETY_DISCLAIMERS.consent} You may delete your data anytime from your profile settings.
              </span>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
}
