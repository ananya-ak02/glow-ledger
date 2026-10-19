import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { RoutineAnalysis } from '@/types/ai';

interface IngredientRecommendationsProps {
  missing: RoutineAnalysis['missing'];
  redundant: RoutineAnalysis['redundant'];
}

export function IngredientRecommendationsCard({
  missing,
  redundant,
}: IngredientRecommendationsProps) {
  return (
    <div className="space-y-6">
      {/* What's Missing: Ingredient Types First */}
      <Card className="p-6 border-border bg-card">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">🧪</span>
            <div>
              <h3 className="font-heading text-lg font-bold text-charcoal">
                Recommended Ingredient Types
              </h3>
              <p className="text-xs text-charcoal-light">
                Targeted actives and hydrators prioritized for your specific skin concerns & climate
              </p>
            </div>
          </div>
          <Badge variant="good" className="text-xs">
            Ingredient Primacy
          </Badge>
        </div>

        {missing.length === 0 ? (
          <p className="text-xs text-charcoal-light">
            Your current routine covers all core clinical requirements for your skin profile.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {missing.map((item, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-border bg-cream/30 p-4 space-y-2 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-charcoal">
                      {item.category}
                    </span>
                    <Badge
                      variant={item.priority === 'essential' ? 'avoid' : 'caution'}
                      className="text-[10px] capitalize"
                    >
                      {item.priority}
                    </Badge>
                  </div>
                  <p className="text-xs text-charcoal-light leading-relaxed">
                    {item.reason}
                  </p>
                </div>

                {/* Priority Ingredient Types */}
                <div className="pt-2 border-t border-border/60">
                  <span className="block text-[11px] font-semibold text-charcoal mb-1">
                    Recommended Ingredients to Look For:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {item.suggested_ingredients.map((ing) => (
                      <span
                        key={ing}
                        className="inline-block rounded-md bg-sage-light/70 border border-sage/40 px-2 py-0.5 text-[11px] font-medium text-charcoal"
                      >
                        ✦ {ing}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Redundant Products / Save Money */}
      {redundant.length > 0 && (
        <Card className="p-6 border-border bg-card">
          <div className="flex items-center gap-2.5 mb-4">
            <span className="text-xl">✂️</span>
            <div>
              <h3 className="font-heading text-lg font-bold text-charcoal">
                Redundant Products to Streamline
              </h3>
              <p className="text-xs text-charcoal-light">
                Multiple products doing identical jobs. Removing duplicates saves money and prevents barrier congestion.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {redundant.map((item, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-border bg-cream/40 p-4 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-charcoal">
                    Overlapping: {item.steps.join(' & ')}
                  </span>
                  <Badge variant="outline" className="text-[10px]">
                    Keep: {item.keep}
                  </Badge>
                </div>
                <p className="text-charcoal-light">{item.reason}</p>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
