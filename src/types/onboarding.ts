import type {
  SkinType,
  FragrancePreference,
  ConcernType,
  Severity,
  ReactionType,
} from '@/types/database';

export interface RoutineStepInput {
  id: string;
  product_name: string;
  category: string;
  frequency: string;
  notes?: string;
}

export interface PastReactionInput {
  id: string;
  product_name: string;
  reaction_type: ReactionType;
  severity: Severity;
  suspected_ingredients: string[];
  notes?: string;
}

export interface OnboardingState {
  // Step 1: Personal Profile & Skin Basics
  name: string;
  age_range: string;
  skin_type: SkinType | null;
  skin_type_notes: string;

  // Step 2: Concerns
  concerns: {
    type: ConcernType;
    severity: Severity;
    affected_areas: string[];
    notes?: string;
  }[];

  // Step 3: Current Routine
  am_routine: RoutineStepInput[];
  pm_routine: RoutineStepInput[];

  // Step 4: Product History & Past Reactions
  worked_products: string[];
  past_reactions: PastReactionInput[];

  // Step 5: Context, Safety & Preferences
  climate: string;
  budget: string;
  is_pregnant: boolean;
  known_allergies: string[];
  fragrance_preference: FragrancePreference;
  ai_consent_acknowledged: boolean;
}

export const INITIAL_ONBOARDING_STATE: OnboardingState = {
  name: '',
  age_range: '20-29',
  skin_type: null,
  skin_type_notes: '',
  concerns: [],
  am_routine: [],
  pm_routine: [],
  worked_products: [],
  past_reactions: [],
  climate: 'temperate',
  budget: 'balanced',
  is_pregnant: false,
  known_allergies: [],
  fragrance_preference: 'neutral',
  ai_consent_acknowledged: true,
};
