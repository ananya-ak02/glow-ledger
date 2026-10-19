// Rate limits — read from env or defaults
// All limits are configurable without code changes

export interface RateLimitConfig {
  /** Max research reports a single user can trigger per day */
  perUserDailyResearch: number;
  /** Max total AI calls across all users per day */
  globalDailyAICalls: number;
  /** Max search API calls per day (Tavily free ≈ 33/day) */
  globalDailySearchCalls: number;
  /** Max Reddit API calls per day */
  globalDailyRedditCalls: number;
  /** Research report cache TTL in days */
  researchCacheTTLDays: number;
  /** Per-user daily AI call limit */
  perUserDailyAICalls: number;
}

export const RATE_LIMITS: RateLimitConfig = {
  perUserDailyResearch: Number(process.env.NEXT_PUBLIC_LIMIT_USER_RESEARCH ?? 5),
  globalDailyAICalls: Number(process.env.NEXT_PUBLIC_LIMIT_GLOBAL_AI ?? 500),
  globalDailySearchCalls: Number(process.env.NEXT_PUBLIC_LIMIT_GLOBAL_SEARCH ?? 30),
  globalDailyRedditCalls: Number(process.env.NEXT_PUBLIC_LIMIT_GLOBAL_REDDIT ?? 50),
  researchCacheTTLDays: Number(process.env.NEXT_PUBLIC_CACHE_TTL_DAYS ?? 30),
  perUserDailyAICalls: Number(process.env.NEXT_PUBLIC_LIMIT_USER_AI ?? 20),
};

/** AI call cost per pipeline stage — used for quota accounting */
export const PIPELINE_COSTS = {
  research: {
    searchQueries: 2,   // Tavily searches per research
    redditQueries: 1,   // Reddit API calls per research
    aiCalls: 4,         // extraction + classification + synthesis + personalization
  },
  routineAnalysis: {
    aiCalls: 1,
  },
  comparison: {
    aiCalls: 1,         // reuses cached reports, only needs comparison call
  },
} as const;
