import { describe, it, expect } from 'vitest';
import { INITIAL_ONBOARDING_STATE, type OnboardingState } from '@/types/onboarding';

describe('Onboarding State & Logic', () => {
  it('initializes with default zero-cost state and AI consent', () => {
    expect(INITIAL_ONBOARDING_STATE.skin_type).toBeNull();
    expect(INITIAL_ONBOARDING_STATE.concerns).toEqual([]);
    expect(INITIAL_ONBOARDING_STATE.am_routine).toEqual([]);
    expect(INITIAL_ONBOARDING_STATE.pm_routine).toEqual([]);
    expect(INITIAL_ONBOARDING_STATE.ai_consent_acknowledged).toBe(true);
    expect(INITIAL_ONBOARDING_STATE.is_pregnant).toBe(false);
  });

  it('detects severe acne condition to trigger dermatologist alert', () => {
    const stateWithMildAcne: OnboardingState = {
      ...INITIAL_ONBOARDING_STATE,
      concerns: [{ type: 'acne', severity: 'mild', affected_areas: ['Forehead'] }],
    };
    const hasSevereAcne1 = stateWithMildAcne.concerns.some(
      (c) => c.type === 'acne' && c.severity === 'severe'
    );
    expect(hasSevereAcne1).toBe(false);

    const stateWithSevereAcne: OnboardingState = {
      ...INITIAL_ONBOARDING_STATE,
      concerns: [{ type: 'acne', severity: 'severe', affected_areas: ['Cheeks', 'Jawline'] }],
    };
    const hasSevereAcne2 = stateWithSevereAcne.concerns.some(
      (c) => c.type === 'acne' && c.severity === 'severe'
    );
    expect(hasSevereAcne2).toBe(true);
  });

  it('updates pregnancy safety mode correctly', () => {
    let state = { ...INITIAL_ONBOARDING_STATE };
    expect(state.is_pregnant).toBe(false);

    state = { ...state, is_pregnant: true };
    expect(state.is_pregnant).toBe(true);
  });

  it('records past product reactions with suspected triggers', () => {
    const state: OnboardingState = {
      ...INITIAL_ONBOARDING_STATE,
      past_reactions: [
        {
          id: '1',
          product_name: 'Super Niacinamide 10%',
          reaction_type: 'burning',
          severity: 'moderate',
          suspected_ingredients: ['Niacinamide'],
        },
      ],
    };

    expect(state.past_reactions.length).toBe(1);
    expect(state.past_reactions[0].reaction_type).toBe('burning');
    expect(state.past_reactions[0].suspected_ingredients).toContain('Niacinamide');
  });
});
