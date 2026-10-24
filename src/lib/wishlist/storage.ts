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
    if (!raw) return [];
    const list: WishlistItemStored[] = JSON.parse(raw);

    // Clean out old hardcoded demo items (unprompted seeded items)
    const isSeededDemo = (w: WishlistItemStored) =>
      !w.synthesis &&
      ((w.productName === 'Skin Perfecting 2% BHA Liquid Exfoliant' && w.brand === "Paula's Choice") ||
        (w.productName === 'Moisturizing Cream' && w.brand === 'CeraVe'));

    const realItems = list.filter((w) => !isSeededDemo(w));
    if (realItems.length !== list.length) {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(realItems));
    }
    return realItems;
  } catch {
    return [];
  }
}

export function isProductInWishlist(productName: string): boolean {
  const current = getLocalWishlist();
  return current.some(
    (i) => i.productName.toLowerCase() === productName.trim().toLowerCase()
  );
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
  const scoreMap = { good_fit: 3, use_with_caution: 2, avoid: 1 };
  const scoreA = scoreMap[productA.verdict || 'good_fit'];
  const scoreB = scoreMap[productB.verdict || 'good_fit'];

  let winnerText = 'Both products are solid options. Choose based on your preferred texture and daily schedule.';
  let winner: 'A' | 'B' | 'tie' = 'tie';

  if (scoreA > scoreB) {
    winner = 'A';
    winnerText = `${productA.productName} is rated as a better fit for your current skin barrier and concerns.`;
  } else if (scoreB > scoreA) {
    winner = 'B';
    winnerText = `${productB.productName} is rated as a better fit for your current skin barrier and concerns.`;
  }

  return {
    winner,
    winnerText,
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
      flags: productA.personalization?.flags || [],
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
      flags: productB.personalization?.flags || [],
    },
  };
}
