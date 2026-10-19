'use client';

import { Card } from '@/components/ui/card';
import { DERM_REFERRAL_TRIGGERS } from '@/config/safety';

interface DermReferralBannerProps {
  condition: (typeof DERM_REFERRAL_TRIGGERS)[number];
  customMessage?: string;
}

const CONDITION_DETAILS: Record<
  (typeof DERM_REFERRAL_TRIGGERS)[number],
  { title: string; explanation: string; urgency: 'immediate' | 'recommended' }
> = {
  severe_acne: {
    title: 'Severe / Cystic Acne Notice',
    explanation:
      'Deep, inflamed cysts or nodules require prescription interventions (such as topical retinoids, oral anti-androgens, or isotretinoin) to prevent permanent atrophic scarring. Over-the-counter actives can exacerbate barrier disruption.',
    urgency: 'recommended',
  },
  cystic_acne: {
    title: 'Cystic Acne Flare-Up',
    explanation:
      'Cystic lesions originate deep within the dermis and rarely resolve with surface cosmetic products alone. Consult a board-certified dermatologist for targeted anti-inflammatory medical care.',
    urgency: 'recommended',
  },
  sudden_reaction: {
    title: 'Acute Allergic Reaction Alert',
    explanation:
      'Sudden facial swelling, hives, or eyelid dermatitis indicates acute contact dermatitis. Discontinue all active skincare immediately, rinse with cool water, and seek medical attention if swelling persists or affects breathing.',
    urgency: 'immediate',
  },
  persistent_burning: {
    title: 'Persistent Stinging / Barrier Compromise',
    explanation:
      'Continuous burning sensation lasting hours after washing suggests a compromised stratum corneum or contact dermatitis. Stop all acids and retinoids; use only plain water and basic petrolatum/ceramide creams.',
    urgency: 'immediate',
  },
  suspicious_mole: {
    title: 'Pigmented Lesion / Mole Screening',
    explanation:
      'Any asymmetric mole with irregular borders, color variation, diameter larger than 6mm, or evolving characteristics (ABCDE criteria) must be examined by a dermatologist for early melanoma detection.',
    urgency: 'immediate',
  },
  widespread_rash: {
    title: 'Widespread Facial Dermatitis',
    explanation:
      'Spreading rashes may indicate eczema, perioral dermatitis, or fungal folliculitis. Active cosmetic acids often worsen these conditions. Professional clinical diagnosis is required.',
    urgency: 'recommended',
  },
  skin_infection: {
    title: 'Possible Bacterial or Viral Infection',
    explanation:
      'Yellow crusting, fever blisters, or weeping sores require antimicrobial or antiviral medical prescriptions. Do not apply cosmetic exfoliants.',
    urgency: 'immediate',
  },
};

export function DermReferralBanner({
  condition,
  customMessage,
}: DermReferralBannerProps) {
  const details = CONDITION_DETAILS[condition];
  if (!details) return null;

  const isImmediate = details.urgency === 'immediate';

  return (
    <Card
      className={`p-5 rounded-2xl border-2 ${
        isImmediate
          ? 'border-terracotta bg-[var(--color-verdict-avoid-bg)]'
          : 'border-amber-300 bg-[var(--color-verdict-caution-bg)]'
      } shadow-card animate-fade-in`}
    >
      <div className="flex items-start gap-3.5">
        <span className="text-2xl mt-0.5">{isImmediate ? '🛑' : '👩‍⚕️'}</span>
        <div className="space-y-1.5 flex-1">
          <div className="flex items-center justify-between">
            <h4 className="font-heading text-sm font-bold text-charcoal">
              {details.title}
            </h4>
            <span
              className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                isImmediate
                  ? 'bg-terracotta text-white'
                  : 'bg-amber-100 text-amber-900 border border-amber-300'
              }`}
            >
              See a Dermatologist
            </span>
          </div>

          <p className="text-xs text-charcoal-light leading-relaxed">
            {customMessage || details.explanation}
          </p>

          <div className="pt-2 border-t border-border/60 text-[11px] text-charcoal-lighter">
            <strong>Medical Disclaimer:</strong> GlowLedger is an informational intelligence tool and does not provide clinical diagnoses, treatments, or medical advice.
          </div>
        </div>
      </div>
    </Card>
  );
}
