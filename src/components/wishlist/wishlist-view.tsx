'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  getLocalWishlist,
  removeFromWishlist,
  addToWishlist,
  isProductInWishlist,
  type WishlistItemStored,
} from '@/lib/wishlist/storage';
import {
  searchPopularProducts,
  type CatalogProduct,
} from '@/lib/products/popular-products';
import { INITIAL_ONBOARDING_STATE, type OnboardingState } from '@/types/onboarding';
import type { ResearchPipelineResult } from '@/lib/research/pipeline';

interface ComparedProductState {
  name: string;
  brand: string;
  category?: string;
  result?: ResearchPipelineResult | null;
  loading: boolean;
  error?: string | null;
}

const PRESET_MATCHUPS = [
  {
    label: 'Moisturizers: CeraVe vs Cetaphil',
    prodA: { name: 'CeraVe Moisturizing Cream', brand: 'CeraVe' },
    prodB: { name: 'Cetaphil Moisturizing Lotion', brand: 'Cetaphil' },
  },
  {
    label: 'Niacinamide: The Ordinary vs Minimalist',
    prodA: { name: 'The Ordinary Niacinamide 10% + Zinc 1%', brand: 'The Ordinary' },
    prodB: { name: 'Minimalist 10% Niacinamide Serum', brand: 'Minimalist' },
  },
  {
    label: 'BHA Exfoliant: Paula\'s Choice vs Cosrx',
    prodA: { name: 'Paula\'s Choice 2% BHA Liquid Exfoliant', brand: 'Paula\'s Choice' },
    prodB: { name: 'Cosrx BHA Blackhead Power Liquid', brand: 'Cosrx' },
  },
  {
    label: 'Sunscreen: La Roche-Posay vs Beauty of Joseon',
    prodA: { name: 'La Roche-Posay Anthelios UVMune 400 SPF 50+', brand: 'La Roche-Posay' },
    prodB: { name: 'Beauty of Joseon Relief Sun Rice + Probiotics SPF 50+', brand: 'Beauty of Joseon' },
  },
];

