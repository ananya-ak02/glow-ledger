import type { IngredientConflict, VerdictFlag } from '@/types/database';
import { PREGNANCY_UNSAFE_INGREDIENTS } from '@/config/safety';

/**
 * Deterministic ingredient conflict checking.
 * NO LLM calls — pure rule-based logic.
 *
 * Rules sourced from dermatological guidelines:
 * - Retinol + AHA/BHA: Don't use together (irritation risk)
 * - Retinol + Vitamin C: Use at different times of day
 * - Niacinamide + Low-pH Vitamin C: Can cause flushing
 * - AHA/BHA + Vitamin C: Wait between application
 * - Retinol + Benzoyl Peroxide: BP can deactivate retinol
 * - Multiple exfoliants: Over-exfoliation risk
 * - Retinol + Retinol: Don't double up
 */

// ─── Types ───────────────────────────────────────────────

interface ConflictRule {
  id: string;
  ingredientA: string[];
  ingredientB: string[];
  conflictType: string;
  severity: 'warning' | 'avoid';
  recommendation: string;
  explanation: string;
}

// ─── Rule Definitions ────────────────────────────────────

const CONFLICT_RULES: ConflictRule[] = [
  {
    id: 'retinol_aha_bha',
    ingredientA: [
      'retinol', 'retinoid', 'tretinoin', 'adapalene',
      'tazarotene', 'retinaldehyde', 'retinal',
    ],
    ingredientB: [
      'aha', 'alpha hydroxy acid', 'glycolic acid', 'lactic acid',
      'mandelic acid', 'bha', 'beta hydroxy acid', 'salicylic acid',
    ],
    conflictType: 'irritation_risk',
    severity: 'avoid',
    recommendation:
      'Use on alternate nights, or AHA/BHA in AM and retinol in PM.',
    explanation:
      'Both are potent actives that can cause significant irritation, peeling, and compromised skin barrier when used together.',
  },
  {
    id: 'retinol_vitamin_c',
    ingredientA: [
      'retinol', 'retinoid', 'tretinoin', 'adapalene',
      'retinaldehyde', 'retinal',
    ],
    ingredientB: [
      'vitamin c', 'ascorbic acid', 'l-ascorbic acid',
      'ascorbyl glucoside', 'ascorbyl tetraisopalmitate',
      'ethylated ascorbic acid',
    ],
    conflictType: 'timing_conflict',
    severity: 'warning',
    recommendation:
      'Use Vitamin C in the morning and retinol at night for best results.',
    explanation:
      'While not dangerous together, using them at different times optimizes efficacy. Vitamin C works best in AM (antioxidant protection) and retinol in PM.',
  },
  {
    id: 'niacinamide_vitamin_c',
    ingredientA: ['niacinamide', 'nicotinamide', 'vitamin b3'],
    ingredientB: ['vitamin c', 'ascorbic acid', 'l-ascorbic acid'],
    conflictType: 'flushing_risk',
    severity: 'warning',
    recommendation:
      'Generally safe together in modern formulations. If flushing occurs, use at different times.',
    explanation:
      'Older research suggested issues, but modern formulations are typically fine. Pure L-ascorbic acid at very low pH may cause temporary flushing with niacinamide.',
  },
  {
    id: 'retinol_benzoyl_peroxide',
    ingredientA: [
      'retinol', 'retinoid', 'tretinoin', 'retinaldehyde', 'retinal',
    ],
    ingredientB: ['benzoyl peroxide', 'bpo'],
    conflictType: 'deactivation',
    severity: 'avoid',
    recommendation:
      'Use at different times — benzoyl peroxide in AM, retinol in PM. Or use on alternate days.',
    explanation:
      'Benzoyl peroxide can oxidize and deactivate retinol, making both less effective. Exception: adapalene is stable with BP.',
  },
  {
    id: 'aha_bha_vitamin_c',
    ingredientA: [
      'aha', 'glycolic acid', 'lactic acid', 'mandelic acid',
      'bha', 'salicylic acid',
    ],
    ingredientB: ['vitamin c', 'ascorbic acid', 'l-ascorbic acid'],
    conflictType: 'over_exfoliation',
    severity: 'warning',
    recommendation:
      'Can work at similar pH levels, but may cause irritation for sensitive skin. Start with alternating days.',
    explanation:
      'Both are acidic actives. Using together increases irritation risk, especially for sensitive skin.',
  },
  {
    id: 'multiple_exfoliants',
    ingredientA: ['aha', 'glycolic acid', 'lactic acid', 'mandelic acid'],
    ingredientB: ['bha', 'salicylic acid'],
    conflictType: 'over_exfoliation',
    severity: 'warning',
    recommendation:
      'Avoid using multiple exfoliants in the same routine. Alternate between them or use a product that combines them at safe concentrations.',
    explanation:
      'Stacking exfoliants dramatically increases risk of over-exfoliation, barrier damage, and irritation.',
  },
  {
    id: 'aha_bha_physical_scrub',
    ingredientA: [
      'aha', 'glycolic acid', 'lactic acid', 'bha', 'salicylic acid',
    ],
    ingredientB: ['physical scrub', 'walnut shell', 'apricot kernel', 'microbeads'],
    conflictType: 'over_exfoliation',
    severity: 'avoid',
    recommendation:
      'Never combine chemical and physical exfoliation in the same session.',
    explanation:
      'Double exfoliation causes micro-tears and severe barrier damage.',
  },
  {
    id: 'vitamin_c_copper_peptides',
    ingredientA: ['vitamin c', 'ascorbic acid', 'l-ascorbic acid'],
    ingredientB: ['copper peptides', 'copper tripeptide', 'ghk-cu'],
    conflictType: 'deactivation',
    severity: 'avoid',
    recommendation:
      'Use at different times of day. Copper can oxidize Vitamin C.',
    explanation:
      'Copper ions can accelerate the oxidation of ascorbic acid, reducing its efficacy.',
  },
  {
    id: 'retinol_retinol',
    ingredientA: [
      'retinol', 'retinoid', 'tretinoin', 'adapalene',
      'tazarotene', 'retinaldehyde', 'retinal',
    ],
    ingredientB: [
      'retinol', 'retinoid', 'tretinoin', 'adapalene',
      'tazarotene', 'retinaldehyde', 'retinal',
    ],
    conflictType: 'redundancy',
    severity: 'avoid',
    recommendation:
      'Never use two retinoid products together. Pick the one best suited to your needs.',
    explanation:
      'Doubling up on retinoids causes severe irritation, peeling, and does not increase benefits.',
  },
];

