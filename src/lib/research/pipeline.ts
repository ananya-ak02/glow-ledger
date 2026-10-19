import { callAI } from '@/lib/ai/client';
import { ProductSynthesisSchema, PersonalizationSchema } from '@/types/ai';
import {
  buildProductSynthesisPrompt,
  generateDeterministicProductSynthesis,
} from '@/lib/ai/prompts/product-synthesis';
import {
  buildPersonalizationPrompt,
  generateDeterministicPersonalization,
} from '@/lib/ai/prompts/personalization';
import { searchOpenBeautyFacts } from '@/lib/research/sources/open-beauty-facts';
import { searchCommunityReviews } from '@/lib/research/sources/search-reddit';
import {
  checkConflicts,
  checkPregnancySafety,
  checkUserSensitivities,
} from '@/lib/ingredients/conflict-rules';
import { createAdminClient } from '@/lib/supabase/admin';
import type { OnboardingState } from '@/types/onboarding';
import type { ProductSynthesis, Personalization } from '@/types/ai';
import type { IngredientConflict, VerdictFlag } from '@/types/database';

export interface ResearchPipelineInput {
  productName: string;
  brand?: string;
  userPastedIngredients?: string;
  userPastedReviews?: string;
  userProfile: OnboardingState;
  onProgress?: (step: string) => void;
}

export interface ResearchPipelineResult {
  synthesis: ProductSynthesis;
  personalization: Personalization;
  isCached: boolean;
  sourceLinks: string[];
  conflicts: IngredientConflict[];
  flags: VerdictFlag[];
  ingredientsList: string[];
}

/**
 * Execute the two-stage research pipeline:
 * Stage A: Shared Product Research (Cached in Postgres)
 * Stage B: Lightweight Per-User Personalization
 */
