import { z } from 'zod';

// ─── Zod Schemas for AI Output Validation ────────────────
// Every LLM response is validated against these schemas
// to ensure structured, type-safe data

export const IngredientExtractionSchema = z.object({
  product_name: z.string(),
  brand: z.string().optional(),
  ingredients: z.array(
    z.object({
      name: z.string(),
      concentration: z.string().optional(),
      function: z.string().optional(),
    })
  ),
  category: z.string().optional(),
  confidence: z.number().min(0).max(1),
});

export type IngredientExtraction = z.infer<typeof IngredientExtractionSchema>;

export const RoutineAnalysisSchema = z.object({
  overall_assessment: z.string(),
  correct: z.array(
    z.object({
      step: z.string(),
      reason: z.string(),
    })
  ),
  issues: z.array(
    z.object({
      step: z.string(),
      issue: z.string(),
      severity: z.enum(['minor', 'moderate', 'major']),
      suggestion: z.string(),
    })
  ),
  redundant: z.array(
    z.object({
      steps: z.array(z.string()),
      reason: z.string(),
      keep: z.string(),
    })
  ),
  missing: z.array(
    z.object({
      category: z.string(),
      reason: z.string(),
      suggested_ingredients: z.array(z.string()),
      priority: z.enum(['essential', 'recommended', 'optional']),
    })
  ),
  layering_order: z.array(
    z.object({
      step: z.number(),
      product: z.string(),
      category: z.string(),
    })
  ),
  conflicts: z.array(
    z.object({
      ingredient_a: z.string(),
      ingredient_b: z.string(),
      issue: z.string(),
      recommendation: z.string(),
    })
  ),
  version: z.string().default('1.0'),
});

export type RoutineAnalysis = z.infer<typeof RoutineAnalysisSchema>;

export const ProductSynthesisSchema = z.object({
  product_name: z.string(),
  brand: z.string().optional(),
  summary: z.string(),
  pros: z.array(z.string()),
  cons: z.array(z.string()),
  best_for: z.array(z.string()),
  not_recommended_for: z.array(z.string()),
  key_ingredients: z.array(
    z.object({
      name: z.string(),
      function: z.string(),
      benefit: z.string(),
      source: z.string().optional(),
    })
  ),
  potential_irritants: z.array(
    z.object({
      name: z.string(),
      risk_level: z.enum(['low', 'moderate', 'high']),
      note: z.string(),
    })
  ),
  review_summary: z.object({
    overall_sentiment: z.enum(['positive', 'mixed', 'negative']),
    common_praises: z.array(z.string()),
    common_complaints: z.array(z.string()),
    source_count: z.number(),
    trust_notes: z.array(z.string()),
  }),
  data_confidence: z.enum(['high', 'medium', 'low']),
  sources_used: z.array(z.string()),
  version: z.string().default('1.0'),
});

export type ProductSynthesis = z.infer<typeof ProductSynthesisSchema>;

export const PersonalizationSchema = z.object({
  verdict: z.enum(['good_fit', 'use_with_caution', 'avoid']),
  confidence: z.number().min(0).max(1),
  fit_reasons: z.array(z.string()),
  caution_reasons: z.array(z.string()),
  avoid_reasons: z.array(z.string()),
  routine_placement: z
    .object({
      suggested_step: z.string(),
      time_of_day: z.enum(['am', 'pm', 'both']),
      frequency: z.string(),
      replaces: z.string().nullable(),
      intro_plan: z.string(),
    })
    .optional(),
  ingredient_matches: z.array(
    z.object({
      ingredient: z.string(),
      relevance: z.string(),
    })
  ),
  flags: z.array(
    z.object({
      type: z.enum([
        'allergy',
        'pregnancy',
        'reaction_history',
        'sensitivity',
        'derm_referral',
      ]),
      message: z.string(),
      ingredient: z.string().optional(),
    })
  ),
  version: z.string().default('1.0'),
});

export type Personalization = z.infer<typeof PersonalizationSchema>;
