import { describe, it, expect } from 'vitest';
import { detectRepeatedTriggers } from './trigger-detector';

describe('Reaction & Trigger Detection Engine', () => {
  it('returns empty array when no reactions are logged', () => {
    const triggers = detectRepeatedTriggers([]);
    expect(triggers).toEqual([]);
  });

  it('detects repeated trigger ingredient across multiple flagged products with high confidence', () => {
    const reactions = [
      {
        product_name: 'Brightening Niacinamide Serum',
        reaction_type: 'burning' as const,
        suspected_ingredients: ['Niacinamide'],
      },
      {
        product_name: 'Barrier Cream with Niacinamide',
        reaction_type: 'irritation' as const,
        suspected_ingredients: ['Niacinamide', 'Ceramides'],
      },
    ];

    const triggers = detectRepeatedTriggers(reactions);
    expect(triggers.length).toBeGreaterThan(0);

    const niacinamideTrigger = triggers.find((t) => t.ingredient.toLowerCase() === 'niacinamide');
    expect(niacinamideTrigger).toBeDefined();
    expect(niacinamideTrigger?.reactionCount).toBe(2);
    expect(niacinamideTrigger?.products.length).toBe(2);
    expect(niacinamideTrigger?.confidence).toBe('high');
    expect(niacinamideTrigger?.recommendation).toContain('Co-occurs across 2 flagged products');
  });

  it('detects fragrant essential oils when multiple products cause reactions', () => {
    const reactions = [
      {
        product_name: 'Botanical Face Oil',
        reaction_type: 'allergy' as const,
        suspected_ingredients: ['Fragrance', 'Lavender Oil'],
      },
      {
        product_name: 'Scented Cleansing Balm',
        reaction_type: 'breakout' as const,
        suspected_ingredients: ['Fragrance'],
      },
      {
        product_name: 'Aroma Night Cream',
        reaction_type: 'irritation' as const,
        suspected_ingredients: ['Fragrance'],
      },
    ];

    const triggers = detectRepeatedTriggers(reactions);
    const fragrance = triggers.find((t) => t.ingredient.toLowerCase() === 'fragrance');
    expect(fragrance).toBeDefined();
    expect(fragrance?.reactionCount).toBe(3);
    expect(fragrance?.confidence).toBe('high');
  });
});