export function WishlistView() {
  const [profileState, setProfileState] = useState<OnboardingState>(INITIAL_ONBOARDING_STATE);
  const [items, setItems] = useState<WishlistItemStored[]>([]);

  // Direct compare form states
  const [nameA, setNameA] = useState('');
  const [brandA, setBrandA] = useState('');
  const [nameB, setNameB] = useState('');
  const [brandB, setBrandB] = useState('');

  // Autocomplete state
  const [suggestionsA, setSuggestionsA] = useState<CatalogProduct[]>([]);
  const [suggestionsB, setSuggestionsB] = useState<CatalogProduct[]>([]);
  const [showDropdownA, setShowDropdownA] = useState(false);
  const [showDropdownB, setShowDropdownB] = useState(false);

  // Comparison execution states
  const [isComparing, setIsComparing] = useState(false);
  const [comparisonStep, setComparisonStep] = useState('');
  const [prodAResult, setProdAResult] = useState<ResearchPipelineResult | null>(null);
  const [prodBResult, setProdBResult] = useState<ResearchPipelineResult | null>(null);
  const [compareError, setCompareError] = useState<string | null>(null);

  // Notification toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const containerRefA = useRef<HTMLDivElement>(null);
  const containerRefB = useRef<HTMLDivElement>(null);

  // Load user profile & wishlist on mount
  useEffect(() => {
    // 1. Wishlist (strictly real user items, no seeded demo items)
    const list = getLocalWishlist();
    setItems(list);

    // 2. User profile for personalization
    try {
      const savedProfile =
        localStorage.getItem('glowledger_user_profile') ||
        localStorage.getItem('glowledger_onboarding_draft_v1');
      if (savedProfile) {
        setProfileState(JSON.parse(savedProfile));
      }
    } catch {}

    // 3. URL Query parameters (e.g. ?compareA=...&compareB=...)
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlA = params.get('compareA');
      const urlB = params.get('compareB');
      if (urlA) setNameA(urlA);
      if (urlB) setNameB(urlB);
    }
  }, []);

  // Close autocomplete on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRefA.current && !containerRefA.current.contains(e.target as Node)) {
        setShowDropdownA(false);
      }
      if (containerRefB.current && !containerRefB.current.contains(e.target as Node)) {
        setShowDropdownB(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleNameAChange(val: string) {
    setNameA(val);
    if (val.trim().length >= 2) {
      setSuggestionsA(searchPopularProducts(val, 6));
      setShowDropdownA(true);
    } else {
      setSuggestionsA([]);
      setShowDropdownA(false);
    }
  }

  function handleNameBChange(val: string) {
    setNameB(val);
    if (val.trim().length >= 2) {
      setSuggestionsB(searchPopularProducts(val, 6));
      setShowDropdownB(true);
    } else {
      setSuggestionsB([]);
      setShowDropdownB(false);
    }
  }

  function selectSuggestionA(p: CatalogProduct) {
    setNameA(p.name);
    setBrandA(p.brand);
    setShowDropdownA(false);
  }

  function selectSuggestionB(p: CatalogProduct) {
    setNameB(p.name);
    setBrandB(p.brand);
    setShowDropdownB(false);
  }

  function handleSwap() {
    const tempName = nameA;
    const tempBrand = brandA;
    const tempRes = prodAResult;

    setNameA(nameB);
    setBrandA(brandB);
    setProdAResult(prodBResult);

    setNameB(tempName);
    setBrandB(tempBrand);
    setProdBResult(tempRes);
  }

  function handleApplyPreset(preset: typeof PRESET_MATCHUPS[0]) {
    setNameA(preset.prodA.name);
    setBrandA(preset.prodA.brand);
    setNameB(preset.prodB.name);
    setBrandB(preset.prodB.brand);
    setProdAResult(null);
    setProdBResult(null);
    setCompareError(null);
  }

  function showToast(msg: string) {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  }

  async function handleExecuteCompare() {
    if (!nameA.trim() || !nameB.trim()) {
      setCompareError('Please enter product names for both Product 1 and Product 2.');
      return;
    }

    setIsComparing(true);
    setCompareError(null);
    setProdAResult(null);
    setProdBResult(null);

    try {
      // Step 1: Research Product A
      setComparisonStep(`Analyzing Product 1: ${nameA.trim()}...`);
      const resA = await fetch('/api/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName: nameA.trim(),
          brand: brandA.trim() || undefined,
          userProfile: profileState,
        }),
      });

      if (!resA.ok) {
        throw new Error(`Failed to analyze ${nameA.trim()}`);
      }
      const dataA = await resA.json();
      const resultA: ResearchPipelineResult = dataA.data;
      setProdAResult(resultA);

      // Step 2: Research Product B
      setComparisonStep(`Analyzing Product 2: ${nameB.trim()}...`);
      const resB = await fetch('/api/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName: nameB.trim(),
          brand: brandB.trim() || undefined,
          userProfile: profileState,
        }),
      });

      if (!resB.ok) {
        throw new Error(`Failed to analyze ${nameB.trim()}`);
      }
      const dataB = await resB.json();
      const resultB: ResearchPipelineResult = dataB.data;
      setProdBResult(resultB);

      setComparisonStep('Synthesizing head-to-head comparison...');
    } catch (err: any) {
      setCompareError(err?.message || 'Comparison failed. Please check connection and try again.');
    } finally {
      setIsComparing(false);
      setComparisonStep('');
    }
  }

  function handleSaveToWishlist(
    productName: string,
    brand: string,
    result: ResearchPipelineResult
  ) {
    const saved = addToWishlist({
      productName,
      brand: brand || result.synthesis.brand || 'Skincare',
      category: result.synthesis.best_for?.[0] || 'Treatment',
      verdict: result.personalization.verdict,
      synthesis: result.synthesis,
      personalization: result.personalization,
      sourceLinks: result.sourceLinks,
    });
    setItems(getLocalWishlist());
    showToast(`✓ Saved "${productName}" to your Wishlist!`);
  }

  function handleRemoveFromWishlist(id: string) {
    removeFromWishlist(id);
    setItems(getLocalWishlist());
  }

  function handleLoadIntoCompare(item: WishlistItemStored, slot: 'A' | 'B') {
    if (slot === 'A') {
      setNameA(item.productName);
      setBrandA(item.brand || '');
    } else {
      setNameB(item.productName);
      setBrandB(item.brand || '');
    }
    // Scroll smoothly to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast(`Loaded "${item.productName}" into Product ${slot === 'A' ? '1' : '2'}`);
  }

  // Calculate winner if both results are present
  function getComparisonVerdict() {
    if (!prodAResult || !prodBResult) return null;

    const rank = { good_fit: 3, use_with_caution: 2, avoid: 1 };
    const scoreA = rank[prodAResult.personalization.verdict];
    const scoreB = rank[prodBResult.personalization.verdict];

    const conflictsA = prodAResult.conflicts.length;
    const conflictsB = prodBResult.conflicts.length;

    if (scoreA > scoreB) {
      return {
        winner: 'A',
        title: `🏆 Recommendation: ${nameA} is a Better Fit for You`,
        reason: `${nameA} is categorized as a "${prodAResult.personalization.verdict.replace(/_/g, ' ')}" for your ${profileState.skin_type || 'skin'} profile, whereas ${nameB} is "${prodBResult.personalization.verdict.replace(/_/g, ' ')}".`,
      };
    } else if (scoreB > scoreA) {
      return {
        winner: 'B',
        title: `🏆 Recommendation: ${nameB} is a Better Fit for You`,
        reason: `${nameB} is categorized as a "${prodBResult.personalization.verdict.replace(/_/g, ' ')}" for your ${profileState.skin_type || 'skin'} profile, whereas ${nameA} is "${prodAResult.personalization.verdict.replace(/_/g, ' ')}".`,
      };
    } else {
      // Tie in verdict
      if (conflictsA < conflictsB) {
        return {
          winner: 'A',
          title: `🏆 Recommendation: ${nameA} has fewer Routine Conflicts`,
          reason: `Both products are rated "${prodAResult.personalization.verdict.replace(/_/g, ' ')}", but ${nameA} has zero active chemical conflicts with your current skincare steps.`,
        };
      } else if (conflictsB < conflictsA) {
        return {
          winner: 'B',
          title: `🏆 Recommendation: ${nameB} has fewer Routine Conflicts`,
          reason: `Both products are rated "${prodBResult.personalization.verdict.replace(/_/g, ' ')}", but ${nameB} has zero active chemical conflicts with your current skincare steps.`,
        };
      } else {
        return {
          winner: 'tie',
          title: `✨ Both Products Fit Your Skin Profile`,
          reason: `Both ${nameA} and ${nameB} match your barrier parameters well. Compare their key actives and textures below to choose your favorite!`,
        };
      }
    }
  }

  const comparisonVerdict = getComparisonVerdict();

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 sm:py-12 space-y-8 animate-fade-in">
      {/* Toast notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 rounded-2xl bg-charcoal text-white px-5 py-3 text-xs shadow-xl flex items-center gap-2 animate-fade-in">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-sage-dark mb-1 block">
          Side-by-Side Skincare Intelligence
        </span>
        <h1 className="font-heading text-3xl font-bold text-charcoal sm:text-4xl">
          Direct Product Comparison & Wishlist
        </h1>
        <p className="mt-1.5 text-sm text-charcoal-light leading-relaxed max-w-2xl">
          Enter any two skincare products below to compare active ingredients, routine placement, community sentiment, and personalized fit for your skin.
        </p>
      </div>

      {/* ─── SECTION 1: Interactive Product Comparison Form ──────────── */}
      <Card className="p-6 sm:p-8 border-border bg-card shadow-card space-y-6">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">⚖️</span>
            <h2 className="font-heading text-lg font-bold text-charcoal">
              Enter 2 Products to Compare
            </h2>
          </div>
          <button
            type="button"
            onClick={handleSwap}
            disabled={!nameA && !nameB}
            className="flex items-center gap-1.5 text-xs text-charcoal-light hover:text-charcoal bg-cream px-3 py-1.5 rounded-full border border-border transition-colors disabled:opacity-40"
          >
            <span>⇄</span>
            <span>Swap Products</span>
          </button>
        </div>

        {/* Two product inputs grid */}
        <div className="grid gap-6 md:grid-cols-2 relative">
          {/* Product A */}
          <div ref={containerRefA} className="space-y-3 relative">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-charcoal flex items-center gap-1.5">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-sage text-white text-[10px]">
                  1
                </span>
                <span>Product 1 (First Formula)</span>
              </label>
              {nameA && (
                <button
                  type="button"
                  onClick={() => {
                    setNameA('');
                    setBrandA('');
                  }}
                  className="text-[11px] text-charcoal-lighter hover:text-terracotta"
                >
                  Clear
                </button>
              )}
            </div>

            <div>
              <Input
                placeholder="Type product name (e.g. CeraVe Moisturizing Cream)..."
                value={nameA}
                onChange={(e) => handleNameAChange(e.target.value)}
                onFocus={() => {
                  if (nameA.trim().length >= 2) setShowDropdownA(true);
                }}
                className="bg-white"
              />
            </div>

            <div>
              <Input
                placeholder="Brand (optional, e.g. CeraVe)"
                value={brandA}
                onChange={(e) => setBrandA(e.target.value)}
                className="bg-white text-xs h-9"
              />
            </div>

            {/* Autocomplete dropdown A */}
            {showDropdownA && suggestionsA.length > 0 && (
              <div className="absolute top-14 left-0 right-0 z-30 rounded-2xl border border-border bg-white shadow-xl p-1.5 space-y-1">
                {suggestionsA.map((s, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => selectSuggestionA(s)}
                    className="w-full text-left p-2.5 rounded-xl hover:bg-cream transition-colors text-xs flex items-center justify-between"
                  >
                    <div>
                      <div className="font-semibold text-charcoal">{s.name}</div>
                      <div className="text-[10px] text-charcoal-lighter">
                        {s.brand} · {s.category}
                      </div>
                    </div>
                    {s.keyActives && (
                      <span className="text-[10px] text-sage-dark bg-sage/10 px-2 py-0.5 rounded-md">
                        {s.keyActives[0]}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product B */}
          <div ref={containerRefB} className="space-y-3 relative">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-charcoal flex items-center gap-1.5">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-terracotta text-white text-[10px]">
                  2
                </span>
                <span>Product 2 (Second Formula)</span>
              </label>
              {nameB && (
                <button
                  type="button"
                  onClick={() => {
                    setNameB('');
                    setBrandB('');
                  }}
                  className="text-[11px] text-charcoal-lighter hover:text-terracotta"
                >
                  Clear
                </button>
              )}
            </div>

            <div>
              <Input
                placeholder="Type product name (e.g. Cetaphil Moisturizing Lotion)..."
                value={nameB}
                onChange={(e) => handleNameBChange(e.target.value)}
                onFocus={() => {
                  if (nameB.trim().length >= 2) setShowDropdownB(true);
                }}
                className="bg-white"
              />
            </div>

            <div>
              <Input
                placeholder="Brand (optional, e.g. Cetaphil)"
                value={brandB}
                onChange={(e) => setBrandB(e.target.value)}
                className="bg-white text-xs h-9"
              />
            </div>

            {/* Autocomplete dropdown B */}
            {showDropdownB && suggestionsB.length > 0 && (
              <div className="absolute top-14 left-0 right-0 z-30 rounded-2xl border border-border bg-white shadow-xl p-1.5 space-y-1">
                {suggestionsB.map((s, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => selectSuggestionB(s)}
                    className="w-full text-left p-2.5 rounded-xl hover:bg-cream transition-colors text-xs flex items-center justify-between"
                  >
                    <div>
                      <div className="font-semibold text-charcoal">{s.name}</div>
                      <div className="text-[10px] text-charcoal-lighter">
                        {s.brand} · {s.category}
                      </div>
                    </div>
                    {s.keyActives && (
                      <span className="text-[10px] text-terracotta-dark bg-terracotta/10 px-2 py-0.5 rounded-md">
                        {s.keyActives[0]}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Popular Matchup Presets */}
        <div className="pt-2 border-t border-border">
          <span className="text-[11px] font-semibold text-charcoal-lighter uppercase tracking-wider block mb-2">
            Popular Head-to-Head Comparisons:
          </span>
          <div className="flex flex-wrap gap-2">
            {PRESET_MATCHUPS.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleApplyPreset(preset)}
                className="rounded-full bg-cream hover:bg-cream-dark px-3 py-1.5 text-xs text-charcoal font-medium border border-border transition-colors text-left"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Error notice */}
        {compareError && (
          <div className="rounded-xl bg-blush p-3 text-xs text-terracotta-dark font-medium border border-terracotta/30">
            ⚠️ {compareError}
          </div>
        )}

        {/* Submit Comparison Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
          <div className="text-xs text-charcoal-light">
            Analyzed against your <strong>{profileState.skin_type || 'custom'}</strong> skin profile and active routine.
          </div>

          <Button
            type="button"
            onClick={handleExecuteCompare}
            disabled={isComparing || !nameA.trim() || !nameB.trim()}
            className="rounded-full bg-sage hover:bg-sage-dark text-white font-semibold text-xs px-8 py-3 shadow-sm transition-all disabled:opacity-50 h-auto"
          >
            {isComparing ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin">⏳</span>
                <span>{comparisonStep || 'Evaluating products...'}</span>
              </span>
            ) : (
              '⚖️ Compare Both Products Side-by-Side'
            )}
          </Button>
        </div>
      </Card>

      {/* ─── SECTION 2: Head-to-Head Comparison Results ─────────────── */}
      {prodAResult && prodBResult && (
        <div className="space-y-6 animate-fade-in">
          {/* Winner Recommendation Banner */}
          {comparisonVerdict && (
            <div
              className={`p-6 rounded-3xl border-2 shadow-card ${
                comparisonVerdict.winner === 'A'
                  ? 'border-sage bg-[var(--color-verdict-good-bg)]'
                  : comparisonVerdict.winner === 'B'
                  ? 'border-terracotta bg-[var(--color-verdict-avoid-bg)]'
                  : 'border-sage bg-cream'
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="text-3xl mt-0.5">
                  {comparisonVerdict.winner === 'tie' ? '✨' : '🏆'}
                </span>
                <div>
                  <h3 className="font-heading text-xl font-bold text-charcoal">
                    {comparisonVerdict.title}
                  </h3>
                  <p className="mt-1 text-xs text-charcoal-light leading-relaxed">
                    {comparisonVerdict.reason}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Side-by-side product cards */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Product A Card */}
            <Card className="p-6 border-2 border-sage/40 bg-card shadow-card space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-sage-dark block">
                    Product 1 · {brandA || prodAResult.synthesis.brand || 'Brand'}
                  </span>
                  <h3 className="font-heading text-xl font-bold text-charcoal mt-0.5">
                    {nameA}
                  </h3>
                </div>
                <Badge
                  variant={
                    prodAResult.personalization.verdict === 'good_fit'
                      ? 'good'
                      : prodAResult.personalization.verdict === 'avoid'
                      ? 'avoid'
                      : 'caution'
                  }
                  className="capitalize text-xs font-semibold shrink-0"
                >
                  {prodAResult.personalization.verdict.replace(/_/g, ' ')}
                </Badge>
              </div>

              <p className="text-xs text-charcoal-light leading-relaxed bg-cream/40 p-3 rounded-xl border border-border">
                {prodAResult.synthesis.summary}
              </p>

              {/* Fit Reasons */}
              <div>
                <span className="text-xs font-bold text-charcoal block mb-1">
                  Why it fits your profile:
                </span>
                <ul className="text-xs text-charcoal-light space-y-1 list-disc pl-4">
                  {(prodAResult.personalization.fit_reasons.length > 0
                    ? prodAResult.personalization.fit_reasons
                    : prodAResult.synthesis.pros
                  ).slice(0, 3).map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>

              {/* Key Actives */}
              <div>
                <span className="text-xs font-bold text-charcoal block mb-1.5">
                  Key Active Ingredients:
                </span>
                <div className="flex flex-wrap gap-1">
                  {prodAResult.synthesis.key_ingredients.slice(0, 4).map((k, i) => (
                    <span
                      key={i}
                      className="rounded-md bg-sage-light/60 px-2 py-0.5 text-[11px] text-charcoal font-medium"
                      title={k.function}
                    >
                      {k.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* Placement & Routine Conflicts */}
              <div className="pt-2 border-t border-border text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-charcoal-light">Routine Step:</span>
                  <span className="font-semibold text-charcoal capitalize">
                    {prodAResult.personalization.routine_placement?.suggested_step || 'Treatment'} (
                    {prodAResult.personalization.routine_placement?.time_of_day || 'PM'})
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-charcoal-light">Routine Conflicts:</span>
                  <span
                    className={`font-semibold ${
                      prodAResult.conflicts.length > 0
                        ? 'text-terracotta-dark font-bold'
                        : 'text-sage-dark'
                    }`}
                  >
                    {prodAResult.conflicts.length > 0
                      ? `⚠️ ${prodAResult.conflicts.length} conflict(s)`
                      : '✓ 0 Conflicts'}
                  </span>
                </div>
              </div>

              {/* Card Actions */}
              <div className="pt-3 border-t border-border flex items-center gap-2">
                <Button
                  type="button"
                  onClick={() => handleSaveToWishlist(nameA, brandA, prodAResult)}
                  variant="outline"
                  className="flex-1 rounded-full text-xs font-semibold border-border hover:bg-cream"
                >
                  🔖 Save to Wishlist
                </Button>
                <Link
                  href={`/research?q=${encodeURIComponent(nameA)}`}
                  className="rounded-full bg-cream hover:bg-cream-dark px-3 py-2 text-xs font-medium text-charcoal border border-border"
                  title="View full research page"
                >
                  Full Report →
                </Link>
              </div>
            </Card>

            {/* Product B Card */}
            <Card className="p-6 border-2 border-terracotta/40 bg-card shadow-card space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-terracotta-dark block">
                    Product 2 · {brandB || prodBResult.synthesis.brand || 'Brand'}
                  </span>
                  <h3 className="font-heading text-xl font-bold text-charcoal mt-0.5">
                    {nameB}
                  </h3>
                </div>
                <Badge
                  variant={
                    prodBResult.personalization.verdict === 'good_fit'
                      ? 'good'
                      : prodBResult.personalization.verdict === 'avoid'
                      ? 'avoid'
                      : 'caution'
                  }
                  className="capitalize text-xs font-semibold shrink-0"
                >
                  {prodBResult.personalization.verdict.replace(/_/g, ' ')}
                </Badge>
              </div>

              <p className="text-xs text-charcoal-light leading-relaxed bg-cream/40 p-3 rounded-xl border border-border">
                {prodBResult.synthesis.summary}
              </p>

              {/* Fit Reasons */}
              <div>
                <span className="text-xs font-bold text-charcoal block mb-1">
                  Why it fits your profile:
                </span>
                <ul className="text-xs text-charcoal-light space-y-1 list-disc pl-4">
                  {(prodBResult.personalization.fit_reasons.length > 0
                    ? prodBResult.personalization.fit_reasons
                    : prodBResult.synthesis.pros
                  ).slice(0, 3).map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>

              {/* Key Actives */}
              <div>
                <span className="text-xs font-bold text-charcoal block mb-1.5">
                  Key Active Ingredients:
                </span>
                <div className="flex flex-wrap gap-1">
                  {prodBResult.synthesis.key_ingredients.slice(0, 4).map((k, i) => (
                    <span
                      key={i}
                      className="rounded-md bg-terracotta-light/40 px-2 py-0.5 text-[11px] text-charcoal font-medium"
                      title={k.function}
                    >
                      {k.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* Placement & Routine Conflicts */}
              <div className="pt-2 border-t border-border text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-charcoal-light">Routine Step:</span>
                  <span className="font-semibold text-charcoal capitalize">
                    {prodBResult.personalization.routine_placement?.suggested_step || 'Treatment'} (
                    {prodBResult.personalization.routine_placement?.time_of_day || 'PM'})
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-charcoal-light">Routine Conflicts:</span>
                  <span
                    className={`font-semibold ${
                      prodBResult.conflicts.length > 0
                        ? 'text-terracotta-dark font-bold'
                        : 'text-sage-dark'
                    }`}
                  >
                    {prodBResult.conflicts.length > 0
                      ? `⚠️ ${prodBResult.conflicts.length} conflict(s)`
                      : '✓ 0 Conflicts'}
                  </span>
                </div>
              </div>

              {/* Card Actions */}
              <div className="pt-3 border-t border-border flex items-center gap-2">
                <Button
                  type="button"
                  onClick={() => handleSaveToWishlist(nameB, brandB, prodBResult)}
                  variant="outline"
                  className="flex-1 rounded-full text-xs font-semibold border-border hover:bg-cream"
                >
                  🔖 Save to Wishlist
                </Button>
                <Link
                  href={`/research?q=${encodeURIComponent(nameB)}`}
                  className="rounded-full bg-cream hover:bg-cream-dark px-3 py-2 text-xs font-medium text-charcoal border border-border"
                  title="View full research page"
                >
                  Full Report →
                </Link>
              </div>
            </Card>
          </div>

          {/* Detailed Side-by-Side Comparison Matrix */}
          <Card className="p-6 border-border bg-card shadow-card space-y-4">
            <h4 className="font-heading text-base font-bold text-charcoal">
              Detailed Formulation Matrix
            </h4>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-border text-[11px] uppercase tracking-wider text-charcoal-lighter">
                    <th className="py-2.5 pr-4 font-semibold w-1/4">Criteria</th>
                    <th className="py-2.5 px-4 font-bold text-sage-dark w-3/8">{nameA}</th>
                    <th className="py-2.5 pl-4 font-bold text-terracotta-dark w-3/8">{nameB}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  <tr>
                    <td className="py-3 pr-4 font-semibold text-charcoal">Skin Compatibility</td>
                    <td className="py-3 px-4 capitalize font-medium text-charcoal">
                      {prodAResult.personalization.verdict.replace(/_/g, ' ')}
                    </td>
                    <td className="py-3 pl-4 capitalize font-medium text-charcoal">
                      {prodBResult.personalization.verdict.replace(/_/g, ' ')}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 font-semibold text-charcoal">Primary Actives</td>
                    <td className="py-3 px-4 text-charcoal-light">
                      {prodAResult.synthesis.key_ingredients.map((k) => k.name).join(', ') || 'N/A'}
                    </td>
                    <td className="py-3 pl-4 text-charcoal-light">
                      {prodBResult.synthesis.key_ingredients.map((k) => k.name).join(', ') || 'N/A'}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 font-semibold text-charcoal">Irritation Risk</td>
                    <td className="py-3 px-4 text-charcoal-light">
                      {prodAResult.synthesis.potential_irritants.length > 0
                        ? prodAResult.synthesis.potential_irritants.map((i) => i.name).join(', ')
                        : 'Low (No severe irritants flagged)'}
                    </td>
                    <td className="py-3 pl-4 text-charcoal-light">
                      {prodBResult.synthesis.potential_irritants.length > 0
                        ? prodBResult.synthesis.potential_irritants.map((i) => i.name).join(', ')
                        : 'Low (No severe irritants flagged)'}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 font-semibold text-charcoal">Routine Conflict Check</td>
                    <td className="py-3 px-4 text-charcoal-light">
                      {prodAResult.conflicts.length > 0
                        ? prodAResult.conflicts.map((c) => `${c.ingredient_a} + ${c.ingredient_b}`).join('; ')
                        : '✓ Safe with current routine'}
                    </td>
                    <td className="py-3 pl-4 text-charcoal-light">
                      {prodBResult.conflicts.length > 0
                        ? prodBResult.conflicts.map((c) => `${c.ingredient_a} + ${c.ingredient_b}`).join('; ')
                        : '✓ Safe with current routine'}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 font-semibold text-charcoal">Community Sentiment</td>
                    <td className="py-3 px-4 text-charcoal-light capitalize">
                      {prodAResult.synthesis.review_summary.overall_sentiment}
                    </td>
                    <td className="py-3 pl-4 text-charcoal-light capitalize">
                      {prodBResult.synthesis.review_summary.overall_sentiment}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* ─── SECTION 3: Saved Wishlist ──────────────────────────────── */}
      <div className="pt-6 border-t border-border space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-heading text-xl font-bold text-charcoal">
              My Saved Wishlist ({items.length})
            </h3>
            <p className="text-xs text-charcoal-light">
              Products you have bookmarked to test or compare later
            </p>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-10 rounded-2xl border border-dashed border-border bg-card/60 p-6 space-y-2">
            <span className="text-3xl block">🔖</span>
            <h4 className="font-heading text-sm font-bold text-charcoal">
              Your Wishlist is Empty
            </h4>
            <p className="text-xs text-charcoal-light max-w-sm mx-auto leading-relaxed">
              When you research products or compare formulas above, click <strong>Save to Wishlist</strong> to keep them shortlisted here for your routine.
            </p>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {items.map((item) => (
              <Card
                key={item.id}
                className="p-4 border border-border bg-card shadow-sm space-y-3 hover:border-sage transition-all"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-medium text-charcoal-lighter uppercase">
                      {item.brand || 'Skincare'} · {item.category}
                    </span>
                    <h4 className="font-heading text-sm font-bold text-charcoal mt-0.5">
                      {item.productName}
                    </h4>
                  </div>
                  {item.verdict && (
                    <Badge
                      variant={
                        item.verdict === 'good_fit'
                          ? 'good'
                          : item.verdict === 'avoid'
                          ? 'avoid'
                          : 'caution'
                      }
                      className="text-[10px] capitalize font-medium shrink-0"
                    >
                      {item.verdict.replace(/_/g, ' ')}
                    </Badge>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-border">
                  <button
                    type="button"
                    onClick={() => handleLoadIntoCompare(item, 'A')}
                    className="rounded-lg bg-cream hover:bg-cream-dark px-2.5 py-1 text-[11px] font-semibold text-charcoal border border-border transition-colors"
                  >
                    Compare as 1
                  </button>
                  <button
                    type="button"
                    onClick={() => handleLoadIntoCompare(item, 'B')}
                    className="rounded-lg bg-cream hover:bg-cream-dark px-2.5 py-1 text-[11px] font-semibold text-charcoal border border-border transition-colors"
                  >
                    Compare as 2
                  </button>
                  <Link
                    href={`/research?q=${encodeURIComponent(item.productName)}`}
                    className="rounded-lg bg-cream hover:bg-cream-dark px-2.5 py-1 text-[11px] font-medium text-charcoal border border-border transition-colors"
                  >
                    Research
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleRemoveFromWishlist(item.id)}
                    className="ml-auto text-xs text-charcoal-lighter hover:text-terracotta p-1"
                    title="Remove from wishlist"
                  >
                    ✕
                  </button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
