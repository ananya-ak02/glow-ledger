import { describe, it, expect } from 'vitest';
import {
  buildRoutineAnalysisPrompt,
  generateDeterministicRoutineAnalysis,
  ROUTINE_ANALYZER_PROMPT_VERSION,
} from './routine-analyzer';
import { RoutineAnalysisSchema } from '@/types/ai';
import { INITIAL_ONBOARDING_STATE, type OnboardingState } from '@/types/onboarding';

describe('Routine Analyzer Prompt & Deterministic Fallback', () => {
  const sampleState: OnboardingState = {
    ...INITIAL_ONBOARDING_STATE,
    skin_type: 'dry',
    age_range: '25-34',
    climate: 'arid',
    is_pregnant: true,
    am_routine: [
      { id: '1', product_name: 'Gentle Cleanser', category: 'Cleanser', frequency: 'Daily' },
      { id: '2', product_name: 'Hyaluronic Serum', category: 'Serum', frequency: 'Daily' },
    ],
    pm_routine: [
      { id: '3', product_name: 'Gentle Cleanser', category: 'Cleanser', frequency: 'Daily' },
      { id: '4', product_name: 'Retinol 0.5%', category: 'Treatment', frequency: 'Daily' },
    ],
    concerns: [{ type: 'dehydration', severity: 'moderate', affected_areas: ['Cheeks'] }],
  };

  const sampleConflicts = [
    {
      ingredient_a: 'Retinol',
      ingredient_b: 'AHA',
      conflict_type: 'irritation_risk',
      severity: 'avoid' as const,
      recommendation: 'Use on alternate nights',
    },
  ];

  it('builds prompt with version and strict injection defense boundaries', () => {
    const { systemInstruction, userPrompt } = buildRoutineAnalysisPrompt(
      sampleState,
      sampleConflicts,
      [{ name: 'Gentle Cleanser', category: 'Cleanser', suggestedOrder: 1 }]
    );

    expect(systemInstruction).toContain('Recommend INGREDIENT TYPES first');
    expect(systemInstruction).toContain('<USER_SKIN_DATA>');
    expect(userPrompt).toContain('Skin Type: dry');
    expect(userPrompt).toContain('Pregnancy / Nursing Mode: ACTIVE');
    expect(userPrompt).toContain('Retinol + AHA');
    expect(userPrompt).toContain(ROUTINE_ANALYZER_PROMPT_VERSION);
  });

  it('generates deterministic analysis conforming strictly to RoutineAnalysisSchema', () => {
    const fallback = generateDeterministicRoutineAnalysis(sampleState, sampleConflicts);

    const parsed = RoutineAnalysisSchema.parse(fallback);
    expect(parsed.version).toBe(ROUTINE_ANALYZER_PROMPT_VERSION);
    expect(parsed.overall_assessment.length).toBeGreaterThan(10);
    expect(parsed.issues.length).toBeGreaterThan(0);

    // Missing sunscreen should be flagged as essential
    const missingSunscreen = parsed.missing.find((m) =>
      m.category.toLowerCase().includes('sunscreen')
    );
    expect(missingSunscreen).toBeDefined();
    expect(missingSunscreen?.priority).toBe('essential');

    // Missing barrier repair for dry skin
    const missingBarrier = parsed.missing.find((m) =>
      m.category.toLowerCase().includes('barrier')
    );
    expect(missingBarrier).toBeDefined();
    expect(missingBarrier?.suggested_ingredients).toContain('Ceramides NP/AP/EOP');
  });
});
