'use client';

import type { SkinType } from '@/types/database';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface StepSkinTypeProps {
  name: string;
  ageRange: string;
  selectedType: SkinType | null;
  notes: string;
  onChangeName: (name: string) => void;
  onChangeAge: (age: string) => void;
  onChangeType: (type: SkinType) => void;
  onChangeNotes: (notes: string) => void;
}

const AGE_RANGES = [
  { value: 'Under 20', label: 'Under 20 (Teen barrier care)' },
  { value: '20-29', label: '20–29 (Peak collagen maintenance)' },
  { value: '30-39', label: '30–39 (Cellular renewal & fine lines)' },
  { value: '40-49', label: '40–49 (Elasticity & barrier support)' },
  { value: '50+', label: '50+ (Deep lipid restoration & moisture)' },
];

const SKIN_TYPES: {
  id: SkinType;
  title: string;
  icon: string;
  description: string;
  characteristics: string[];
}[] = [
  {
    id: 'dry',
    title: 'Dry Skin',
    icon: '🌾',
    description: 'Feels tight, rough, or flaky, especially after cleansing.',
    characteristics: ['Lacks natural oils', 'Small pores', 'Needs rich barrier creams'],
  },
  {
    id: 'oily',
    title: 'Oily Skin',
    icon: '✨',
    description: 'Produces excess sebum across the whole face, prone to shine and enlarged pores.',
    characteristics: ['Visible shine by midday', 'Prone to blackheads/congestion', 'Prefers light gels'],
  },
  {
    id: 'combination',
    title: 'Combination Skin',
    icon: '⚖️',
    description: 'Oily in the T-zone (forehead, nose, chin) but normal or dry on the cheeks.',
    characteristics: ['Dual needs', 'Enlarged pores around nose', 'Requires balanced hydration'],
  },
  {
    id: 'normal',
    title: 'Normal Skin',
    icon: '🌸',
    description: 'Balanced moisture levels, neither too oily nor too dry with few sensitivities.',
    characteristics: ['Even texture', 'Resilient barrier', 'Focuses on maintenance & protection'],
  },
  {
    id: 'sensitive',
    title: 'Sensitive Skin',
    icon: '🍃',
    description: 'Easily irritated, reactive to weather or new products, prone to stinging or redness.',
    characteristics: ['Fragile barrier', 'Stings easily with acids', 'Needs soothing, minimal formulas'],
  },
];

export function StepSkinType({
  name,
  ageRange,
  selectedType,
  notes,
  onChangeName,
  onChangeAge,
  onChangeType,
  onChangeNotes,
}: StepSkinTypeProps) {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center max-w-lg mx-auto">
        <h2 className="font-heading text-2xl font-bold text-charcoal sm:text-3xl">
          Welcome to GlowLedger
        </h2>
        <p className="mt-2 text-sm text-charcoal-light">
          Let&apos;s start with who you are so we can personalize your skincare recommendations on this device.
        </p>
      </div>

      {/* Profile Basics: Name & Age at the Start */}
      <Card className="max-w-2xl mx-auto p-5 sm:p-6 border-border bg-card shadow-card">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">👤</span>
          <div>
            <h3 className="font-heading text-base font-bold text-charcoal">
              Your Personal Profile
            </h3>
            <p className="text-xs text-charcoal-light">
              Personalizes your routines and consultations on this device
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-semibold text-charcoal mb-1.5">
              What should we call you? (Name or Nickname)
            </label>
            <Input
              placeholder="e.g. Priya"
              value={name}
              onChange={(e) => onChangeName(e.target.value)}
              className="h-11 text-sm bg-cream/30"
              autoFocus
            />
            <p className="mt-1 text-[11px] text-charcoal-lighter">
              Shown across your personalized routine verdicts on this device.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-charcoal mb-1.5">
              What is your age bracket?
            </label>
            <select
              value={ageRange}
              onChange={(e) => onChangeAge(e.target.value)}
              className="flex h-11 w-full rounded-xl border border-input bg-card px-3 py-2 text-xs text-charcoal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage"
            >
              {AGE_RANGES.map((ar) => (
                <option key={ar.value} value={ar.value}>
                  {ar.label}
                </option>
              ))}
            </select>
            <p className="mt-1 text-[11px] text-charcoal-lighter">
              Age determines natural cell turnover rate and active tolerance.
            </p>
          </div>
        </div>
      </Card>

      {/* Skin Type Section */}
      <div className="max-w-2xl mx-auto pt-2">
        <div className="mb-3 text-center sm:text-left">
          <h3 className="font-heading text-lg font-bold text-charcoal">
            What is your primary skin type?
          </h3>
          <p className="text-xs text-charcoal-light">
            How your skin feels a few hours after cleansing without moisturizer
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {SKIN_TYPES.map((type) => {
            const isSelected = selectedType === type.id;
            return (
              <Card
                key={type.id}
                onClick={() => onChangeType(type.id)}
                className={cn(
                  'cursor-pointer relative p-4 transition-all text-left flex flex-col justify-between hover:border-sage hover:shadow-md',
                  isSelected
                    ? 'border-2 border-sage bg-sage/5 shadow-md ring-2 ring-sage/20'
                    : 'border-border bg-card'
                )}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">{type.icon}</span>
                    {isSelected && (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-sage text-white text-xs font-bold">
                        ✓
                      </span>
                    )}
                  </div>
                  <h4 className="font-heading text-base font-semibold text-charcoal">
                    {type.title}
                  </h4>
                  <p className="mt-1 text-xs text-charcoal-light leading-relaxed">
                    {type.description}
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-border/50 flex flex-wrap gap-1">
                  {type.characteristics.map((char) => (
                    <span
                      key={char}
                      className="inline-block rounded-md bg-cream px-1.5 py-0.5 text-[10px] text-charcoal-light font-medium"
                    >
                      {char}
                    </span>
                  ))}
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Optional Free-text notes */}
      <div className="max-w-2xl mx-auto pt-2">
        <label className="block text-xs font-medium text-charcoal mb-1.5">
          Tell us more about your skin in your own words (optional)
        </label>
        <Textarea
          placeholder="e.g. My cheeks get red after hot showers, or I experience stubborn oiliness around my nose..."
          value={notes}
          onChange={(e) => onChangeNotes(e.target.value)}
          className="text-xs sm:text-sm bg-cream/20"
          rows={3}
        />
        <p className="mt-1 text-[11px] text-charcoal-lighter">
          Any specifics help our AI intelligence engine fine-tune your routine analysis.
        </p>
      </div>
    </div>
  );
}
