// ─── Database Types ──────────────────────────────────────
// Types matching the Supabase schema for full type safety

export type SkinType = 'dry' | 'oily' | 'combination' | 'normal' | 'sensitive';
export type FragrancePreference = 'loves' | 'neutral' | 'avoids' | 'sensitive';
export type ConcernType =
  | 'acne' | 'dark_spots' | 'post_acne_marks' | 'pigmentation'
  | 'texture' | 'redness' | 'dullness' | 'dehydration'
  | 'fine_lines' | 'pores' | 'sensitivity' | 'other';
export type Severity = 'mild' | 'moderate' | 'severe';
export type RoutineType = 'am' | 'pm';
export type ReactionType =
  | 'irritation' | 'burning' | 'breakout' | 'purging'
  | 'allergy' | 'dryness' | 'other';
export type Verdict = 'good_fit' | 'use_with_caution' | 'avoid';
export type IrritationRisk = 'low' | 'moderate' | 'high';
export type CounterType = 'daily_research' | 'daily_ai_calls' | 'daily_search_api';

// ─── Core Tables ─────────────────────────────────────────

export interface Profile {
  id: string;
  skin_type: SkinType | null;
  skin_type_notes: string | null;
  age_range: string | null;
  climate: string | null;
  budget: string | null;
  is_pregnant: boolean;
  known_allergies: string[];
  fragrance_preference: FragrancePreference | null;
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface SkinConcern {
  id: string;
  profile_id: string;
  concern_type: ConcernType;
  severity: Severity;
  affected_areas: string[];
  notes: string | null;
}

export interface Routine {
  id: string;
  profile_id: string;
  routine_type: RoutineType;
  is_active: boolean;
  last_analyzed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface RoutineStep {
  id: string;
  routine_id: string;
  step_order: number;
  product_name: string;
  product_id: string | null;
  category: string;
  frequency: string | null;
  notes: string | null;
}

// ─── Products & Ingredients (shared cache) ───────────────

export interface Product {
  id: string;
  name: string;
  brand: string | null;
  source_url: string | null;
  ingredient_list: string[];
  parsed_ingredients: ParsedIngredient[] | null;
  category: string | null;
  open_beauty_facts_id: string | null;
  cached_at: string;
  cache_ttl_days: number;
  created_at: string;
}

export interface ParsedIngredient {
  name: string;
  concentration: string | null;
  function: string | null;
  flags: string[];
}

export interface Ingredient {
  id: string;
  name: string;
  aliases: string[];
  function: string;
  category: string;
  irritation_risk: IrritationRisk;
  comedogenic_rating: number;
  pregnancy_unsafe: boolean;
  pregnancy_notes: string | null;
  common_sensitivities: string[];
  max_recommended_concentration: string | null;
  description: string | null;
}

// ─── Reactions ───────────────────────────────────────────

export interface UserReaction {
  id: string;
  profile_id: string;
  product_name: string;
  product_id: string | null;
  reaction_type: ReactionType;
  severity: Severity;
  suspected_ingredients: string[];
  notes: string | null;
  occurred_at: string;
  created_at: string;
}

// ─── Research & Verdicts ─────────────────────────────────

export interface ResearchReport {
  id: string;
  product_id: string;
  search_queries: string[];
  reddit_snippets: RedditSnippet[] | null;
  review_snippets: ReviewSnippet[] | null;
  source_links: string[];
  ingredient_analysis: IngredientAnalysis | null;
  ai_synthesis: AISynthesis | null;
  model_used: string;
  token_count: number;
  researched_at: string;
  expires_at: string;
  is_valid: boolean;
}

export interface RedditSnippet {
  subreddit: string;
  post_title: string;
  snippet: string;
  url: string;
  upvotes: number | null;
  date: string | null;
}

export interface ReviewSnippet {
  source: string;
  snippet: string;
  rating: number | null;
  url: string | null;
  trust_note: string | null;
}

export interface IngredientAnalysis {
  key_ingredients: { name: string; function: string; benefit: string }[];
  potential_irritants: { name: string; risk: string; note: string }[];
  notable_absent: string[];
}

export interface AISynthesis {
  summary: string;
  pros: string[];
  cons: string[];
  best_for: string[];
  not_recommended_for: string[];
  overall_sentiment: 'positive' | 'mixed' | 'negative';
  data_confidence: 'high' | 'medium' | 'low';
  version: string;
}

export interface PersonalizedVerdict {
  id: string;
  profile_id: string;
  research_report_id: string;
  verdict: Verdict;
  confidence: number;
  personalized_analysis: PersonalizedAnalysis;
  routine_placement: RoutinePlacement | null;
  conflicts: IngredientConflict[];
  flags: VerdictFlag[];
  created_at: string;
}

export interface PersonalizedAnalysis {
  fit_reasons: string[];
  caution_reasons: string[];
  avoid_reasons: string[];
  ingredient_matches: { ingredient: string; relevance: string }[];
}

export interface RoutinePlacement {
  suggested_step: string;
  time_of_day: 'am' | 'pm' | 'both';
  frequency: string;
  replaces: string | null;
  intro_plan: string;
}

export interface IngredientConflict {
  ingredient_a: string;
  ingredient_b: string;
  conflict_type: string;
  severity: 'warning' | 'avoid';
  recommendation: string;
}

export interface VerdictFlag {
  type: 'allergy' | 'pregnancy' | 'reaction_history' | 'sensitivity' | 'derm_referral';
  message: string;
  ingredient?: string;
}

// ─── Wishlist & Usage ────────────────────────────────────

export interface WishlistItem {
  id: string;
  profile_id: string;
  product_id: string;
  notes: string | null;
  priority: number;
  added_at: string;
}

export interface UsageCounter {
  id: string;
  profile_id: string | null;
  counter_type: CounterType;
  counter_date: string;
  count: number;
  limit_value: number;
}