// ─── Layering Order ──────────────────────────────────────

/** Correct layering order for skincare products (thinnest → thickest) */
export const LAYERING_ORDER: Record<string, number> = {
  'oil cleanser': 1,
  'water cleanser': 2,
  'cleanser': 2,
  'micellar water': 2,
  'exfoliant': 3,
  'toner': 4,
  'essence': 5,
  'serum': 6,
  'ampoule': 7,
  'treatment': 8,
  'eye cream': 9,
  'moisturizer': 10,
  'face oil': 11,
  'sunscreen': 12,
  'sleeping mask': 13,
};

// ─── Helpers ─────────────────────────────────────────────

/** Normalize ingredient name for matching */
function normalizeIngredient(name: string): string {
  return name.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '');
}

/** Check if an ingredient matches any entry in a group */
function matchesIngredientGroup(ingredient: string, group: string[]): boolean {
  const normalized = normalizeIngredient(ingredient);
  return group.some((g) => {
    const normalizedGroup = normalizeIngredient(g);
    return (
      normalized.includes(normalizedGroup) ||
      normalizedGroup.includes(normalized)
    );
  });
}

// ─── Public API ──────────────────────────────────────────

/**
 * Check for conflicts between two lists of ingredients.
 * Returns all detected conflicts.
 */
