import type { ProductSynthesis, Personalization } from '@/types/ai';

export interface WishlistItemStored {
  id: string;
  productName: string;
  brand?: string;
  category: string;
  verdict?: 'good_fit' | 'use_with_caution' | 'avoid';
  synthesis?: ProductSynthesis;
  personalization?: Personalization;
  sourceLinks: string[];
  addedAt: string;
  notes?: string;
}

const WISHLIST_STORAGE_KEY = 'glowledger_wishlist_v1';

export function getLocalWishlist(): WishlistItemStored[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(WISHLIST_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveLocalWishlist(items: WishlistItemStored[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Storage quota
  }
}

export function addToWishlist(item: Omit<WishlistItemStored, 'id' | 'addedAt'>): WishlistItemStored {
  const current = getLocalWishlist();
  const existing = current.find(
    (i) => i.productName.toLowerCase() === item.productName.toLowerCase()
  );

  if (existing) {
    return existing;
  }

  const newItem: WishlistItemStored = {
    ...item,
    id: Math.random().toString(36).substring(2, 9),
    addedAt: new Date().toISOString(),
  };

  const updated = [newItem, ...current];
  saveLocalWishlist(updated);
  return newItem;
}

export function removeFromWishlist(id: string): void {
  const current = getLocalWishlist();
  saveLocalWishlist(current.filter((i) => i.id !== id));
}

/**
 * Compare two products side-by-side reusing their cached reports.
 * Consumes 0 additional search or AI API calls.
 */
export function compareCachedProducts(
  productA: WishlistItemStored,
  productB: WishlistItemStored
) {
  return {
    productA: {
      name: productA.productName,
      brand: productA.brand || 'Brand',
      verdict: productA.verdict || 'good_fit',
      summary: productA.synthesis?.summary || 'Formulated for daily skincare maintenance.',
      pros: productA.synthesis?.pros || [],
      cons: productA.synthesis?.cons || [],
      keyIngredients: productA.synthesis?.key_ingredients || [],
      sentiment: productA.synthesis?.review_summary?.overall_sentiment || 'positive',
      placement: productA.personalization?.routine_placement?.suggested_step || 'Treatment Step',
    },
    productB: {
      name: productB.productName,
      brand: productB.brand || 'Brand',
      verdict: productB.verdict || 'good_fit',
      summary: productB.synthesis?.summary || 'Formulated for daily skincare maintenance.',
      pros: productB.synthesis?.pros || [],
      cons: productB.synthesis?.cons || [],
      keyIngredients: productB.synthesis?.key_ingredients || [],
      sentiment: productB.synthesis?.review_summary?.overall_sentiment || 'positive',
      placement: productB.personalization?.routine_placement?.suggested_step || 'Treatment Step',
    },
  };
}
