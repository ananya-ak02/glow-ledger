'use client';

import type { ConcernType, Severity } from '@/types/database';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export interface SkinConcernInput {
  type: ConcernType;
  severity: Severity;
  affected_areas: string[];
  notes?: string;
}

interface StepConcernsProps {
  concerns: SkinConcernInput[];
  onChangeConcerns: (concerns: SkinConcernInput[]) => void;
}

const AVAILABLE_CONCERNS: {
  id: ConcernType;
  label: string;
  icon: string;
  description: string;
}[] = [
  { id: 'acne', label: 'Acne & Breakouts', icon: '🔴', description: 'Whiteheads, blackheads, papules, or hormonal cysts' },
  { id: 'dark_spots', label: 'Dark Spots (Sun/Age)', icon: '☀️', description: 'Hyperpigmentation from sun exposure or aging' },
  { id: 'post_acne_marks', label: 'Post-Acne Marks', icon: '🟣', description: 'Red marks (PIE) or brown marks (PIH) left after blemishes' },
  { id: 'pigmentation', label: 'Uneven Pigmentation', icon: '🎨', description: 'Melasma, patchy tone, or discoloration' },
  { id: 'texture', label: 'Uneven Texture', icon: '🏔️', description: 'Roughness, tiny bumps, or lack of smoothness' },
  { id: 'redness', label: 'Redness & Flushing', icon: '🌹', description: 'Persistent redness, rosacea signs, or irritation flush' },
  { id: 'dehydration', label: 'Dehydration', icon: '💧', description: 'Skin lacks water; looks dull and tight underneath surface oil' },
  { id: 'dullness', label: 'Dullness', icon: '✨', description: 'Tired-looking skin lacking natural radiance and glow' },
  { id: 'pores', label: 'Enlarged / Clogged Pores', icon: '🔍', description: 'Pores that look stretched or contain stubborn filaments' },
  { id: 'sensitivity', label: 'Compromised Barrier', icon: '🛡️', description: 'Stinging sensation when applying basic creams, burning, peeling' },
];

const FACIAL_AREAS = [
  'Forehead',
  'Cheeks',
  'Nose',
  'Chin & Jawline',
  'Neck',
  'Chest / Back',
];

export function StepConcerns({ concerns, onChangeConcerns }: StepConcernsProps) {
  function isSelected(id: ConcernType): boolean {
    return concerns.some((c) => c.type === id);
  }

  function getConcern(id: ConcernType): SkinConcernInput | undefined {
    return concerns.find((c) => c.type === id);
  }

  function toggleConcern(id: ConcernType) {
    if (isSelected(id)) {
      onChangeConcerns(concerns.filter((c) => c.type !== id));
    } else {
      onChangeConcerns([
        ...concerns,
        {
          type: id,
          severity: 'moderate',
          affected_areas: ['Cheeks'],
        },
      ]);
    }
  }

  function updateSeverity(id: ConcernType, severity: Severity) {
    onChangeConcerns(
      concerns.map((c) => (c.type === id ? { ...c, severity } : c))
    );
  }

  function toggleArea(id: ConcernType, area: string) {
    onChangeConcerns(
      concerns.map((c) => {
        if (c.type !== id) return c;
        const exists = c.affected_areas.includes(area);
        const updatedAreas = exists
          ? c.affected_areas.filter((a) => a !== area)
          : [...c.affected_areas, area];
        return { ...c, affected_areas: updatedAreas };
      })
    );
  }

  // Safety trigger: Severe acne check
  const hasSevereAcne = concerns.some(
    (c) => c.type === 'acne' && c.severity === 'severe'
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center max-w-lg mx-auto">
        <h2 className="font-heading text-2xl font-bold text-charcoal sm:text-3xl">
          What are your skin concerns?
        </h2>
        <p className="mt-2 text-sm text-charcoal-light">
          Select what you&apos;d like to target. You can adjust severity and affected zones.
        </p>
      </div>

      {/* Dermatologist Escalation Alert if Severe Acne is indicated */}
      {hasSevereAcne && (
        <div className="max-w-2xl mx-auto rounded-2xl border border-blush-dark bg-blush-light p-4 shadow-sm animate-fade-in">
          <div className="flex items-start gap-3">
            <span className="text-2xl">👩‍⚕️</span>
            <div>
              <h4 className="font-heading text-sm font-bold text-charcoal">
                Dermatologist Recommendation
              </h4>
              <p className="mt-1 text-xs leading-relaxed text-charcoal-light">
                For severe or cystic acne, over-the-counter skincare actives can sometimes exacerbate inflammation or cause scarring. We strongly recommend scheduling an evaluation with a board-certified dermatologist for prescription therapies (such as topical retinoids, oral medications, or barrier-sparing treatments). GlowLedger will prioritize soothing, non-comedogenic recommendations.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Grid of Concerns */}
      <div className="grid gap-4 sm:grid-cols-2">
        {AVAILABLE_CONCERNS.map((item) => {
          const selected = isSelected(item.id);
          const current = getConcern(item.id);

          return (
            <Card
              key={item.id}
              className={cn(
                'p-5 transition-all text-left flex flex-col justify-between',
                selected
                  ? 'border-2 border-sage bg-card shadow-md ring-2 ring-sage/10'
                  : 'border-border bg-card/60 hover:bg-card hover:border-sage-light'
              )}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">{item.icon}</span>
                    <h3 className="font-heading text-base font-semibold text-charcoal">
                      {item.label}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleConcern(item.id)}
                    className={cn(
                      'rounded-full px-3 py-1 text-xs font-medium transition-colors',
                      selected
                        ? 'bg-sage text-white'
                        : 'bg-cream text-charcoal-light hover:bg-cream-dark'
                    )}
                  >
                    {selected ? 'Selected ✓' : '+ Add'}
                  </button>
                </div>
                <p className="text-xs text-charcoal-light">{item.description}</p>
              </div>

              {/* Sub-selectors if selected */}
              {selected && current && (
                <div className="mt-4 pt-3 border-t border-border space-y-3">
                  {/* Severity selector */}
                  <div>
                    <span className="block text-[11px] font-medium text-charcoal-light mb-1.5">
                      Severity:
                    </span>
                    <div className="flex gap-2">
                      {(['mild', 'moderate', 'severe'] as Severity[]).map((sev) => (
                        <button
                          key={sev}
                          type="button"
                          onClick={() => updateSeverity(item.id, sev)}
                          className={cn(
                            'rounded-lg px-2.5 py-1 text-xs capitalize transition-colors',
                            current.severity === sev
                              ? 'bg-charcoal text-white font-medium'
                              : 'bg-cream text-charcoal-light hover:bg-cream-dark'
                          )}
                        >
                          {sev}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Affected zones */}
                  <div>
                    <span className="block text-[11px] font-medium text-charcoal-light mb-1.5">
                      Affected areas:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {FACIAL_AREAS.map((area) => {
                        const inArea = current.affected_areas.includes(area);
                        return (
                          <button
                            key={area}
                            type="button"
                            onClick={() => toggleArea(item.id, area)}
                            className={cn(
                              'rounded-md px-2 py-0.5 text-[11px] transition-colors',
                              inArea
                                ? 'bg-sage-light text-charcoal font-semibold border border-sage'
                                : 'bg-cream text-charcoal-lighter hover:text-charcoal'
                            )}
                          >
                            {area}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
