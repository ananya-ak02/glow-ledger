import { describe, it, expect } from 'vitest';
import {
  searchPopularProducts,
  POPULAR_PRODUCTS,
  POPULAR_PRODUCT_CATEGORIES,
} from './popular-products';

describe('Popular Products Catalog & Search', () => {
  it('should contain a curated catalog of popular skincare products', () => {
    expect(POPULAR_PRODUCTS.length).toBeGreaterThan(50);
  });

  it('should find exact and fuzzy matches for well-known products', () => {
    const ceraveMatches = searchPopularProducts('cerave hydrating');
    expect(ceraveMatches.length).toBeGreaterThan(0);
    expect(ceraveMatches[0].name.toLowerCase()).toContain('cerave');
    expect(ceraveMatches[0].category).toBe('Cleanser');

    const ordinaryMatches = searchPopularProducts('ordinary niacinamide');
    expect(ordinaryMatches.length).toBeGreaterThan(0);
    expect(ordinaryMatches[0].brand).toBe('The Ordinary');
    expect(ordinaryMatches[0].category).toBe('Serum / Ampoule');
  });

  it('should return matching products when searching by brand or keyword', () => {
    const sunscreenMatches = searchPopularProducts('anthelios');
    expect(sunscreenMatches.length).toBeGreaterThan(0);
    expect(sunscreenMatches[0].category).toBe('Sunscreen');

    const bhaMatches = searchPopularProducts('paula choice 2% bha');
    expect(bhaMatches.length).toBeGreaterThan(0);
    expect(bhaMatches[0].category).toBe('Exfoliant / Acid');
  });

  it('should return empty array for completely unrelated query', () => {
    const randomMatches = searchPopularProducts('zyxwvu123456789');
    expect(randomMatches).toEqual([]);
  });

  it('should cover all essential routine categories', () => {
    const categories = new Set(POPULAR_PRODUCTS.map((p) => p.category));
    expect(categories.has('Cleanser')).toBe(true);
    expect(categories.has('Moisturizer')).toBe(true);
    expect(categories.has('Sunscreen')).toBe(true);
    expect(categories.has('Serum / Ampoule')).toBe(true);
    expect(categories.has('Exfoliant / Acid')).toBe(true);
  });
});
