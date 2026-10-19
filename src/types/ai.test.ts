import { describe, it, expect } from 'vitest';
import {
  IngredientExtractionSchema,
  RoutineAnalysisSchema,
  ProductSynthesisSchema,
  PersonalizationSchema,
} from './ai';

describe('AI Output Zod Schemas', () => {
  it('validates ingredient extraction output', () => {
    const validData = {
      product_name: 'Hyaluronic Acid 2% + B5',
      brand: 'The Ordinary',
      ingredients: [
        { name: 'Aqua (Water)', function: 'solvent' },
        { name: 'Sodium Hyaluronate', concentration: '2%', function: 'humectant' },
        { name: 'Panthenol', function: 'soothing' },
      ],
      category: 'serum',
      confidence: 0.95,
    };

    const parsed = IngredientExtractionSchema.parse(validData);
    expect(parsed.product_name).toBe('Hyaluronic Acid 2% + B5');
    expect(parsed.ingredients.length).toBe(3);
    expect(parsed.confidence).toBe(0.95);
  });

  it('rejects invalid confidence outside 0-1 range in ingredient extraction', () => {
    const invalidData = {
      product_name: 'Test Serum',
      ingredients: [{ name: 'Water' }],
      confidence: 1.5,
    };

    expect(() => IngredientExtractionSchema.parse(invalidData)).toThrow();
  });

  it('validates routine analysis schema', () => {
    const validRoutine = {
      overall_assessment: 'Your routine provides solid hydration and sun protection.',
      correct: [
        { step: 'Cleanser', reason: 'Gentle pH-balanced wash protects barrier' },
        { step: 'Sunscreen', reason: 'Broad-spectrum SPF 50 is essential' },
      ],
      issues: [
        {
          step: 'Toner + Serum',
          issue: 'Both contain high levels of AHA',
          severity: 'moderate' as const,
          suggestion: 'Drop the toner on nights you use the serum',
        },
      ],
      redundant: [
        {
          steps: ['Hydrating Serum A', 'Hydrating Essence B'],
          reason: 'Both primarily supply hyaluronic acid',
          keep: 'Hydrating Serum A',
        },
      ],
      missing: [
        {
          category: 'antioxidant',
          reason: 'Protects against daytime environmental free radicals',
          suggested_ingredients: ['Vitamin C', 'Niacinamide'],
          priority: 'recommended' as const,
        },
      ],
      layering_order: [
        { step: 1, product: 'Gentle Cleanser', category: 'cleanser' },
        { step: 2, product: 'Niacinamide 10%', category: 'serum' },
        { step: 3, product: 'Ceramide Cream', category: 'moisturizer' },
      ],
      conflicts: [
        {
          ingredient_a: 'Retinol',
          ingredient_b: 'Glycolic Acid',
          issue: 'Risk of irritation when layered directly',
          recommendation: 'Alternate PM routines',
        },
      ],
      version: '1.0',
    };

    const parsed = RoutineAnalysisSchema.parse(validRoutine);
    expect(parsed.issues.length).toBe(1);
    expect(parsed.layering_order.length).toBe(3);
  });

  it('validates product synthesis schema', () => {
    const validSynthesis = {
      product_name: 'Barrier Relief Moisturizer',
      brand: 'KraveBeauty',
      summary: 'A skin barrier restorative moisturizer formulated with tamanu oil and ceramides.',
      pros: ['Deeply restorative', 'Calms redness', 'Fragrance-free'],
      cons: ['Distinct tamanu scent', 'Rich texture may feel heavy for oily skin'],
      best_for: ['Compromised barriers', 'Dry and sensitive skin types'],
      not_recommended_for: ['Very oily skin in humid climates'],
      key_ingredients: [
        { name: 'Tamanu Oil', function: 'regenerative', benefit: 'Skin barrier repair' },
        { name: 'Ceramides', function: 'lipid restoration', benefit: 'Strengthens intercellular matrix' },
      ],
      potential_irritants: [
        { name: 'Tamanu Oil', risk_level: 'low' as const, note: 'Nut tree derivative; rare sensitivity' },
      ],
      review_summary: {
        overall_sentiment: 'positive' as const,
        common_praises: ['Saved my over-exfoliated skin', 'Instant calming'],
        common_complaints: ['Nutty earthy smell'],
        source_count: 24,
        trust_notes: ['High organic discussion on r/SkincareAddiction with authentic user before/after mentions'],
      },
      data_confidence: 'high' as const,
      sources_used: ['reddit.com/r/SkincareAddiction', 'openbeautyfacts.org'],
      version: '1.0',
    };

    const parsed = ProductSynthesisSchema.parse(validSynthesis);
    expect(parsed.data_confidence).toBe('high');
    expect(parsed.key_ingredients.length).toBe(2);
  });

  it('validates personalization schema and verdicts', () => {
    const validPersonalization = {
      verdict: 'good_fit' as const,
      confidence: 0.9,
      fit_reasons: [
        'Formulated with ceramides which directly target your dehydrated skin concern',
        'Fragrance-free formula matches your fragrance sensitivity preference',
      ],
      caution_reasons: [],
      avoid_reasons: [],
      routine_placement: {
        suggested_step: 'Moisturizer step in PM routine',
        time_of_day: 'pm' as const,
        frequency: 'Every night',
        replaces: 'Light Gel Cream',
        intro_plan: 'Patch test behind the ear for 24h, then introduce nightly',
      },
      ingredient_matches: [
        { ingredient: 'Ceramides', relevance: 'Addresses dehydration barrier damage' },
      ],
      flags: [],
      version: '1.0',
    };

    const parsed = PersonalizationSchema.parse(validPersonalization);
    expect(parsed.verdict).toBe('good_fit');
    expect(parsed.confidence).toBe(0.9);
  });
});
