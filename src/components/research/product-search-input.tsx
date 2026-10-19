'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { EVAL_PRODUCTS } from '@/lib/research/eval-products';
import { cn } from '@/lib/utils';

interface ProductSearchInputProps {
  onSearch: (data: {
    productName: string;
    brand?: string;
    userPastedIngredients?: string;
    userPastedReviews?: string;
  }) => void;
  isLoading: boolean;
}

export function ProductSearchInput({ onSearch, isLoading }: ProductSearchInputProps) {
  const [activeTab, setActiveTab] = useState<'name' | 'link' | 'paste'>('name');

  // Input states
  const [productName, setProductName] = useState('');
  const [brand, setBrand] = useState('');
  const [productUrl, setProductUrl] = useState('');
  const [pastedIngredients, setPastedIngredients] = useState('');
  const [pastedReviews, setPastedReviews] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (activeTab === 'name' && !productName.trim()) return;
    if (activeTab === 'link' && !productUrl.trim()) return;
    if (activeTab === 'paste' && !productName.trim() && !pastedIngredients.trim()) return;

    let targetName = productName.trim();
    if (activeTab === 'link') {
      try {
        const urlObj = new URL(productUrl);
        const pathSegments = urlObj.pathname.split('/').filter(Boolean);
        targetName = pathSegments[pathSegments.length - 1]?.replace(/[-_]/g, ' ') || 'Linked Skincare Product';
      } catch {
        targetName = 'Linked Skincare Product';
      }
    }

    onSearch({
      productName: targetName || 'Custom Formulation',
      brand: brand.trim() || undefined,
      userPastedIngredients: pastedIngredients.trim() || undefined,
      userPastedReviews: pastedReviews.trim() || undefined,
    });
  }

  function handleQuickSelect(prodName: string, prodBrand: string) {
    setProductName(prodName);
    setBrand(prodBrand);
    setActiveTab('name');
    onSearch({
      productName: prodName,
      brand: prodBrand,
    });
  }

  return (
    <Card className="p-6 border-border bg-card shadow-card space-y-6">
      {/* Tabs */}
      <div className="flex border-b border-border pb-3 gap-3 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('name')}
          className={cn(
            'text-xs font-semibold pb-2 border-b-2 transition-all shrink-0',
            activeTab === 'name'
              ? 'border-sage text-charcoal'
              : 'border-transparent text-charcoal-light hover:text-charcoal'
          )}
        >
          🔍 Product Name & Brand
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('link')}
          className={cn(
            'text-xs font-semibold pb-2 border-b-2 transition-all shrink-0',
            activeTab === 'link'
              ? 'border-sage text-charcoal'
              : 'border-transparent text-charcoal-light hover:text-charcoal'
          )}
        >
          🔗 Paste Product Link
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('paste')}
          className={cn(
            'text-xs font-semibold pb-2 border-b-2 transition-all shrink-0',
            activeTab === 'paste'
              ? 'border-sage text-charcoal'
              : 'border-transparent text-charcoal-light hover:text-charcoal'
          )}
        >
          📋 Paste Ingredients & Reviews
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {activeTab === 'name' && (
          <div className="grid gap-3 sm:grid-cols-12 items-end">
            <div className="sm:col-span-7">
              <label className="block text-xs font-semibold text-charcoal mb-1">
                Product Name
              </label>
              <Input
                placeholder="e.g. Skin Perfecting 2% BHA Liquid Exfoliant"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                required
              />
            </div>
            <div className="sm:col-span-3">
              <label className="block text-xs font-semibold text-charcoal mb-1">
                Brand (Optional)
              </label>
              <Input
                placeholder="e.g. Paula's Choice"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
              />
            </div>
            <div className="sm:col-span-2">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 rounded-xl bg-sage hover:bg-sage-dark text-white font-semibold text-xs shadow-sm"
              >
                {isLoading ? 'Researching...' : 'Research'}
              </Button>
            </div>
          </div>
        )}

        {activeTab === 'link' && (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-charcoal mb-1">
                Paste Product URL
              </label>
              <Input
                type="url"
                placeholder="https://example.com/product/salicylic-acid-cleanser"
                value={productUrl}
                onChange={(e) => setProductUrl(e.target.value)}
                required
              />
              <p className="mt-1 text-[11px] text-charcoal-lighter">
                We extract the product identity and resolve ingredients without invasive retailer site scraping.
              </p>
            </div>
            <Button
              type="submit"
              disabled={isLoading}
              className="rounded-xl bg-sage hover:bg-sage-dark text-white font-semibold text-xs px-6 h-10 shadow-sm"
            >
              {isLoading ? 'Researching...' : 'Analyze URL'}
            </Button>
          </div>
        )}

        {activeTab === 'paste' && (
          <div className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-charcoal mb-1">
                  Product Name
                </label>
                <Input
                  placeholder="e.g. Custom Barrier Serum"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-charcoal mb-1">
                  Brand (Optional)
                </label>
                <Input
                  placeholder="e.g. Indie Brand"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-charcoal mb-1">
                Pasted INCI Ingredient List (First-class input)
              </label>
              <Textarea
                placeholder="Water, Glycerin, Niacinamide, Sodium Hyaluronate, Ceramide NP, Phenoxyethanol..."
                value={pastedIngredients}
                onChange={(e) => setPastedIngredients(e.target.value)}
                className="min-h-[80px]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-charcoal mb-1">
                Pasted Review / Feedback Snippets (Optional)
              </label>
              <Textarea
                placeholder="Paste customer reviews or Reddit comments to analyze authenticity & sentiment..."
                value={pastedReviews}
                onChange={(e) => setPastedReviews(e.target.value)}
                className="min-h-[70px]"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="rounded-xl bg-sage hover:bg-sage-dark text-white font-semibold text-xs px-6 h-10 shadow-sm"
            >
              {isLoading ? 'Researching...' : 'Synthesize Pasted Data'}
            </Button>
          </div>
        )}
      </form>

      {/* Quick Test / Popular Products Tray */}
      <div className="pt-3 border-t border-border/70">
        <span className="block text-[11px] font-semibold text-charcoal-lighter mb-2">
          Try researching popular benchmark products:
        </span>
        <div className="flex flex-wrap gap-1.5">
          {EVAL_PRODUCTS.slice(0, 6).map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleQuickSelect(item.name, item.brand)}
              className="inline-flex items-center gap-1 rounded-full bg-cream-dark/70 hover:bg-sage-light hover:text-charcoal px-3 py-1 text-xs text-charcoal-light transition-colors"
            >
              <span>✦</span>
              <span>{item.brand} {item.name}</span>
            </button>
          ))}
        </div>
      </div>
    </Card>
  );
}
