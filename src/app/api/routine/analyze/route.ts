import { NextResponse } from 'next/server';
import { RoutineAnalysisSchema } from '@/types/ai';
import { callAI } from '@/lib/ai/client';
import {
  buildRoutineAnalysisPrompt,
  generateDeterministicRoutineAnalysis,
} from '@/lib/ai/prompts/routine-analyzer';
import {
  checkConflicts,
  checkPregnancySafety,
  checkUserSensitivities,
  suggestLayeringOrder,
} from '@/lib/ingredients/conflict-rules';
import type { OnboardingState } from '@/types/onboarding';
import type { IngredientConflict } from '@/types/database';

export async function POST(request: Request) {
  try {
    const body: { state: OnboardingState } = await request.json();
    const state = body.state;

    if (!state) {
      return NextResponse.json({ error: 'Missing profile state' }, { status: 400 });
    }

    // 1. Run Deterministic Rules Engine (Zero LLM Tokens)
    const allProducts = [...state.am_routine, ...state.pm_routine];

    // Extract names as basic proxies for conflict checking
    const conflicts: IngredientConflict[] = [];
    for (let i = 0; i < allProducts.length; i++) {
      for (let j = i + 1; j < allProducts.length; j++) {
        const detected = checkConflicts(
          [allProducts[i].product_name, allProducts[i].category],
          [allProducts[j].product_name, allProducts[j].category]
        );
        conflicts.push(...detected);
      }
    }

    // Pregnancy safety check if active
    const pregnancyFlags = state.is_pregnant
      ? checkPregnancySafety(allProducts.map((p) => p.product_name))
      : [];

    // Allergy check
    const allergyFlags = checkUserSensitivities(
      allProducts.map((p) => p.product_name),
      state.known_allergies,
      state.past_reactions.flatMap((r) => r.suspected_ingredients)
    );

    // Layering calculation for AM and PM separately
    const amLayeringSuggestions = suggestLayeringOrder(
      state.am_routine.map((p) => ({
        name: p.product_name,
        category: p.category,
      }))
    );
    const pmLayeringSuggestions = suggestLayeringOrder(
      state.pm_routine.map((p) => ({
        name: p.product_name,
        category: p.category,
      }))
    );

    // 2. Build Versioned AI Prompt
    const { systemInstruction, userPrompt } = buildRoutineAnalysisPrompt(
      state,
      conflicts,
      {
        am: amLayeringSuggestions,
        pm: pmLayeringSuggestions,
      }
    );

    // 3. Execute Single Synthesis LLM Call (Gemini 2.0 Flash -> Groq Llama 3.3 70B -> Deterministic Fallback)
    const result = await callAI({
      task: 'routine_analysis',
      prompt: userPrompt,
      systemInstruction,
      schema: RoutineAnalysisSchema,
      fallbackMockGenerator: () => generateDeterministicRoutineAnalysis(state, conflicts),
    });

    return NextResponse.json({
      success: true,
      analysis: result.data,
      metadata: {
        modelUsed: result.modelUsed,
        provider: result.provider,
        isMock: result.isMock,
        deterministicConflictsCount: conflicts.length,
        pregnancyFlagsCount: pregnancyFlags.length,
        allergyFlagsCount: allergyFlags.length,
      },
      flags: [...pregnancyFlags, ...allergyFlags],
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Analysis failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
