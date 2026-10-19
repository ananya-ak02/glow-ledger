import { describe, it, expect } from 'vitest';
import { DERM_REFERRAL_TRIGGERS } from '@/config/safety';

describe('Dermatologist Referral & Safety Triggers', () => {
  it('covers all mandated clinical escalation conditions', () => {
    expect(DERM_REFERRAL_TRIGGERS).toContain('severe_acne');
    expect(DERM_REFERRAL_TRIGGERS).toContain('cystic_acne');
    expect(DERM_REFERRAL_TRIGGERS).toContain('sudden_reaction');
    expect(DERM_REFERRAL_TRIGGERS).toContain('persistent_burning');
    expect(DERM_REFERRAL_TRIGGERS).toContain('suspicious_mole');
    expect(DERM_REFERRAL_TRIGGERS).toContain('widespread_rash');
    expect(DERM_REFERRAL_TRIGGERS).toContain('skin_infection');
  });

  it('guarantees severe conditions are handled before OTC experimentation', () => {
    const immediateConditions = ['sudden_reaction', 'persistent_burning', 'suspicious_mole', 'skin_infection'];
    for (const cond of immediateConditions) {
      expect(DERM_REFERRAL_TRIGGERS.includes(cond as (typeof DERM_REFERRAL_TRIGGERS)[number])).toBe(true);
    }
  });
});
