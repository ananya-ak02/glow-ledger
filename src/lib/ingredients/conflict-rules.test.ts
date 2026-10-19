import { describe, it, expect } from 'vitest';
import {
  checkConflicts,
  checkPregnancySafety,
  checkUserSensitivities,
  suggestLayeringOrder,
  checkRoutineConflicts,
} from './conflict-rules';

describe('Ingredient Conflict Engine (Deterministic)', () => {
  it('detects retinol and AHA/BHA conflicts with avoid severity', () => {
    const conflicts = checkConflicts(
      ['Retinol 0.5%', 'Glycerin'],
      ['Glycolic Acid 7% Toning Solution', 'Water']
    );

    expect(conflicts.length).toBeGreaterThan(0);
    const retinolAha = conflicts.find((c) => c.conflict_type === 'irritation_risk');
    expect(retinolAha).toBeDefined();
    expect(retinolAha?.severity).toBe('avoid');
    expect(retinolAha?.recommendation).toContain('alternate');
  });

  it('detects retinol and vitamin C timing conflict with warning severity', () => {
    const conflicts = checkConflicts(
      ['Retinol 1%'],
      ['L-Ascorbic Acid 15%']
    );

    expect(conflicts.length).toBeGreaterThan(0);
    const cConflict = conflicts.find((c) => c.conflict_type === 'timing_conflict');
    expect(cConflict).toBeDefined();
    expect(cConflict?.severity).toBe('warning');
  });

  it('detects benzoyl peroxide and retinol deactivation', () => {
    const conflicts = checkConflicts(
      ['Tretinoin 0.05% Cream'],
      ['Benzoyl Peroxide 2.5% Gel']
    );

    expect(conflicts.length).toBeGreaterThan(0);
    expect(conflicts.some((c) => c.conflict_type === 'deactivation')).toBe(true);
  });

  it('detects multiple exfoliants stacking', () => {
    const conflicts = checkConflicts(
      ['Lactic Acid 10%'],
      ['Salicylic Acid 2%']
    );

    expect(conflicts.length).toBeGreaterThan(0);
    expect(conflicts.some((c) => c.conflict_type === 'over_exfoliation')).toBe(true);
  });

  it('flags pregnancy unsafe ingredients correctly', () => {
    const safeFlags = checkPregnancySafety(['Hyaluronic Acid', 'Niacinamide', 'Ceramides']);
    expect(safeFlags.length).toBe(0);

    const retinoidFlags = checkPregnancySafety(['Retinol', 'Squalane', 'Water']);
    expect(retinoidFlags.length).toBe(1);
    expect(retinoidFlags[0].type).toBe('pregnancy');
    expect(retinoidFlags[0].ingredient).toBe('Retinol');

    const bhaFlags = checkPregnancySafety(['Salicylic Acid (BHA)', 'Glycerin']);
    expect(bhaFlags.length).toBe(1);
    expect(bhaFlags[0].type).toBe('pregnancy');
  });

  it('flags user allergies and past reaction history', () => {
    const ingredients = ['Centella Asiatica', 'Tea Tree Oil', 'Fragrance', 'Glycerin'];
    const allergies = ['fragrance'];
    const pastReactions = ['tea tree oil'];

    const flags = checkUserSensitivities(ingredients, allergies, pastReactions);
    expect(flags.length).toBe(2);

    const allergyFlag = flags.find((f) => f.type === 'allergy');
    expect(allergyFlag).toBeDefined();
    expect(allergyFlag?.ingredient).toBe('Fragrance');

    const reactionFlag = flags.find((f) => f.type === 'reaction_history');
    expect(reactionFlag).toBeDefined();
    expect(reactionFlag?.ingredient).toBe('Tea Tree Oil');
  });

  it('sorts routine steps by correct skincare layering order (thinnest to thickest)', () => {
    const products = [
      { name: 'Moisturizing Cream', category: 'moisturizer' },
      { name: 'Gentle Cleanser', category: 'cleanser' },
      { name: 'Mineral Sunscreen SPF 50', category: 'sunscreen' },
      { name: 'Hydrating Toner', category: 'toner' },
      { name: 'Niacinamide Serum', category: 'serum' },
    ];

    const sorted = suggestLayeringOrder(products);
    expect(sorted[0].category).toBe('cleanser');
    expect(sorted[1].category).toBe('toner');
    expect(sorted[2].category).toBe('serum');
    expect(sorted[3].category).toBe('moisturizer');
    expect(sorted[4].category).toBe('sunscreen');
  });

  it('checks full routine for multi-product conflicts', () => {
    const routine = [
      { name: 'Cleanser', ingredients: ['Water', 'Glycerin'] },
      { name: 'Exfoliating Toner', ingredients: ['Glycolic Acid', 'Water'] },
      { name: 'Night Serum', ingredients: ['Retinol', 'Squalane'] },
    ];

    const routineConflicts = checkRoutineConflicts(routine);
    expect(routineConflicts.length).toBe(1);
    expect(routineConflicts[0].productA).toBe('Exfoliating Toner');
    expect(routineConflicts[0].productB).toBe('Night Serum');
  });
});
