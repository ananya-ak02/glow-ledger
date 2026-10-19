import { describe, it, expect } from 'vitest';
import { EVAL_PRODUCTS } from './eval-products';
import { checkPregnancySafety, checkConflicts } from '@/lib/ingredients/conflict-rules';

describe('Evaluation Dataset (~15 Benchmark Skincare Products)', () => {
  it('contains at least 15 representative products across key categories', () => {
    expect(EVAL_PRODUCTS.length).toBeGreaterThanOrEqual(15);

    const categories = new Set(EVAL_PRODUCTS.map((p) => p.category));
    expect(categories.has('Serum')).toBe(true);
    expect(categories.has('Exfoliant')).toBe(true);
    expect(categories.has('Moisturizer')).toBe(true);
    expect(categories.has('Sunscreen')).toBe(true);
  });

  it('correctly triggers pregnancy safety flags for retinoid products', () => {
    const differin = EVAL_PRODUCTS.find((p) => p.id === 'differin-adapalene');
    expect(differin).toBeDefined();

    const flags = checkPregnancySafety(differin!.keyActives);
    expect(flags.length).toBeGreaterThan(0);
    expect(flags[0].type).toBe('pregnancy');
  });

  it('correctly triggers pregnancy flags for high-dose salicylic acid products', () => {
    const paulasChoice = EVAL_PRODUCTS.find((p) => p.id === 'paulas-choice-bha');
    expect(paulasChoice).toBeDefined();

    const flags = checkPregnancySafety(paulasChoice!.keyActives);
    expect(flags.length).toBeGreaterThan(0);
    expect(flags.some((f) => f.type === 'pregnancy')).toBe(true);
  });

  it('detects chemical conflicts between retinoids and exfoliating acids in the eval set', () => {
    const differin = EVAL_PRODUCTS.find((p) => p.id === 'differin-adapalene');
    const paulasChoice = EVAL_PRODUCTS.find((p) => p.id === 'paulas-choice-bha');

    const conflicts = checkConflicts(differin!.keyActives, paulasChoice!.keyActives);
    expect(conflicts.length).toBeGreaterThan(0);
    expect(conflicts[0].severity).toBe('avoid');
    expect(conflicts[0].conflict_type).toBe('irritation_risk');
  });
});
