import type { OnboardingState, RoutineStepInput } from '@/types/onboarding';
import { suggestLayeringOrder, checkConflicts } from '@/lib/ingredients/conflict-rules';
import type { IngredientConflict } from '@/types/database';

export interface IntroPhase {
  phaseNumber: number;
  timeframe: string;
  focusProduct: string;
  category: string;
  frequency: string;
  instructions: string[];
  watchouts: string[];
}

export interface BuiltRoutinePlan {
  amRoutine: RoutineStepInput[];
  pmRoutine: RoutineStepInput[];
  introSchedule: IntroPhase[];
  conflictsDetected: IngredientConflict[];
  scientificRationale: string;
}

/**
 * Checks whether a product name or category is classified as a potent active.
 */
export function isPotentActive(productName: string, category: string): boolean {
  const text = `${productName} ${category}`.toLowerCase();
  return /retin|tretin|adapalene|bha|aha|salicylic|glycolic|lactic|ascorbic|vitamin c|benzoyl|exfoli/i.test(
    text
  );
}

/**
 * Build an optimized AM/PM routine combining profile requirements and shortlisted products,
 * complete with a sequential one-new-active-at-a-time introduction schedule.
 */
export function buildOptimizedRoutine(
  profile: OnboardingState,
  shortlistProducts: { name: string; category: string }[] = []
): BuiltRoutinePlan {
  const amSteps: RoutineStepInput[] = [...profile.am_routine];
  const pmSteps: RoutineStepInput[] = [...profile.pm_routine];

  // Integrate shortlisted items into appropriate AM or PM slots
  for (const item of shortlistProducts) {
    const isSunscreen = /sunscreen|spf/i.test(`${item.name} ${item.category}`);
    const isRetinoidOrAcid = /retin|adapalene|tretin|bha|glycolic|aha|exfoli/i.test(
      `${item.name} ${item.category}`
    );

    const newStep: RoutineStepInput = {
      id: Math.random().toString(36).substring(2, 9),
      product_name: item.name,
      category: item.category,
      frequency: isRetinoidOrAcid ? '2-3x per week' : 'Daily',
    };

    if (isSunscreen) {
      if (!amSteps.some((s) => /sunscreen|spf/i.test(s.category))) {
        amSteps.push(newStep);
      }
    } else if (isRetinoidOrAcid) {
      pmSteps.push(newStep);
    } else {
      // Default to PM if hydrating/treatment, or AM if antioxidant
      if (/vitamin c|antioxidant/i.test(`${item.name} ${item.category}`)) {
        amSteps.push(newStep);
      } else {
        pmSteps.push(newStep);
      }
    }
  }

  // Sort steps according to scientific layering order
  const sortedAm = suggestLayeringOrder(
    amSteps.map((s) => ({ name: s.product_name, category: s.category }))
  ).map((s, idx) => {
    const original = amSteps.find((o) => o.product_name === s.name);
    return {
      id: original?.id || String(idx),
      product_name: s.name,
      category: s.category,
      frequency: original?.frequency || 'Daily',
    };
  });

  const sortedPm = suggestLayeringOrder(
    pmSteps.map((s) => ({ name: s.product_name, category: s.category }))
  ).map((s, idx) => {
    const original = pmSteps.find((o) => o.product_name === s.name);
    return {
      id: original?.id || String(idx),
      product_name: s.name,
      category: s.category,
      frequency: original?.frequency || 'Daily',
    };
  });

  // Check conflicts in the scheduled routine
  const allProducts = [...sortedAm, ...sortedPm];
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

  // Build sequential One-New-Active-at-a-Time Intro Schedule
  const potentActives = allProducts.filter((p) =>
    isPotentActive(p.product_name, p.category)
  );

  const introSchedule: IntroPhase[] = [];

  if (potentActives.length === 0) {
    introSchedule.push({
      phaseNumber: 1,
      timeframe: 'Weeks 1 – 2',
      focusProduct: 'Gentle Baseline Routine',
      category: 'Cleanser & Hydration',
      frequency: 'Daily AM & PM',
      instructions: [
        'Establish your daily cleansing and broad-spectrum sun protection baseline.',
        'Ensure skin barrier feels supple without tightness or stinging before adding active acids.',
      ],
      watchouts: ['If tightness occurs after cleansing, switch to a non-foaming cream cleanser.'],
    });
  } else {
    potentActives.forEach((active, index) => {
      const phaseNum = index + 1;
      const startWeek = (phaseNum - 1) * 3 + 1;
      const endWeek = startWeek + 2;

      introSchedule.push({
        phaseNumber: phaseNum,
        timeframe: `Weeks ${startWeek} – ${endWeek}`,
        focusProduct: active.product_name,
        category: active.category,
        frequency: '1-2 nights per week',
        instructions: [
          `Patch test ${active.product_name} behind the ear or inside wrist for 24 hours.`,
          `Week ${startWeek}: Apply once weekly on dry skin after gentle cleansing.`,
          `Week ${startWeek + 1}-${endWeek}: Increase to 2 nights per week if no irritation occurs.`,
          'Buffer with a ceramide moisturizer if tingling is noticed.',
        ],
        watchouts: [
          'DO NOT introduce any other new active ingredients during this 3-week window.',
          'If persistent stinging or peeling occurs, stop usage and apply barrier repair cream.',
        ],
      });
    });
  }

  return {
    amRoutine: sortedAm,
    pmRoutine: sortedPm,
    introSchedule,
    conflictsDetected: conflicts,
    scientificRationale: `Customized for your ${profile.skin_type || 'combination'} skin and ${profile.climate} climate. Layering follows molecular density from lightweight hydrators to protective occlusives, with active introductions spaced 3 weeks apart.`,
  };
}