export function checkConflicts(
  ingredientsA: string[],
  ingredientsB: string[]
): IngredientConflict[] {
  const conflicts: IngredientConflict[] = [];
  const seenRules = new Set<string>();

  for (const rule of CONFLICT_RULES) {
    for (const ingA of ingredientsA) {
      for (const ingB of ingredientsB) {
        const aMatchesA = matchesIngredientGroup(ingA, rule.ingredientA);
        const bMatchesB = matchesIngredientGroup(ingB, rule.ingredientB);
        const aMatchesB = matchesIngredientGroup(ingA, rule.ingredientB);
        const bMatchesA = matchesIngredientGroup(ingB, rule.ingredientA);

        if ((aMatchesA && bMatchesB) || (aMatchesB && bMatchesA)) {
          // For self-referencing rules (retinol+retinol), only flag if different products
          if (rule.id === 'retinol_retinol' && ingA === ingB) continue;

          if (!seenRules.has(rule.id)) {
            seenRules.add(rule.id);
            conflicts.push({
              ingredient_a: ingA,
              ingredient_b: ingB,
              conflict_type: rule.conflictType,
              severity: rule.severity,
              recommendation: rule.recommendation,
            });
          }
        }
      }
    }
  }

  return conflicts;
}

/**
 * Check all products in a routine for inter-product conflicts.
 */
export function checkRoutineConflicts(
  products: { name: string; ingredients: string[] }[]
): { productA: string; productB: string; conflicts: IngredientConflict[] }[] {
  const results: {
    productA: string;
    productB: string;
    conflicts: IngredientConflict[];
  }[] = [];

  for (let i = 0; i < products.length; i++) {
    for (let j = i + 1; j < products.length; j++) {
      const conflicts = checkConflicts(
        products[i].ingredients,
        products[j].ingredients
      );
      if (conflicts.length > 0) {
        results.push({
          productA: products[i].name,
          productB: products[j].name,
          conflicts,
        });
      }
    }
  }

  return results;
}

/**
 * Check ingredients against pregnancy safety rules.
 * Returns flags for any unsafe ingredients found.
 */
export function checkPregnancySafety(ingredients: string[]): VerdictFlag[] {
  const flags: VerdictFlag[] = [];

  for (const ingredient of ingredients) {
    const normalized = normalizeIngredient(ingredient);
    for (const unsafe of PREGNANCY_UNSAFE_INGREDIENTS) {
      const allNames = [unsafe.name, ...unsafe.aliases];
      if (
        allNames.some((name) => {
          const normalizedName = normalizeIngredient(name);
          return (
            normalized.includes(normalizedName) ||
            normalizedName.includes(normalized)
          );
        })
      ) {
        flags.push({
          type: 'pregnancy',
          message: unsafe.reason,
          ingredient: ingredient,
        });
        break; // Don't double-flag the same ingredient
      }
    }
  }

  return flags;
}

/**
 * Check ingredients against user's known allergies and reaction history.
 */
export function checkUserSensitivities(
  ingredients: string[],
  allergies: string[],
  reactionIngredients: string[]
): VerdictFlag[] {
  const flags: VerdictFlag[] = [];

  for (const ingredient of ingredients) {
    const normalized = normalizeIngredient(ingredient);

    // Check allergies
    for (const allergy of allergies) {
      if (
        normalizeIngredient(allergy) === normalized ||
        normalized.includes(normalizeIngredient(allergy))
      ) {
        flags.push({
          type: 'allergy',
          message: `You've listed "${allergy}" as a known allergy. This product contains ${ingredient}.`,
          ingredient,
        });
      }
    }

    // Check past reaction ingredients
    for (const reactionIng of reactionIngredients) {
      if (
        normalizeIngredient(reactionIng) === normalized ||
        normalized.includes(normalizeIngredient(reactionIng))
      ) {
        flags.push({
          type: 'reaction_history',
          message: `You've had a past reaction to "${reactionIng}". This product contains ${ingredient}.`,
          ingredient,
        });
      }
    }
  }

  return flags;
}

/**
 * Suggest correct layering order for a list of products with categories.
 */
export function suggestLayeringOrder(
  products: { name: string; category: string }[]
): { name: string; category: string; suggestedOrder: number }[] {
  return products
    .map((p) => {
      const cat = p.category.toLowerCase().trim();
      let order = LAYERING_ORDER[cat];

      if (order === undefined) {
        for (const [key, val] of Object.entries(LAYERING_ORDER)) {
          if (cat.includes(key) || key.includes(cat)) {
            order = val;
            break;
          }
        }
      }

      return {
        ...p,
        suggestedOrder: order ?? 99,
      };
    })
    .sort((a, b) => a.suggestedOrder - b.suggestedOrder);
}
