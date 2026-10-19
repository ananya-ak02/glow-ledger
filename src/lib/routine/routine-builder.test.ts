import { describe, it, expect } from 'vitest';
import { buildOptimizedRoutine, isPotentActive } from './routine-builder';
import { INITIAL_ONBOARDING_STATE } from '@/types/onboarding';

describe('Routine Builder & Introduction Schedule', () => {
  it('correctly classifies potent actives vs gentle basics', () => {
    expect(isPotentActive('Retinol 0.5% in Squalane', 'Treatment')).toBe(true);
    expect(isPotentActive('2% BHA Liquid Exfoliant', 'Exfoliant')).toBe(true);
    expect(isPotentActive('C E Ferulic Vitamin C', 'Serum')).toBe(true);
    expect(isPotentActive('Benzoyl Peroxide 2.5% Gel', 'Treatment')).toBe(true);

    expect(isPotentActive('Hydrating Cleanser', 'Cleanser')).toBe(false);
    expect(isPotentActive('Hyaluronic Acid 2% + B5', 'Serum')).toBe(false);
    expect(isPotentActive('Moisturizing Cream', 'Moisturizer')).toBe(false);
  });

  it('builds a phased intro schedule spacing multiple actives sequentially', () => {
    const profile = {
      ...INITIAL_ONBOARDING_STATE,
      skin_type: 'combination' as const,
      am_routine: [
        { id: '1', product_name: 'Gentle Cleanser', category: 'Cleanser', frequency: 'Daily' },
      ],
      pm_routine: [
        { id: '2', product_name: 'Ceramide Cream', category: 'Moisturizer', frequency: 'Daily' },
      ],
    };

    const shortlist = [
      { name: 'Retinol 0.3%', category: 'Treatment' },
      { name: 'Glycolic Acid 7% Toner', category: 'Exfoliant' },
    ];

    const plan = buildOptimizedRoutine(profile, shortlist);

    expect(plan.introSchedule.length).toBe(2);
    // Exfoliant toner is layered before treatment according to layering hierarchy
    expect(plan.introSchedule[0].focusProduct).toBe('Glycolic Acid 7% Toner');
    expect(plan.introSchedule[0].timeframe).toContain('Weeks 1');
    expect(plan.introSchedule[1].focusProduct).toBe('Retinol 0.3%');
    expect(plan.introSchedule[1].timeframe).toContain('Weeks 4');

    // Watchouts must warn against introducing multiple actives concurrently
    expect(plan.introSchedule[0].watchouts[0]).toContain('DO NOT introduce any other new active');
  });

  it('sorts routine steps according to scientific layering order', () => {
    const profile = {
      ...INITIAL_ONBOARDING_STATE,
      am_routine: [
        { id: '1', product_name: 'Heavy Barrier Cream', category: 'Moisturizer', frequency: 'Daily' },
        { id: '2', product_name: 'Water Cleanser', category: 'Cleanser', frequency: 'Daily' },
        { id: '3', product_name: 'SPF 50 Sunscreen', category: 'Sunscreen', frequency: 'Daily' },
      ],
      pm_routine: [],
    };

    const plan = buildOptimizedRoutine(profile, []);
    expect(plan.amRoutine[0].category.toLowerCase()).toContain('cleanser');
    expect(plan.amRoutine[1].category.toLowerCase()).toContain('moisturizer');
    expect(plan.amRoutine[2].category.toLowerCase()).toContain('sunscreen');
  });
});
