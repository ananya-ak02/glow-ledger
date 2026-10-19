'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  getLocalWishlist,
  removeFromWishlist,
  addToWishlist,
  type WishlistItemStored,
} from '@/lib/wishlist/storage';
import { ProductCompareModal } from './product-compare-modal';
import { EVAL_PRODUCTS } from '@/lib/research/eval-products';

export function WishlistView() {
  const [items, setItems] = useState<WishlistItemStored[]>([]);
  const [selectedForCompare, setSelectedForCompare] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const list = getLocalWishlist();
    if (list.length === 0) {
      // Seed initial sample wishlist items from benchmark products
      const seeded = [
        addToWishlist({
          productName: 'Skin Perfecting 2% BHA Liquid Exfoliant',
          brand: "Paula's Choice",
          category: 'Exfoliant',
          verdict: 'use_with_caution',
          sourceLinks: ['https://world.openbeautyfacts.org'],
        }),
        addToWishlist({
          productName: 'Moisturizing Cream',
          brand: 'CeraVe',
          category: 'Moisturizer',
          verdict: 'good_fit',
          sourceLinks: ['https://world.openbeautyfacts.org'],
        }),
      ];
      setItems(seeded);
    } else {
      setItems(list);
    }
  }, []);

  function toggleCompareSelection(id: string) {
    if (selectedForCompare.includes(id)) {
      setSelectedForCompare(selectedForCompare.filter((i) => i !== id));
    } else {
      if (selectedForCompare.length >= 2) {
        // Keep max 2 items
        setSelectedForCompare([selectedForCompare[1], id]);
      } else {
        setSelectedForCompare([...selectedForCompare, id]);
      }
    }
  }

  function handleRemove(id: string) {
    removeFromWishlist(id);
    setItems((prev) => prev.filter((i) => i.id !== id));
    setSelectedForCompare((prev) => prev.filter((i) => i !== id));
  }

  const comparedProducts = items.filter((i) => selectedForCompare.includes(i.id));

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 sm:py-12 space-y-8 animate-fade-in">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-sage-dark mb-1 block">
            Saved Intelligence
          </span>
          <h1 className="font-heading text-3xl font-bold text-charcoal sm:text-4xl">
            Wishlist & Product Comparison
          </h1>
          <p className="mt-1 text-sm text-charcoal-light">
            Compare two shortlisted products side-by-side using existing cached reports (0 AI API cost).
          </p>
        </div>

        <div>
          <Button
            onClick={() => setShowModal(true)}
            disabled={selectedForCompare.length !== 2}
            className="rounded-full bg-sage hover:bg-sage-dark text-white px-6 py-2.5 text-xs font-semibold shadow-sm transition-all disabled:opacity-40"
          >
            ⚖️ Compare Selected ({selectedForCompare.length}/2)
          </Button>
        </div>
      </div>

      {/* Select 2 Hint */}
      {items.length > 0 && selectedForCompare.length < 2 && (
        <div className="rounded-xl bg-cream p-3 text-xs text-charcoal-light flex items-center gap-2 border border-border">
          <span>💡</span>
          <span>Check the boxes on any 2 products below to compare their formulas and verdicts side-by-side.</span>
        </div>
      )}

      {/* Wishlist Items List */}
      <div className="space-y-3">
        {items.map((item) => {
          const isChecked = selectedForCompare.includes(item.id);

          return (
            <Card
              key={item.id}
              className={`p-5 border bg-card transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                isChecked
                  ? 'border-2 border-sage bg-sage/5 shadow-md'
                  : 'border-border shadow-sm hover:border-sage-light'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleCompareSelection(item.id)}
                  className="mt-1 h-4 w-4 rounded border-border text-sage focus:ring-sage cursor-pointer"
                  aria-label={`Select ${item.productName} for comparison`}
                />
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[11px] font-medium text-charcoal-lighter uppercase">
                      {item.brand || 'Skincare'}
                    </span>
                    {item.verdict && (
                      <Badge
                        variant={
                          item.verdict === 'good_fit'
                            ? 'good'
                            : item.verdict === 'avoid'
                            ? 'avoid'
                            : 'caution'
                        }
                        className="text-[10px] capitalize font-medium"
                      >
                        {item.verdict.replace(/_/g, ' ')}
                      </Badge>
                    )}
                  </div>
                  <h3 className="font-heading text-base font-bold text-charcoal">
                    {item.productName}
                  </h3>
                  <span className="text-xs text-charcoal-light">
                    Category: {item.category}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  href="/routine/builder"
                  className="rounded-full bg-cream hover:bg-cream-dark px-3 py-1.5 text-xs font-semibold text-charcoal border border-border transition-colors"
                >
                  Test in Routine Builder →
                </Link>
                <button
                  type="button"
                  onClick={() => handleRemove(item.id)}
                  className="text-xs text-charcoal-lighter hover:text-terracotta transition-colors p-1"
                  aria-label="Remove from wishlist"
                >
                  ✕
                </button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Comparison Modal */}
      {showModal && comparedProducts.length === 2 && (
        <ProductCompareModal
          productA={comparedProducts[0]}
          productB={comparedProducts[1]}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
