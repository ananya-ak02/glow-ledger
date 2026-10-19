'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { UserReaction, ReactionType, Severity } from '@/types/database';
import { detectRepeatedTriggers, type SuspectedTrigger } from '@/lib/reactions/trigger-detector';

const REACTION_OPTIONS: { id: ReactionType; label: string; desc: string }[] = [
  { id: 'irritation', label: 'Contact Irritation / Redness', desc: 'Flushing, stinging, or rough red patches' },
  { id: 'burning', label: 'Burning / Acute Heat', desc: 'Stinging sensation immediately or shortly after application' },
  { id: 'breakout', label: 'Clogged Breakouts', desc: 'New blemishes in areas you do not usually experience acne' },
  { id: 'purging', label: 'Purging (Active-Induced)', desc: 'Accelerated micro-comedones clearing from retinoids or exfoliating acids' },
  { id: 'allergy', label: 'Allergic Dermatitis', desc: 'Itchiness, swelling around eyelids, or hives' },
  { id: 'dryness', label: 'Barrier Stripping / Peeling', desc: 'Excessive moisture loss, cracking, or tightness' },
];

export function ReactionLogView() {
  const [reactions, setReactions] = useState<UserReaction[]>([]);
  const [detectedTriggers, setDetectedTriggers] = useState<SuspectedTrigger[]>([]);

  // New reaction form states
  const [productName, setProductName] = useState('');
  const [reactionType, setReactionType] = useState<ReactionType>('irritation');
  const [severity, setSeverity] = useState<Severity>('moderate');
  const [suspectedIngredient, setSuspectedIngredient] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    // Load from local storage or mock initial state
    try {
      const saved = localStorage.getItem('glowledger_reactions_v1');
      if (saved) {
        const parsed: UserReaction[] = JSON.parse(saved);
        setReactions(parsed);
        setDetectedTriggers(detectRepeatedTriggers(parsed));
      } else {
        // Initial sample reactions demonstrating auto-detection
        const demoReactions: UserReaction[] = [
          {
            id: 'r1',
            profile_id: 'demo',
            product_name: 'High Potency Niacinamide Serum',
            product_id: null,
            reaction_type: 'burning',
            severity: 'moderate',
            suspected_ingredients: ['Niacinamide'],
            notes: 'Felt severe flushing and heat on cheeks',
            occurred_at: '2026-02-15',
            created_at: new Date().toISOString(),
          },
          {
            id: 'r2',
            profile_id: 'demo',
            product_name: 'Brightening Niacinamide Gel Cream',
            product_id: null,
            reaction_type: 'irritation',
            severity: 'mild',
            suspected_ingredients: ['Niacinamide', 'Fragrance'],
            notes: 'Tiny red stinging bumps after 2 days',
            occurred_at: '2026-03-10',
            created_at: new Date().toISOString(),
          },
        ];
        setReactions(demoReactions);
        setDetectedTriggers(detectRepeatedTriggers(demoReactions));
      }
    } catch {
      // Fallback
    }
  }, []);

  function handleAddReaction(e: React.FormEvent) {
    e.preventDefault();
    if (!productName.trim()) return;

    const newReaction: UserReaction = {
      id: Math.random().toString(36).substring(2, 9),
      profile_id: 'demo',
      product_name: productName.trim(),
      product_id: null,
      reaction_type: reactionType,
      severity,
      suspected_ingredients: suspectedIngredient.trim()
        ? suspectedIngredient.split(/[,;]/).map((s) => s.trim())
        : [],
      notes: notes.trim() || null,
      occurred_at: new Date().toISOString().split('T')[0],
      created_at: new Date().toISOString(),
    };

    const updated = [newReaction, ...reactions];
    setReactions(updated);
    setDetectedTriggers(detectRepeatedTriggers(updated));
    localStorage.setItem('glowledger_reactions_v1', JSON.stringify(updated));

    // Reset inputs
    setProductName('');
    setSuspectedIngredient('');
    setNotes('');
  }

  function handleRemoveReaction(id: string) {
    const updated = reactions.filter((r) => r.id !== id);
    setReactions(updated);
    setDetectedTriggers(detectRepeatedTriggers(updated));
    localStorage.setItem('glowledger_reactions_v1', JSON.stringify(updated));
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 sm:py-12 space-y-8 animate-fade-in">
      {/* Title */}
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-sage-dark mb-1 block">
          Trigger Intelligence
        </span>
        <h1 className="font-heading text-3xl font-bold text-charcoal sm:text-4xl">
          Reaction & Trigger Log
        </h1>
        <p className="mt-1 text-sm text-charcoal-light">
          Track skin intolerances. GlowLedger auto-detects repeated trigger ingredients to protect you in all future research verdicts.
        </p>
      </div>

      {/* Auto-Detected Trigger Insights */}
      {detectedTriggers.length > 0 && (
        <Card className="p-6 border-terracotta bg-[var(--color-verdict-avoid-bg)] shadow-sm space-y-4">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">🚨</span>
            <div>
              <h3 className="font-heading text-lg font-bold text-charcoal">
                Auto-Detected Suspected Triggers ({detectedTriggers.length})
              </h3>
              <p className="text-xs text-charcoal-light">
                Recurring ingredients co-occurring across your logged negative reactions
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {detectedTriggers.map((trig, idx) => (
              <div
                key={idx}
                className="rounded-xl bg-white/90 p-4 border border-terracotta/30 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-terracotta-dark">
                    ✦ {trig.ingredient}
                  </span>
                  <Badge variant="avoid" className="text-[10px] uppercase font-bold">
                    {trig.confidence} Confidence
                  </Badge>
                </div>

                <p className="text-xs text-charcoal-light leading-relaxed">
                  {trig.recommendation}
                </p>

                <div className="text-[11px] text-charcoal-lighter pt-1 border-t border-border">
                  Flagged in: {trig.products.join(', ')}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Educational Banner: Purging vs Breakouts */}
      <div className="rounded-2xl border border-border bg-card p-5 text-xs text-charcoal-light leading-relaxed space-y-2">
        <h4 className="font-heading text-xs font-bold text-charcoal uppercase tracking-wider">
          🔬 Dermatological Note: Purging vs. Reaction Breakout
        </h4>
        <p>
          <strong>Purging:</strong> Occurs ONLY with active ingredients that accelerate cellular turnover (retinoids, glycolic/lactic acid, salicylic acid). Blemishes appear in areas you normally break out and resolve within 4–6 weeks.
        </p>
        <p>
          <strong>Reaction / Barrier Damage:</strong> Occurs with hydrators, oils, or fragrance, or causes redness, stinging, or blemishes in unusual zones. This requires immediate product cessation.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-12 items-start">
        {/* Form: Log New Reaction */}
        <div className="lg:col-span-5">
          <Card className="p-6 border-border bg-card shadow-card space-y-4">
            <h3 className="font-heading text-lg font-bold text-charcoal">
              Log a Negative Reaction
            </h3>
            <p className="text-xs text-charcoal-light">
              Record what happened to update your trigger detection profile.
            </p>

            <form onSubmit={handleAddReaction} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-charcoal mb-1">
                  Product Name
                </label>
                <Input
                  placeholder="e.g. 10% Vitamin C Glow Serum"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal mb-1">
                  Reaction Type
                </label>
                <select
                  value={reactionType}
                  onChange={(e) => setReactionType(e.target.value as ReactionType)}
                  className="flex h-11 w-full rounded-xl border border-input bg-card px-3 py-2 text-xs text-charcoal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage"
                >
                  {REACTION_OPTIONS.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal mb-1">
                  Severity
                </label>
                <div className="flex gap-2">
                  {(['mild', 'moderate', 'severe'] as Severity[]).map((sev) => (
                    <button
                      key={sev}
                      type="button"
                      onClick={() => setSeverity(sev)}
                      className={`flex-1 rounded-xl py-2 text-xs capitalize font-medium transition-all ${
                        severity === sev
                          ? 'bg-charcoal text-white'
                          : 'bg-cream text-charcoal-light hover:bg-cream-dark'
                      }`}
                    >
                      {sev}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal mb-1">
                  Suspected Trigger Ingredient (Optional)
                </label>
                <Input
                  placeholder="e.g. Niacinamide, Essential Oils, Alcohol Denat"
                  value={suspectedIngredient}
                  onChange={(e) => setSuspectedIngredient(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal mb-1">
                  Notes & Symptoms
                </label>
                <Input
                  placeholder="e.g. Red stinging bumps within 2 hours of application"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              <Button
                type="submit"
                className="w-full h-11 rounded-xl bg-terracotta hover:bg-terracotta-dark text-white font-semibold text-xs shadow-sm"
              >
                + Log Reaction
              </Button>
            </form>
          </Card>
        </div>

        {/* Existing Reaction Log History */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-lg font-bold text-charcoal">
              Logged Reaction History ({reactions.length})
            </h3>
            <span className="text-xs text-charcoal-lighter">Stored locally & Supabase</span>
          </div>

          {reactions.length === 0 ? (
            <div className="text-center py-12 rounded-2xl border border-dashed border-border bg-card/60 p-6">
              <span className="text-3xl">🌿</span>
              <p className="mt-2 text-xs text-charcoal-light">
                No negative reactions logged yet.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {reactions.map((rec) => (
                <div
                  key={rec.id}
                  className="rounded-2xl border border-border bg-card p-4 shadow-sm flex items-start justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-charcoal">
                        {rec.product_name}
                      </h4>
                      <Badge
                        variant={rec.severity === 'severe' ? 'avoid' : 'caution'}
                        className="text-[10px] capitalize"
                      >
                        {rec.severity} {rec.reaction_type}
                      </Badge>
                    </div>

                    {rec.suspected_ingredients && rec.suspected_ingredients.length > 0 && (
                      <p className="text-xs text-terracotta-dark font-medium">
                        Suspected: {rec.suspected_ingredients.join(', ')}
                      </p>
                    )}

                    {rec.notes && (
                      <p className="text-xs text-charcoal-light leading-relaxed">
                        &quot;{rec.notes}&quot;
                      </p>
                    )}

                    <div className="text-[11px] text-charcoal-lighter pt-1">
                      Logged on: {rec.occurred_at}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveReaction(rec.id)}
                    className="text-xs text-charcoal-lighter hover:text-terracotta transition-colors p-1"
                    aria-label="Remove reaction"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
