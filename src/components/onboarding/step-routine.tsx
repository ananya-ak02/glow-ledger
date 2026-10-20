'use client';

import { useState, useRef, useEffect } from 'react';
import type { RoutineStepInput } from '@/types/onboarding';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { searchPopularProducts, type CatalogProduct } from '@/lib/products/popular-products';

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

const QUICK_STARTERS_AM = [
  { name: 'CeraVe Hydrating Facial Cleanser', category: 'Cleanser' },
  { name: 'The Ordinary Niacinamide 10% + Zinc 1%', category: 'Serum / Ampoule' },
  { name: 'Biore UV Aqua Rich Watery Essence SPF 50+', category: 'Sunscreen' },
  { name: 'Minimalist 10% Vitamin C Face Serum', category: 'Serum / Ampoule' },
];

const QUICK_STARTERS_PM = [
  { name: 'CeraVe Foaming Facial Cleanser', category: 'Cleanser' },
  { name: 'Paula\'s Choice 2% BHA Liquid Exfoliant', category: 'Exfoliant / Acid' },
  { name: 'The Ordinary Retinol 0.2% in Squalane', category: 'Retinoid / Treatment' },
  { name: 'CeraVe PM Facial Moisturizing Lotion', category: 'Moisturizer' },
];

export function StepRoutine({
  amRoutine,
  pmRoutine,
  onChangeAm,
  onChangePm,
}: StepRoutineProps) {
  const [activeTab, setActiveTab] = useState<'am' | 'pm'>('am');

  // Input states
  const [productName, setProductName] = useState('');
  const [category, setCategory] = useState('Cleanser');
  const [frequency, setFrequency] = useState('Daily');

  // Product Matching states
  const [suggestions, setSuggestions] = useState<CatalogProduct[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // Close suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleNameChange(val: string) {
    setProductName(val);
    setErrorMessage(null);

    if (val.trim().length >= 2) {
      const matches = searchPopularProducts(val);
      setSuggestions(matches);
      setShowDropdown(matches.length > 0);
      setSelectedIndex(-1);
    } else {
      setSuggestions([]);
      setShowDropdown(false);
    }
  }

  function handleSelectSuggestion(product: CatalogProduct) {
    setProductName(product.name);
    setCategory(product.category);
    setShowDropdown(false);
    setErrorMessage(null);
  }

  function addStep(nameToAdd?: string, categoryToAdd?: string) {
    const finalName = (nameToAdd || productName).trim();
    const finalCategory = categoryToAdd || category;

    if (!finalName) {
      setErrorMessage('Please type or select a product name first.');
      return;
    }

    const newStep: RoutineStepInput = {
      id: Math.random().toString(36).substring(2, 9),
      product_name: finalName,
      category: finalCategory,
      frequency,
    };

    if (activeTab === 'am') {
      onChangeAm([...amRoutine, newStep]);
    } else {
      onChangePm([...pmRoutine, newStep]);
    }

    // Reset draft & provide feedback
    setProductName('');
    setErrorMessage(null);
    setShowDropdown(false);
    setSuccessToast(`✓ Added to ${activeTab === 'am' ? 'Morning' : 'Evening'} routine`);
    setTimeout(() => setSuccessToast(null), 2500);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (showDropdown && suggestions.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
        return;
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
        return;
      }
      if (e.key === 'Enter') {
        e.preventDefault();
        if (selectedIndex >= 0 && suggestions[selectedIndex]) {
          handleSelectSuggestion(suggestions[selectedIndex]);
          return;
        }
      }
      if (e.key === 'Escape') {
        setShowDropdown(false);
        return;
      }
    }

    if (e.key === 'Enter') {
      e.preventDefault();
      addStep();
    }
  }

  function removeStep(id: string, tab: 'am' | 'pm') {
    if (tab === 'am') {
      onChangeAm(amRoutine.filter((s) => s.id !== id));
    } else {
      onChangePm(pmRoutine.filter((s) => s.id !== id));
    }
  }

  const currentSteps = activeTab === 'am' ? amRoutine : pmRoutine;
  const quickStarters = activeTab === 'am' ? QUICK_STARTERS_AM : QUICK_STARTERS_PM;

  return (
    <div className="space-y-6 animate-fade-in" ref={containerRef}>
      <div className="text-center max-w-lg mx-auto">
        <h2 className="font-heading text-2xl font-bold text-charcoal sm:text-3xl">
          What is your current routine?
        </h2>
        <p className="mt-2 text-sm text-charcoal-light">
          Add the products you currently apply in the morning and night. Search to auto-match category or type your own.
        </p>
      </div>

      {/* AM / PM Tab Switcher */}
      <div className="flex justify-center">
        <div className="inline-flex rounded-full bg-cream-dark p-1 border border-border">
          <button
            type="button"
            onClick={() => {
              setActiveTab('am');
              setCategory('Cleanser');
              setErrorMessage(null);
            }}
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
            onClick={() => {
              setActiveTab('pm');
              setCategory('Cleanser');
              setErrorMessage(null);
            }}
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

      {/* Main card: Step input with Product Match */}
      <div className="max-w-2xl mx-auto space-y-4">
        <Card className="p-5 border-border bg-card shadow-card relative">
          <div className="text-xs font-medium text-charcoal mb-3 flex items-center justify-between">
            <span className="flex items-center gap-1.5 font-semibold">
              <span>{activeTab === 'am' ? '☀️' : '🌙'}</span>
              <span>Add product to {activeTab === 'am' ? 'Morning' : 'Evening'} routine</span>
            </span>
            <span className="text-charcoal-lighter font-normal text-[11px]">
              Layer {currentSteps.length + 1}
            </span>
          </div>

          <div className="grid gap-3 sm:grid-cols-12 items-end">
            {/* Product Name Input with live Autocomplete Dropdown */}
            <div className="sm:col-span-5 relative">
              <label className="block text-[11px] font-medium text-charcoal-light mb-1">
                Product name / brand
              </label>
              <div className="relative">
                <Input
                  placeholder="e.g. CeraVe, Niacinamide, BHA..."
                  value={productName}
                  onChange={(e) => handleNameChange(e.target.value)}
                  onFocus={() => {
                    if (productName.trim().length >= 2 && suggestions.length > 0) {
                      setShowDropdown(true);
                    }
                  }}
                  onKeyDown={handleKeyDown}
                  className={cn(
                    'h-11 pr-8',
                    errorMessage && 'border-terracotta ring-1 ring-terracotta'
                  )}
                  autoComplete="off"
                />
                {productName && (
                  <button
                    type="button"
                    onClick={() => {
                      setProductName('');
                      setSuggestions([]);
                      setShowDropdown(false);
                    }}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-charcoal-lighter hover:text-charcoal text-xs p-1"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Product Match Dropdown */}
              {showDropdown && suggestions.length > 0 && (
                <div className="absolute left-0 right-0 top-full mt-1.5 z-50 rounded-xl border border-border bg-card shadow-lg max-h-64 overflow-y-auto divide-y divide-border/50">
                  <div className="p-2 text-[10px] font-semibold uppercase tracking-wider text-charcoal-lighter bg-cream/50">
                    Product Matches (Click to auto-fill & set category)
                  </div>
                  {suggestions.map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        handleSelectSuggestion(item);
                      }}
                      className={cn(
                        'w-full text-left p-2.5 text-xs transition-colors flex items-start justify-between gap-2',
                        idx === selectedIndex
                          ? 'bg-sage/10 text-charcoal'
                          : 'hover:bg-cream-dark text-charcoal'
                      )}
                    >
                      <div>
                        <div className="font-semibold text-charcoal leading-snug">
                          {item.name}
                        </div>
                        <div className="text-[10px] text-charcoal-light mt-0.5">
                          Brand: <strong className="text-charcoal">{item.brand}</strong>
                          {item.keyActives && item.keyActives.length > 0 && (
                            <span className="ml-1 text-charcoal-lighter">
                              · {item.keyActives.join(', ')}
                            </span>
                          )}
                        </div>
                      </div>
                      <Badge variant="outline" className="text-[10px] shrink-0 mt-0.5 capitalize">
                        {item.category}
                      </Badge>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Category Dropdown (Auto-filled on match) */}
            <div className="sm:col-span-3">
              <label className="block text-[11px] font-medium text-charcoal-light mb-1">
                Category
              </label>
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

            {/* Frequency Selector */}
            <div className="sm:col-span-2">
              <label className="block text-[11px] font-medium text-charcoal-light mb-1">
                Frequency
              </label>
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

            {/* Add Button */}
            <div className="sm:col-span-2">
              <Button
                type="button"
                onClick={() => addStep()}
                className="w-full h-11 rounded-xl bg-sage hover:bg-sage-dark text-white font-medium text-xs shadow-xs"
              >
                + Add Product
              </Button>
            </div>
          </div>

          {/* Inline Validation / Success Messaging */}
          {errorMessage && (
            <div className="mt-2 text-xs text-terracotta font-medium flex items-center gap-1">
              <span>⚠️</span>
              <span>{errorMessage}</span>
            </div>
          )}

          {successToast && (
            <div className="mt-2 text-xs text-sage-dark font-medium flex items-center gap-1 animate-fade-in">
              <span>{successToast}</span>
            </div>
          )}

          {/* 1-Click Popular Starters */}
          <div className="mt-4 pt-3.5 border-t border-border/60">
            <span className="text-[11px] font-medium text-charcoal-lighter mr-2">
              Quick Add Popular:
            </span>
            <div className="inline-flex flex-wrap gap-1.5 mt-1">
              {quickStarters.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => addStep(item.name, item.category)}
                  className="rounded-full bg-cream hover:bg-cream-dark border border-border px-2.5 py-1 text-[11px] text-charcoal font-medium transition-all hover:border-sage flex items-center gap-1"
                >
                  <span>+</span>
                  <span>{item.name}</span>
                </button>
              ))}
            </div>
          </div>
        </Card>

        {/* Current steps list */}
        <div className="space-y-2">
          {currentSteps.length === 0 ? (
            <div className="text-center py-10 rounded-2xl border border-dashed border-border p-6 bg-card/40">
              <span className="text-3xl">🧴</span>
              <p className="mt-2 text-xs text-charcoal-light font-medium">
                No products added to your {activeTab === 'am' ? 'morning' : 'evening'} routine yet.
              </p>
              <p className="text-[11px] text-charcoal-lighter mt-1 max-w-sm mx-auto">
                Type above to match popular skincare brands, or click any of the quick-add suggestions above.
              </p>
            </div>
          ) : (
            currentSteps.map((step, idx) => (
              <div
                key={step.id}
                className="flex items-center justify-between rounded-xl border border-border bg-card p-3.5 shadow-xs transition-all hover:border-sage/40"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-cream-dark text-xs font-bold text-charcoal">
                    {idx + 1}
                  </span>
                  <div>
                    <h4 className="text-xs sm:text-sm font-semibold text-charcoal">
                      {step.product_name}
                    </h4>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Badge variant="outline" className="text-[10px] py-0 bg-cream/30">
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
                  className="text-xs text-charcoal-lighter hover:text-terracotta transition-colors p-1.5 rounded-lg hover:bg-cream"
                  aria-label="Remove step"
                  title="Remove from routine"
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
