'use client';

import type { SkinType } from '@/types/database';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface StepSkinTypeProps {
  selectedType: SkinType | null;
  notes: string;
  onChangeType: (type: SkinType) => void;
  onChangeNotes: (notes: string) => void;
}

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
  selectedType,
  notes,
  onChangeType,
  onChangeNotes,
}: StepSkinTypeProps) {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center max-w-lg mx-auto">
        <h2 className="font-heading text-2xl font-bold text-charcoal sm:text-3xl">
          What is your skin type?
        </h2>
        <p className="mt-2 text-sm text-charcoal-light">
          Choose the description that best matches how your bare skin feels a few hours after washing.
        </p>
      </div>

      {/* Grid of skin types */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 pt-2">
        {SKIN_TYPES.map((type) => {
          const isSelected = selectedType === type.id;
          return (
            <Card
              key={type.id}
              onClick={() => onChangeType(type.id)}
              className={cn(
                'cursor-pointer relative p-5 transition-all text-left flex flex-col justify-between hover:border-sage hover:shadow-md',
                isSelected
                  ? 'border-2 border-sage bg-sage/5 shadow-md ring-2 ring-sage/20'
                  : 'border-border bg-card'
              )}
            >
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-2xl">{type.icon}</span>
                  {isSelected && (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-sage text-white text-xs">
                      ✓
                    </span>
                  )}
                </div>
                <h3 className="font-heading text-lg font-semibold text-charcoal">
                  {type.title}
                </h3>
                <p className="mt-1 text-xs text-charcoal-light leading-relaxed">
                  {type.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-border/50 flex flex-wrap gap-1.5">
                {type.characteristics.map((char) => (
                  <span
                    key={char}
                    className="inline-block rounded-md bg-cream px-2 py-0.5 text-[11px] text-charcoal-light"
                  >
                    {char}
                  </span>
                ))}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Optional Free-text notes */}
      <div className="max-w-xl mx-auto pt-4">
        <label className="block text-xs font-medium text-charcoal mb-1.5">
          Tell us more in your own words (optional)
        </label>
        <Textarea
          placeholder="e.g. My skin gets extremely flaky during winter, or I get hormonal breakouts around my jawline..."
          value={notes}
          onChange={(e) => onChangeNotes(e.target.value)}
          className="text-sm"
        />
        <p className="mt-1 text-[11px] text-charcoal-lighter">
          Any nuance helps our AI tailor product suitability notes.
        </p>
      </div>
    </div>
  );
}
