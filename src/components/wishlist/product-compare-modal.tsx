'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  type WishlistItemStored,
  compareCachedProducts,
} from '@/lib/wishlist/storage';

interface ProductCompareModalProps {
  productA: WishlistItemStored;
  productB: WishlistItemStored;
  onClose: () => void;
}

export function ProductCompareModal({
  productA,
  productB,
  onClose,
}: ProductCompareModalProps) {
  const comparison = compareCachedProducts(productA, productB);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/40 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl bg-background border border-border shadow-2xl p-6 sm:p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-sage-dark block">
              Side-by-Side Evaluation (0 AI Token Cost)
            </span>
            <h2 className="font-heading text-2xl font-bold text-charcoal">
              Product Comparison
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-charcoal-lighter hover:text-charcoal hover:bg-cream-dark transition-colors"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* Side-by-side grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Product A */}
          <Card className="p-6 border-border bg-card shadow-sm space-y-4">
            <div>
              <span className="text-xs text-charcoal-lighter uppercase tracking-wider block font-medium">
                {comparison.productA.brand}
              </span>
              <h3 className="font-heading text-xl font-bold text-charcoal">
                {comparison.productA.name}
              </h3>
              <div className="mt-2">
                <Badge
                  variant={
                    comparison.productA.verdict === 'good_fit'
                      ? 'good'
                      : comparison.productA.verdict === 'avoid'
                      ? 'avoid'
                      : 'caution'
                  }
                  className="capitalize text-xs font-semibold"
                >
                  {comparison.productA.verdict.replace(/_/g, ' ')}
                </Badge>
              </div>
            </div>

            <p className="text-xs text-charcoal-light leading-relaxed bg-cream/40 p-3 rounded-xl border border-border">
              {comparison.productA.summary}
            </p>

            {/* Key Ingredients */}
            <div>
              <span className="text-xs font-bold text-charcoal block mb-1.5">
                Key Actives:
              </span>
              <div className="flex flex-wrap gap-1">
                {comparison.productA.keyIngredients.map((k, i) => (
                  <span
                    key={i}
                    className="rounded-md bg-sage-light/60 px-2 py-0.5 text-[11px] text-charcoal font-medium"
                  >
                    {k.name}
                  </span>
                ))}
              </div>
            </div>

            {/* Pros */}
            <div>
              <span className="text-xs font-bold text-sage-dark block mb-1">
                Strengths:
              </span>
              <ul className="text-xs text-charcoal-light space-y-1 list-disc pl-4">
                {comparison.productA.pros.map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
              </ul>
            </div>

            {/* Placement */}
            <div className="pt-2 border-t border-border text-xs">
              <span className="text-charcoal-lighter block">Suggested Placement:</span>
              <span className="font-semibold text-charcoal">
                {comparison.productA.placement}
              </span>
            </div>
          </Card>

          {/* Product B */}
          <Card className="p-6 border-border bg-card shadow-sm space-y-4">
            <div>
              <span className="text-xs text-charcoal-lighter uppercase tracking-wider block font-medium">
                {comparison.productB.brand}
              </span>
              <h3 className="font-heading text-xl font-bold text-charcoal">
                {comparison.productB.name}
              </h3>
              <div className="mt-2">
                <Badge
                  variant={
                    comparison.productB.verdict === 'good_fit'
                      ? 'good'
                      : comparison.productB.verdict === 'avoid'
                      ? 'avoid'
                      : 'caution'
                  }
                  className="capitalize text-xs font-semibold"
                >
                  {comparison.productB.verdict.replace(/_/g, ' ')}
                </Badge>
              </div>
            </div>

            <p className="text-xs text-charcoal-light leading-relaxed bg-cream/40 p-3 rounded-xl border border-border">
              {comparison.productB.summary}
            </p>

            {/* Key Ingredients */}
            <div>
              <span className="text-xs font-bold text-charcoal block mb-1.5">
                Key Actives:
              </span>
              <div className="flex flex-wrap gap-1">
                {comparison.productB.keyIngredients.map((k, i) => (
                  <span
                    key={i}
                    className="rounded-md bg-sage-light/60 px-2 py-0.5 text-[11px] text-charcoal font-medium"
                  >
                    {k.name}
                  </span>
                ))}
              </div>
            </div>

            {/* Pros */}
            <div>
              <span className="text-xs font-bold text-sage-dark block mb-1">
                Strengths:
              </span>
              <ul className="text-xs text-charcoal-light space-y-1 list-disc pl-4">
                {comparison.productB.pros.map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
              </ul>
            </div>

            {/* Placement */}
            <div className="pt-2 border-t border-border text-xs">
              <span className="text-charcoal-lighter block">Suggested Placement:</span>
              <span className="font-semibold text-charcoal">
                {comparison.productB.placement}
              </span>
            </div>
          </Card>
        </div>

        {/* Modal Footer */}
        <div className="pt-4 border-t border-border flex justify-end">
          <Button
            type="button"
            onClick={onClose}
            className="rounded-full bg-charcoal hover:bg-charcoal-light text-white text-xs px-6"
          >
            Close Comparison
          </Button>
        </div>
      </div>
    </div>
  );
}
