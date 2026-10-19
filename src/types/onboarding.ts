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
  // Step 1: Skin Type
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
  age_range: string;
  climate: string;
  budget: string;
  is_pregnant: boolean;
  known_allergies: string[];
  fragrance_preference: FragrancePreference;
  ai_consent_acknowledged: boolean;
}

export const INITIAL_ONBOARDING_STATE: OnboardingState = {
  skin_type: null,
  skin_type_notes: '',
  concerns: [],
  am_routine: [],
  pm_routine: [],
  worked_products: [],
  past_reactions: [],
  age_range: '25-34',
  climate: 'temperate',
  budget: 'balanced',
  is_pregnant: false,
  known_allergies: [],
  fragrance_preference: 'neutral',
  ai_consent_acknowledged: true,
};
