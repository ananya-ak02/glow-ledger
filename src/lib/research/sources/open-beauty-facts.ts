/**
 * Open Beauty Facts Free API Client
 * Open-source, free cosmetic ingredients database.
 * No API key required; rate-friendly queries.
 */

export interface OBFProduct {
  id: string;
  name: string;
  brand?: string;
  ingredientsText?: string;
  ingredientsList: string[];
  categories?: string[];
  imageUrl?: string;
}

/**
 * Search Open Beauty Facts by product name.
 */
export async function searchOpenBeautyFacts(query: string): Promise<OBFProduct | null> {
  try {
    const encoded = encodeURIComponent(query.trim());
    const url = `https://world.openbeautyfacts.org/cgi/search.pl?search_terms=${encoded}&search_simple=1&action=process&json=1&page_size=3`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000); // 4s timeout for serverless

    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'GlowLedger - Skincare Intelligence - portfolio/demo',
      },
    });
    clearTimeout(timeout);

    if (!res.ok) return null;

    const data = await res.json();
    if (!data?.products || data.products.length === 0) {
      return null;
    }

    // Pick best match with ingredients
    const match = data.products.find(
      (p: { ingredients_text?: string; ingredients_text_en?: string }) =>
        Boolean(p.ingredients_text || p.ingredients_text_en)
    ) || data.products[0];

    const rawIngredients: string =
      match.ingredients_text_en || match.ingredients_text || '';

    // Split ingredients by comma or semicolon
    const ingredientsList = rawIngredients
      ? rawIngredients
          .split(/[,;•\n]/)
          .map((i: string) => i.trim().replace(/^[\*\-\.\s]+/, ''))
          .filter((i: string) => i.length > 1 && !/^(and|contains|with)\s/i.test(i))
      : [];

    return {
      id: match._id || match.code || query,
      name: match.product_name || query,
      brand: match.brands || undefined,
      ingredientsText: rawIngredients || undefined,
      ingredientsList,
      categories: match.categories ? match.categories.split(',').map((c: string) => c.trim()) : [],
      imageUrl: match.image_url || undefined,
    };
  } catch {
    // Graceful degradation if OBF is unreachable or times out
    return null;
  }
}