export async function executeResearchPipeline({
  productName,
  brand,
  userPastedIngredients,
  userPastedReviews,
  userProfile,
  onProgress,
}: ResearchPipelineInput): Promise<ResearchPipelineResult> {
  const normalizedName = productName.trim().toLowerCase();

  // ─── STAGE 1: Check Shared Cache in Postgres ─────────────
  onProgress?.('Checking database cache for existing research...');
  let cachedSynthesis: ProductSynthesis | null = null;
  let cachedSourceLinks: string[] = [];
  let cachedIngredients: string[] = [];

  try {
    const supabase = createAdminClient();
    const { data: cachedProduct } = await supabase
      .from('products')
      .select('id, ingredient_list, research_reports(*)')
      .ilike('name', `%${normalizedName}%`)
      .limit(1)
      .maybeSingle();

    if (cachedProduct && cachedProduct.research_reports?.length > 0) {
      const report = cachedProduct.research_reports[0];
      const isExpired = new Date(report.expires_at) < new Date();

      if (!isExpired && report.ai_synthesis && report.is_valid) {
        cachedSynthesis = report.ai_synthesis as ProductSynthesis;
        cachedSourceLinks = report.source_links || [];
        cachedIngredients = cachedProduct.ingredient_list || [];
      }
    }
  } catch {
    // If Supabase cache read fails or unconfigured, proceed to live resolve
  }

  let finalSynthesis = cachedSynthesis;
  let finalSourceLinks = cachedSourceLinks;
  let finalIngredients = cachedIngredients;
  let isCacheHit = Boolean(cachedSynthesis);

  // ─── STAGE 2: If Cache Miss, Perform Shared Research ─────
  if (!finalSynthesis) {
    onProgress?.('Resolving ingredients from Open Beauty Facts & database...');

    // 2a. Resolve Ingredients
    let ingredientsList: string[] = [];
    if (userPastedIngredients && userPastedIngredients.trim()) {
      ingredientsList = userPastedIngredients
        .split(/[,;\n•]/)
        .map((s) => s.trim())
        .filter((s) => s.length > 1);
    } else {
      const obfResult = await searchOpenBeautyFacts(productName);
      if (obfResult && obfResult.ingredientsList.length > 0) {
        ingredientsList = obfResult.ingredientsList;
        if (!brand && obfResult.brand) brand = obfResult.brand;
      }
    }

    finalIngredients = ingredientsList;

    // 2b. Gather Community Reviews & Reddit Discussions
    onProgress?.('Searching Reddit and public skincare communities...');
    const searchRes = await searchCommunityReviews(productName, userPastedReviews);
    finalSourceLinks = searchRes.sourceLinks;

    // 2c. Execute Stage A Synthesis (Gemini 2.0 Flash)
    onProgress?.('Synthesizing product intelligence & review sentiment...');
    const { systemInstruction, userPrompt } = buildProductSynthesisPrompt(
      productName,
      brand,
      ingredientsList,
      searchRes.redditSnippets,
      searchRes.reviewSnippets,
      searchRes.sourceLinks
    );

    const synthResult = await callAI({
      task: 'product_synthesis',
      prompt: userPrompt,
      systemInstruction,
      schema: ProductSynthesisSchema,
      fallbackMockGenerator: () =>
        generateDeterministicProductSynthesis(productName, brand, ingredientsList),
    });

    finalSynthesis = synthResult.data;

    // 2d. Persist to Shared Postgres Cache
    try {
      const supabase = createAdminClient();
      const { data: newProd } = await supabase
        .from('products')
        .insert({
          name: productName,
          brand: brand || null,
          ingredient_list: ingredientsList,
          category: finalSynthesis.best_for?.[0] || 'Treatment',
        })
        .select('id')
        .single();

      if (newProd) {
        await supabase.from('research_reports').insert({
          product_id: newProd.id,
          source_links: finalSourceLinks,
          reddit_snippets: searchRes.redditSnippets,
          review_snippets: searchRes.reviewSnippets,
          ai_synthesis: finalSynthesis,
          model_used: synthResult.modelUsed,
          token_count: 800,
        });
      }
    } catch {
      // Non-fatal if cache write fails
    }
  }

  // ─── STAGE 3: Deterministic Safety & Conflict Engine ─────
  onProgress?.('Checking conflicts with your current AM/PM routine...');

  const activeRoutineProducts = [
    ...userProfile.am_routine.map((p) => p.product_name),
    ...userProfile.pm_routine.map((p) => p.product_name),
  ];

  const routineConflicts = checkConflicts(
    finalIngredients.length > 0 ? finalIngredients : [productName],
    activeRoutineProducts
  );

  const pregnancyFlags = userProfile.is_pregnant
    ? checkPregnancySafety(finalIngredients.length > 0 ? finalIngredients : [productName])
    : [];

  const allergyFlags = checkUserSensitivities(
    finalIngredients.length > 0 ? finalIngredients : [productName],
    userProfile.known_allergies,
    userProfile.past_reactions.flatMap((r) => r.suspected_ingredients)
  );

  const allFlags = [...pregnancyFlags, ...allergyFlags];

  // ─── STAGE 4: Per-User Personalization (Flash-Lite) ──────
  onProgress?.('Tailoring personalized verdict to your skin profile...');

  const { systemInstruction: pSys, userPrompt: pUser } = buildPersonalizationPrompt(
    finalSynthesis,
    userProfile,
    routineConflicts,
    allFlags
  );

  const personalResult = await callAI({
    task: 'personalization',
    prompt: pUser,
    systemInstruction: pSys,
    schema: PersonalizationSchema,
    fallbackMockGenerator: () =>
      generateDeterministicPersonalization(
        finalSynthesis!,
        userProfile,
        routineConflicts,
        allFlags
      ),
  });

  return {
    synthesis: finalSynthesis,
    personalization: personalResult.data,
    isCached: isCacheHit,
    sourceLinks: finalSourceLinks,
    conflicts: routineConflicts,
    flags: allFlags,
    ingredientsList: finalIngredients,
  };
}
