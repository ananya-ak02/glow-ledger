'use client';

import { useState } from 'react';
import type { RoutineStepInput } from '@/types/onboarding';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface StepRoutineProps {
  amRoutine: RoutineStepInput[];
  pmRoutine: RoutineStepInput[];
  onChangeAm: (steps: RoutineStepInput[]) => void;
  onChangePm: (steps: RoutineStepInput[]) => void;
}

const CATEGORIES = [
  'Cleanser',
  'Toner / Mist',
  'Serum / Ampoule',
  'Exfoliant / Acid',
  'Retinoid / Treatment',
  'Eye Cream',
  'Moisturizer',
  'Sunscreen',
  'Face Oil',
];

const FREQUENCIES = [
  'Daily',
  '2-3x per week',
  '1x per week',
  'As needed',
];

export function StepRoutine({
  amRoutine,
  pmRoutine,
  onChangeAm,
  onChangePm,
}: StepRoutineProps) {
  const [activeTab, setActiveTab] = useState<'am' | 'pm'>('am');

  // New step draft state
  const [productName, setProductName] = useState('');
  const [category, setCategory] = useState('Cleanser');
  const [frequency, setFrequency] = useState('Daily');

  function addStep() {
    if (!productName.trim()) return;

    const newStep: RoutineStepInput = {
      id: Math.random().toString(36).substring(2, 9),
      product_name: productName.trim(),
      category,
      frequency,
    };

    if (activeTab === 'am') {
      onChangeAm([...amRoutine, newStep]);
    } else {
      onChangePm([...pmRoutine, newStep]);
    }

    setProductName('');
  }

  function removeStep(id: string, tab: 'am' | 'pm') {
    if (tab === 'am') {
      onChangeAm(amRoutine.filter((s) => s.id !== id));
    } else {
      onChangePm(pmRoutine.filter((s) => s.id !== id));
    }
  }

  const currentSteps = activeTab === 'am' ? amRoutine : pmRoutine;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center max-w-lg mx-auto">
        <h2 className="font-heading text-2xl font-bold text-charcoal sm:text-3xl">
          What is your current routine?
        </h2>
        <p className="mt-2 text-sm text-charcoal-light">
          Add the products you currently apply in the morning and night. If you only wash with water, that&apos;s totally fine!
        </p>
      </div>

      {/* AM / PM Tab Switcher */}
      <div className="flex justify-center">
        <div className="inline-flex rounded-full bg-cream-dark p-1 border border-border">
          <button
            type="button"
            onClick={() => setActiveTab('am')}
            className={cn(
              'flex items-center gap-2 rounded-full px-5 py-2 text-xs font-semibold transition-all',
              activeTab === 'am'
                ? 'bg-card text-charcoal shadow-sm'
                : 'text-charcoal-light hover:text-charcoal'
            )}
          >
            <span>☀️</span>
            <span>Morning Routine ({amRoutine.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('pm')}
            className={cn(
              'flex items-center gap-2 rounded-full px-5 py-2 text-xs font-semibold transition-all',
              activeTab === 'pm'
                ? 'bg-card text-charcoal shadow-sm'
                : 'text-charcoal-light hover:text-charcoal'
            )}
          >
            <span>🌙</span>
            <span>Evening Routine ({pmRoutine.length})</span>
          </button>
        </div>
      </div>

      {/* Main card: Step input & list */}
      <div className="max-w-2xl mx-auto space-y-4">
        {/* Quick step addition form */}
        <Card className="p-5 border-border bg-card">
          <div className="text-xs font-medium text-charcoal mb-3 flex items-center justify-between">
            <span>Add product to {activeTab === 'am' ? 'Morning' : 'Evening'} routine</span>
            <span className="text-charcoal-lighter font-normal">Layer {currentSteps.length + 1}</span>
          </div>

          <div className="grid gap-3 sm:grid-cols-12 items-end">
            <div className="sm:col-span-5">
              <label className="block text-[11px] text-charcoal-light mb-1">Product name / brand</label>
              <Input
                placeholder="e.g. CeraVe Hydrating Cleanser"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addStep();
                  }
                }}
              />
            </div>

            <div className="sm:col-span-3">
              <label className="block text-[11px] text-charcoal-light mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="flex h-11 w-full rounded-xl border border-input bg-card px-3 py-2 text-xs text-charcoal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[11px] text-charcoal-light mb-1">Frequency</label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                className="flex h-11 w-full rounded-xl border border-input bg-card px-2 py-2 text-xs text-charcoal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage"
              >
                {FREQUENCIES.map((freq) => (
                  <option key={freq} value={freq}>
                    {freq}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <Button
                type="button"
                onClick={addStep}
                className="w-full h-11 rounded-xl bg-sage hover:bg-sage-dark text-white font-medium text-xs"
              >
                + Add
              </Button>
            </div>
          </div>
        </Card>

        {/* Existing steps list */}
        <div className="space-y-2">
          {currentSteps.length === 0 ? (
            <div className="text-center py-10 rounded-2xl border border-dashed border-border p-6 bg-card/40">
              <span className="text-3xl">🧴</span>
              <p className="mt-2 text-xs text-charcoal-light">
                No products added to your {activeTab === 'am' ? 'morning' : 'evening'} routine yet.
              </p>
              <p className="text-[11px] text-charcoal-lighter mt-1">
                You can add individual products above or skip if you haven&apos;t started a routine.
              </p>
            </div>
          ) : (
            currentSteps.map((step, idx) => (
              <div
                key={step.id}
                className="flex items-center justify-between rounded-xl border border-border bg-card p-3.5 shadow-sm transition-all"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-cream-dark text-xs font-bold text-charcoal">
                    {idx + 1}
                  </span>
                  <div>
                    <h4 className="text-sm font-semibold text-charcoal">
                      {step.product_name}
                    </h4>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Badge variant="outline" className="text-[10px] py-0">
                        {step.category}
                      </Badge>
                      <span className="text-[11px] text-charcoal-lighter">
                        • {step.frequency}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => removeStep(step.id, activeTab)}
                  className="text-xs text-charcoal-lighter hover:text-terracotta transition-colors p-1"
                  aria-label="Remove step"
                >
                  ✕
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
