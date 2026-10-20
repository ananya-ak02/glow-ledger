'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export interface LayeringStep {
  step: number;
  product: string;
  category: string;
  time_of_day?: 'am' | 'pm';
  wait_time?: string;
  note?: string;
}

interface LayeringTimelineProps {
  layeringOrder: LayeringStep[];
}

export function LayeringTimeline({ layeringOrder }: LayeringTimelineProps) {
  const [activeTab, setActiveTab] = useState<'both' | 'am' | 'pm'>('both');

  if (layeringOrder.length === 0) {
    return (
      <Card className="p-6 border-border bg-card text-center">
        <p className="text-xs text-charcoal-light">
          Add products to your routine to see the scientific layering sequence.
        </p>
      </Card>
    );
  }

  // Separate into AM and PM steps
  const amSteps: LayeringStep[] = [];
  const pmSteps: LayeringStep[] = [];

  // If time_of_day is provided on items, use it
  const hasTimeOfDay = layeringOrder.some((s) => s.time_of_day !== undefined);

  if (hasTimeOfDay) {
    layeringOrder.forEach((step) => {
      if (step.time_of_day === 'am') amSteps.push(step);
      else if (step.time_of_day === 'pm') pmSteps.push(step);
      else {
        // Fallback heuristics
        const lower = (step.category + ' ' + step.product).toLowerCase();
        if (lower.includes('sunscreen') || lower.includes('spf')) {
          amSteps.push(step);
        } else {
          pmSteps.push(step);
        }
      }
    });
  } else {
    // Legacy fallback: split at sunscreen or halfway
    let foundSunscreen = false;
    layeringOrder.forEach((step) => {
      const lower = (step.category + ' ' + step.product).toLowerCase();
      if (!foundSunscreen) {
        amSteps.push({ ...step, time_of_day: 'am' });
        if (lower.includes('sunscreen') || lower.includes('spf')) {
          foundSunscreen = true;
        }
      } else {
        pmSteps.push({ ...step, time_of_day: 'pm' });
      }
    });
    // If no sunscreen found, split evenly or put in PM
    if (pmSteps.length === 0 && amSteps.length > 3) {
      const half = Math.ceil(amSteps.length / 2);
      const moved = amSteps.splice(half);
      moved.forEach((m) => pmSteps.push({ ...m, time_of_day: 'pm' }));
    }
  }

  const renderTimelineSection = (
    title: string,
    subtitle: string,
    icon: string,
    steps: LayeringStep[],
    timeOfDay: 'am' | 'pm'
  ) => {
    const isAm = timeOfDay === 'am';
    const badgeColor = isAm ? 'bg-sage text-white' : 'bg-terracotta text-white';
    const borderColor = isAm ? 'border-sage/30' : 'border-terracotta/30';
    const bgHeader = isAm ? 'bg-sage/10' : 'bg-blush/30';

    return (
      <div className={cn('rounded-2xl border bg-card p-5 sm:p-6 shadow-card', borderColor)}>
        {/* Section Header */}
        <div className={cn('flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3.5 rounded-xl mb-6', bgHeader)}>
          <div className="flex items-center gap-3">
            <span className="text-2xl">{icon}</span>
            <div>
              <h4 className="font-heading text-base font-bold text-charcoal">
                {title}
              </h4>
              <p className="text-xs text-charcoal-light">
                {subtitle}
              </p>
            </div>
          </div>
          <Badge variant="outline" className="text-[11px] self-start sm:self-auto bg-white/80 border-border">
            {steps.length} {steps.length === 1 ? 'Step' : 'Steps'} · Thinnest → Thickest
          </Badge>
        </div>

        {steps.length === 0 ? (
          <div className="py-8 text-center text-xs text-charcoal-light italic">
            No {isAm ? 'morning' : 'evening'} steps logged.
          </div>
        ) : (
          <div className="relative pl-7 space-y-4 before:absolute before:left-3 before:top-3 before:bottom-3 before:w-0.5 before:bg-border">
            {steps.map((step, idx) => (
              <div key={idx} className="relative flex items-start justify-between gap-4">
                {/* Step number dot */}
                <div
                  className={cn(
                    'absolute -left-7 flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold shadow-xs ring-4 ring-card',
                    badgeColor
                  )}
                >
                  {idx + 1}
                </div>

                <div className="flex-1 rounded-xl border border-border bg-cream/40 p-3.5 sm:p-4 hover:border-sage/40 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                    <span className="text-xs sm:text-sm font-bold text-charcoal">
                      {step.product}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-medium text-charcoal-light bg-white px-2.5 py-0.5 rounded-full border border-border capitalize">
                        {step.category}
                      </span>
                      <span className="text-[10px] font-semibold text-charcoal-lighter">
                        Step {idx + 1} of {steps.length}
                      </span>
                    </div>
                  </div>

                  {step.note && (
                    <p className="text-xs text-charcoal-light mt-1.5 leading-relaxed bg-white/70 p-2 rounded-lg border border-border/60">
                      💡 {step.note}
                    </p>
                  )}

                  {step.wait_time && (
                    <div className="mt-1 text-[11px] text-terracotta font-medium">
                      ⏱ Wait time: {step.wait_time}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <Card className="p-6 border-border bg-card space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-2xl">📋</span>
          <div>
            <h3 className="font-heading text-xl font-bold text-charcoal">
              Scientific Layering Order
            </h3>
            <p className="text-xs text-charcoal-light">
              Formulated from thinnest consistency to thickest occlusive to maximize molecular absorption
            </p>
          </div>
        </div>

        {/* View switcher */}
        <div className="inline-flex rounded-full bg-cream-dark p-1 border border-border self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab('both')}
            className={cn(
              'px-3.5 py-1 text-xs font-semibold rounded-full transition-all',
              activeTab === 'both'
                ? 'bg-card text-charcoal shadow-xs'
                : 'text-charcoal-light hover:text-charcoal'
            )}
          >
            All Routines
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('am')}
            className={cn(
              'px-3.5 py-1 text-xs font-semibold rounded-full transition-all',
              activeTab === 'am'
                ? 'bg-card text-charcoal shadow-xs'
                : 'text-charcoal-light hover:text-charcoal'
            )}
          >
            ☀️ Morning
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('pm')}
            className={cn(
              'px-3.5 py-1 text-xs font-semibold rounded-full transition-all',
              activeTab === 'pm'
                ? 'bg-card text-charcoal shadow-xs'
                : 'text-charcoal-light hover:text-charcoal'
            )}
          >
            🌙 Evening
          </button>
        </div>
      </div>

      {/* Explanatory callout */}
      <div className="rounded-xl border border-sage/40 bg-[var(--color-verdict-good-bg)] p-3.5 text-xs text-charcoal leading-relaxed flex items-start gap-2.5">
        <span className="text-base leading-none">🧪</span>
        <div>
          <strong className="font-semibold text-charcoal">Why Morning & Evening are sequenced separately:</strong>
          <span className="text-charcoal-light ml-1">
            Daytime focuses on antioxidant protection and broad-spectrum UV shielding (sunscreen is always the final layer). Evening focuses on thorough cleansing, cell turnover treatments, and deep barrier repair while you sleep.
          </span>
        </div>
      </div>

      {/* Timelines */}
      <div className="space-y-6">
        {(activeTab === 'both' || activeTab === 'am') &&
          renderTimelineSection(
            'Morning Routine (AM)',
            'Cleanse → Treat & Hydrate → Shield (SPF)',
            '☀️',
            amSteps,
            'am'
          )}

        {(activeTab === 'both' || activeTab === 'pm') &&
          renderTimelineSection(
            'Evening Routine (PM)',
            'Dissolve SPF & Sebum → Resurface / Target → Barrier Lock',
            '🌙',
            pmSteps,
            'pm'
          )}
      </div>
    </Card>
  );
}
