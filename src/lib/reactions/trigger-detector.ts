import type { UserReaction } from '@/types/database';

export interface SuspectedTrigger {
  ingredient: string;
  reactionCount: number;
  products: string[];
  reactionTypes: string[];
  confidence: 'high' | 'moderate' | 'low';
  recommendation: string;
}

/**
 * Normalize ingredient name for comparison
 */
function normalizeName(name: string): string {
  return name.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '');
}

/**
 * Auto-detect repeated trigger ingredients across logged negative reactions.
 * Uses deterministic frequency analysis on suspected ingredients and product formulas (0 AI tokens).
 */
export function detectRepeatedTriggers(
  reactions: Pick<UserReaction, 'product_name' | 'reaction_type' | 'suspected_ingredients'>[],
  productIngredientsMap?: Record<string, string[]>
): SuspectedTrigger[] {
  if (!reactions || reactions.length === 0) return [];

  const ingredientMap: Record<
    string,
    {
      reactionCount: number;
      products: Set<string>;
      reactionTypes: Set<string>;
      rawName: string;
    }
  > = {};

  for (const reaction of reactions) {
    const directSuspects = reaction.suspected_ingredients || [];
    const formulaIngredients =
      productIngredientsMap?.[reaction.product_name] || [];

    // Combine directly tagged suspects with known formula ingredients
    const allCandidates = [
      ...directSuspects,
      ...formulaIngredients.filter((i) =>
        /fragrance|parfum|alcohol|oil|niacinamide|salicylic|retin|glycolic/i.test(i)
      ),
    ];

    for (const rawIng of allCandidates) {
      const normalized = normalizeName(rawIng);
      if (!normalized || normalized.length < 3) continue;

      if (!ingredientMap[normalized]) {
        ingredientMap[normalized] = {
          reactionCount: 0,
          products: new Set(),
          reactionTypes: new Set(),
          rawName: rawIng.trim(),
        };
      }

      ingredientMap[normalized].reactionCount += 1;
      ingredientMap[normalized].products.add(reaction.product_name);
      ingredientMap[normalized].reactionTypes.add(reaction.reaction_type);
    }
  }

  // Filter and sort by recurrence
  const results: SuspectedTrigger[] = [];

  for (const [_, data] of Object.entries(ingredientMap)) {
    const productCount = data.products.size;
    if (productCount === 0) continue;

    // High confidence if it appeared across >= 2 different products or was directly tagged multiple times
    const confidence: 'high' | 'moderate' | 'low' =
      productCount >= 2 || data.reactionCount >= 3
        ? 'high'
        : data.reactionCount >= 2
        ? 'moderate'
        : 'low';

    let recommendation = `Appears in ${data.reactionCount} reaction log(s).`;
    if (confidence === 'high') {
      recommendation = `Co-occurs across ${productCount} flagged products. We strongly advise patch-testing formulas containing this ingredient or checking for lower concentrations.`;
    } else if (confidence === 'moderate') {
      recommendation = `Repeat trigger suspect. Monitor for signs of redness or flushing when using.`;
    }

    results.push({
      ingredient: data.rawName,
      reactionCount: data.reactionCount,
      products: Array.from(data.products),
      reactionTypes: Array.from(data.reactionTypes),
      confidence,
      recommendation,
    });
  }

  return results.sort((a, b) => b.reactionCount - a.reactionCount);
}
