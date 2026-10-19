'use client';

import { useState } from 'react';
import type { ReactionType, Severity } from '@/types/database';
import type { PastReactionInput } from '@/types/onboarding';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface StepHistoryProps {
  workedProducts: string[];
  pastReactions: PastReactionInput[];
  onChangeWorked: (products: string[]) => void;
  onChangeReactions: (reactions: PastReactionInput[]) => void;
}

const REACTION_TYPES: { id: ReactionType; label: string; tip: string }[] = [
  { id: 'irritation', label: 'Irritation / Redness', tip: 'Flushing, stinging upon contact, or dry patches' },
  { id: 'burning', label: 'Burning / Stinging', tip: 'Acute heat or burning sensation shortly after application' },
  { id: 'breakout', label: 'Clogged Breakouts', tip: 'New pimples/comedones in areas you do not typically break out' },
  { id: 'purging', label: 'Purging (Active-induced)', tip: 'Temporary flare of micro-comedones from retinoids/acids' },
  { id: 'allergy', label: 'Allergic Dermatitis', tip: 'Swelling, itchiness, hives, or eyelid swelling' },
  { id: 'dryness', label: 'Severe Peeling/Dryness', tip: 'Excessive barrier stripping and dehydration' },
];

export function StepHistory({
  workedProducts,
  pastReactions,
  onChangeWorked,
  onChangeReactions,
}: StepHistoryProps) {
  // Input for holy grail products
  const [workedInput, setWorkedInput] = useState('');

  // Input for negative reactions
  const [badProduct, setBadProduct] = useState('');
  const [reactionType, setReactionType] = useState<ReactionType>('irritation');
  const [suspectedIngredient, setSuspectedIngredient] = useState('');

  function addWorkedProduct() {
    if (!workedInput.trim()) return;
    if (!workedProducts.includes(workedInput.trim())) {
      onChangeWorked([...workedProducts, workedInput.trim()]);
    }
    setWorkedInput('');
  }

  function removeWorkedProduct(product: string) {
    onChangeWorked(workedProducts.filter((p) => p !== product));
  }

  function addReaction() {
    if (!badProduct.trim()) return;

    const newReaction: PastReactionInput = {
      id: Math.random().toString(36).substring(2, 9),
      product_name: badProduct.trim(),
      reaction_type: reactionType,
      severity: 'moderate',
      suspected_ingredients: suspectedIngredient.trim()
        ? [suspectedIngredient.trim()]
        : [],
    };

    onChangeReactions([...pastReactions, newReaction]);
    setBadProduct('');
    setSuspectedIngredient('');
  }

  function removeReaction(id: string) {
    onChangeReactions(pastReactions.filter((r) => r.id !== id));
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center max-w-lg mx-auto">
        <h2 className="font-heading text-2xl font-bold text-charcoal sm:text-3xl">
          Your Skincare History
        </h2>
        <p className="mt-2 text-sm text-charcoal-light">
          Help us identify your safe staples and track ingredients that triggered past irritation or breakouts.
        </p>
      </div>

      <div className="max-w-2xl mx-auto space-y-8">
        {/* Section 1: What Worked */}
        <Card className="p-6 border-border bg-card">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">🌟</span>
            <h3 className="font-heading text-lg font-semibold text-charcoal">
              Products that worked great for you
            </h3>
          </div>
          <p className="text-xs text-charcoal-light mb-4">
            Products your skin loved (we use these to identify compatible formulations and humectants).
          </p>

          <div className="flex gap-2">
            <Input
              placeholder="e.g. Cosrx Snail Mucin 96 Essence"
              value={workedInput}
              onChange={(e) => setWorkedInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addWorkedProduct();
                }
              }}
            />
            <Button
              type="button"
              onClick={addWorkedProduct}
              className="bg-sage hover:bg-sage-dark text-white shrink-0 px-4"
            >
              Add Staple
            </Button>
          </div>

          {workedProducts.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {workedProducts.map((prod) => (
                <span
                  key={prod}
                  className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-verdict-good-bg)] border border-sage/40 px-3 py-1 text-xs text-charcoal"
                >
                  <span>✓ {prod}</span>
                  <button
                    type="button"
                    onClick={() => removeWorkedProduct(prod)}
                    className="text-charcoal-lighter hover:text-terracotta ml-1"
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>
          )}
        </Card>

        {/* Section 2: What Didn't Work / Reactions */}
        <Card className="p-6 border-border bg-card">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">⚠️</span>
            <h3 className="font-heading text-lg font-semibold text-charcoal">
              Products that caused a negative reaction
            </h3>
          </div>
          <p className="text-xs text-charcoal-light mb-4">
            We will analyze future products against these ingredients and warn you before you purchase.
          </p>

          <div className="space-y-3 rounded-xl bg-cream p-4 border border-border/80">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-[11px] font-medium text-charcoal-light mb-1">
                  Product name
                </label>
                <Input
                  placeholder="e.g. The Ordinary Niacinamide 10%"
                  value={badProduct}
                  onChange={(e) => setBadProduct(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-charcoal-light mb-1">
                  What happened?
                </label>
                <select
                  value={reactionType}
                  onChange={(e) => setReactionType(e.target.value as ReactionType)}
                  className="flex h-11 w-full rounded-xl border border-input bg-card px-3 py-2 text-xs text-charcoal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage"
                >
                  {REACTION_TYPES.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-charcoal-light mb-1">
                Suspected trigger ingredient (if known)
              </label>
              <Input
                placeholder="e.g. Niacinamide, Fragrance, or Zinc"
                value={suspectedIngredient}
                onChange={(e) => setSuspectedIngredient(e.target.value)}
              />
            </div>

            <Button
              type="button"
              onClick={addReaction}
              className="w-full bg-terracotta hover:bg-terracotta-dark text-white text-xs h-10 font-medium"
            >
              Log Reaction
            </Button>
          </div>

          {/* Logged reactions list */}
          {pastReactions.length > 0 && (
            <div className="mt-4 space-y-2">
              {pastReactions.map((rec) => (
                <div
                  key={rec.id}
                  className="flex items-center justify-between rounded-xl border border-border bg-[var(--color-verdict-avoid-bg)] p-3"
                >
                  <div>
                    <h5 className="text-xs font-semibold text-charcoal">
                      {rec.product_name}
                    </h5>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Badge variant="avoid" className="text-[10px] py-0 capitalize">
                        {rec.reaction_type}
                      </Badge>
                      {rec.suspected_ingredients.length > 0 && (
                        <span className="text-[11px] text-terracotta-dark">
                          Suspected: {rec.suspected_ingredients.join(', ')}
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeReaction(rec.id)}
                    className="text-xs text-charcoal-lighter hover:text-terracotta p-1"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
