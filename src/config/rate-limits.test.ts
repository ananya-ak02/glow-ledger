import { describe, it, expect } from 'vitest';
import { RATE_LIMITS, PIPELINE_COSTS } from './rate-limits';

describe('Free-Tier Quota & Rate Limit Rules', () => {
  it('has sensible zero-cost defaults configured', () => {
    expect(RATE_LIMITS.perUserDailyResearch).toBeGreaterThan(0);
    expect(RATE_LIMITS.perUserDailyResearch).toBeLessThanOrEqual(10);
    expect(RATE_LIMITS.globalDailyAICalls).toBeGreaterThan(100);
    expect(RATE_LIMITS.globalDailySearchCalls).toBeLessThanOrEqual(33); // Tavily free tier ≈ 33/day
    expect(RATE_LIMITS.researchCacheTTLDays).toBe(30);
  });

  it('keeps research pipeline call consumption within strict bounds', () => {
    const cost = PIPELINE_COSTS.research;
    expect(cost.searchQueries).toBeLessThanOrEqual(2);
    expect(cost.redditQueries).toBeLessThanOrEqual(1);
    expect(cost.aiCalls).toBeLessThanOrEqual(4);
  });

  it('calculates that 5 daily researches per user consumes <= 20 AI calls', () => {
    const userResearchLimit = RATE_LIMITS.perUserDailyResearch;
    const aiCallsPerResearch = PIPELINE_COSTS.research.aiCalls;
    const maxAICalls = userResearchLimit * aiCallsPerResearch;
    expect(maxAICalls).toBeLessThanOrEqual(RATE_LIMITS.perUserDailyAICalls);
  });

  it('routine analysis uses only 1 AI call', () => {
    expect(PIPELINE_COSTS.routineAnalysis.aiCalls).toBe(1);
  });

  it('product comparison reuses cached reports requiring only 1 comparison call', () => {
    expect(PIPELINE_COSTS.comparison.aiCalls).toBe(1);
  });
});
