import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { ProductSynthesis, Personalization } from '@/types/ai';
import type { IngredientConflict, VerdictFlag, Verdict } from '@/types/database';

interface VerdictCardProps {
  synthesis: ProductSynthesis;
  personalization: Personalization;
  isCached: boolean;
  sourceLinks: string[];
  conflicts: IngredientConflict[];
  flags: VerdictFlag[];
  ingredientsList: string[];
}

export function VerdictCard({
  synthesis,
  personalization,
  isCached,
  sourceLinks,
  conflicts,
  flags,
  ingredientsList,
}: VerdictCardProps) {
  const verdict = personalization.verdict;

  const verdictStyles: Record<
    Verdict,
    { badgeVariant: 'good' | 'caution' | 'avoid'; label: string; bgClass: string; icon: string }
  > = {
    good_fit: {
      badgeVariant: 'good',
      label: 'Good Fit for Your Skin',
      bgClass: 'border-sage/40 bg-[var(--color-verdict-good-bg)]',
      icon: '🌿',
    },
    use_with_caution: {
      badgeVariant: 'caution',
      label: 'Use with Caution',
      bgClass: 'border-amber-300 bg-[var(--color-verdict-caution-bg)]',
      icon: '⚠️',
    },
    avoid: {
      badgeVariant: 'avoid',
      label: 'Avoid for Your Skin',
      bgClass: 'border-terracotta bg-[var(--color-verdict-avoid-bg)]',
      icon: '🛑',
    },
  };

  const style = verdictStyles[verdict];
  const confidencePercent = Math.round(personalization.confidence * 100);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* ─── Hero Verdict Header ─────────────────────────────────── */}
      <Card className={`p-6 border-2 ${style.bgClass} shadow-card`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <span className="text-3xl">{style.icon}</span>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge variant={style.badgeVariant} className="text-xs uppercase font-bold tracking-wider">
                  {style.label}
                </Badge>
                <span className="text-xs text-charcoal-lighter font-medium">
                  {confidencePercent}% Confidence
                </span>
              </div>
              <h2 className="font-heading text-2xl font-bold text-charcoal">
                {synthesis.product_name}
              </h2>
              {synthesis.brand && (
                <p className="text-xs text-charcoal-light">by {synthesis.brand}</p>
              )}
            </div>
          </div>

          {/* Shared Cache badge */}
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-[11px] font-medium text-charcoal border border-border shadow-sm">
              <span className={`h-2 w-2 rounded-full ${isCached ? 'bg-sage' : 'bg-terracotta'}`} />
              <span>{isCached ? 'Shared Cache Hit (0 AI tokens)' : 'Newly Researched & Cached'}</span>
            </span>
          </div>
        </div>

        {/* Fit / Caution / Avoid Bullet Points */}
        <div className="mt-5 pt-4 border-t border-border/60 space-y-2">
          {verdict === 'good_fit' && (
            <div className="space-y-1">
              <span className="text-xs font-bold text-charcoal block mb-1">Why it fits your profile:</span>
              {personalization.fit_reasons.map((r, i) => (
                <p key={i} className="text-xs text-charcoal-light flex items-start gap-2">
                  <span className="text-sage font-bold">✓</span> {r}
                </p>
              ))}
            </div>
          )}

          {verdict === 'use_with_caution' && (
            <div className="space-y-1">
              <span className="text-xs font-bold text-charcoal block mb-1">Cautions to observe:</span>
              {personalization.caution_reasons.map((r, i) => (
                <p key={i} className="text-xs text-charcoal-light flex items-start gap-2">
                  <span className="text-amber-600 font-bold">!</span> {r}
                </p>
              ))}
            </div>
          )}

          {verdict === 'avoid' && (
            <div className="space-y-1">
              <span className="text-xs font-bold text-terracotta-dark block mb-1">Contraindications:</span>
              {personalization.avoid_reasons.map((r, i) => (
                <p key={i} className="text-xs text-terracotta-dark flex items-start gap-2">
                  <span className="font-bold">✕</span> {r}
                </p>
              ))}
            </div>
          )}
        </div>
      </Card>

      {/* ─── Routine Placement & Introduction Plan ────────────────── */}
      {personalization.routine_placement && (
        <Card className="p-6 border-border bg-card space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">📍</span>
            <h3 className="font-heading text-lg font-bold text-charcoal">
              Where it fits in your routine
            </h3>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl bg-cream/40 p-3.5 border border-border">
              <span className="text-[11px] font-semibold text-charcoal-lighter block uppercase">
                Time of Day
              </span>
              <span className="text-xs font-bold text-charcoal capitalize mt-0.5 block">
                {personalization.routine_placement.time_of_day === 'am'
                  ? '☀️ Morning Routine'
                  : personalization.routine_placement.time_of_day === 'pm'
                  ? '🌙 Evening Routine'
                  : '☀️ Morning or 🌙 Evening'}
              </span>
            </div>

            <div className="rounded-xl bg-cream/40 p-3.5 border border-border">
              <span className="text-[11px] font-semibold text-charcoal-lighter block uppercase">
                Frequency
              </span>
              <span className="text-xs font-bold text-charcoal mt-0.5 block">
                {personalization.routine_placement.frequency}
              </span>
            </div>

            <div className="rounded-xl bg-cream/40 p-3.5 border border-border">
              <span className="text-[11px] font-semibold text-charcoal-lighter block uppercase">
                Placement Action
              </span>
              <span className="text-xs font-bold text-charcoal mt-0.5 block">
                {personalization.routine_placement.replaces
                  ? `Replaces: ${personalization.routine_placement.replaces}`
                  : 'Add as new routine step'}
              </span>
            </div>
          </div>

          <div className="rounded-xl bg-sage/10 p-3.5 border border-sage/30 text-xs text-charcoal leading-relaxed">
            <strong className="text-sage-dark block mb-0.5">Conservative Introduction Schedule:</strong>
            {personalization.routine_placement.intro_plan}
          </div>
        </Card>
      )}

      {/* ─── Routine Conflict Warning (if conflicting) ─────────────── */}
      {conflicts.length > 0 && (
        <Card className="p-6 border-terracotta/40 bg-[var(--color-verdict-avoid-bg)] space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">⚡</span>
            <h3 className="font-heading text-base font-bold text-charcoal">
              Conflicts with your current routine
            </h3>
          </div>
          <div className="space-y-2">
            {conflicts.map((c, i) => (
              <div key={i} className="text-xs text-charcoal bg-white/70 p-3 rounded-xl border border-terracotta/20">
                <span className="font-bold text-terracotta-dark">
                  {c.ingredient_a} + {c.ingredient_b}
                </span>
                <p className="mt-0.5 text-charcoal-light">{c.recommendation}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* ─── Ingredient Breakdown for THIS User ────────────────────── */}
      <Card className="p-6 border-border bg-card space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🔬</span>
            <h3 className="font-heading text-lg font-bold text-charcoal">
              Ingredient Breakdown
            </h3>
          </div>
          <span className="text-xs text-charcoal-lighter">
            {ingredientsList.length} INCI ingredients identified
          </span>
        </div>

        {/* User Flags (Allergy / History matches) */}
        {flags.length > 0 && (
          <div className="space-y-2">
            {flags.map((f, i) => (
              <div
                key={i}
                className="rounded-xl border border-terracotta bg-blush-light p-3 text-xs text-terracotta-dark flex items-start gap-2"
              >
                <span>⚠️</span>
                <span>{f.message}</span>
              </div>
            ))}
          </div>
        )}

        {/* Key Actives */}
        <div>
          <span className="text-xs font-semibold text-charcoal block mb-2">Key Active Ingredients:</span>
          <div className="grid gap-2 sm:grid-cols-2">
            {synthesis.key_ingredients.map((ing, i) => (
              <div key={i} className="rounded-xl bg-cream/40 p-3 border border-border text-xs">
                <span className="font-bold text-charcoal">{ing.name}</span>
                <span className="text-charcoal-lighter ml-1 text-[11px]">({ing.function})</span>
                <p className="text-charcoal-light text-[11px] mt-0.5">{ing.benefit}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Potential Irritants */}
        {synthesis.potential_irritants.length > 0 && (
          <div className="pt-2 border-t border-border">
            <span className="text-xs font-semibold text-charcoal block mb-2">Formula Watchouts:</span>
            <div className="flex flex-wrap gap-2">
              {synthesis.potential_irritants.map((irr, i) => (
                <div key={i} className="text-xs rounded-lg bg-cream px-3 py-1.5 border border-border">
                  <span className="font-medium text-charcoal">{irr.name}:</span>{' '}
                  <span className="text-charcoal-light text-[11px]">{irr.note}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* ─── Review Summary by Source & Trust Notes ────────────────── */}
      <Card className="p-6 border-border bg-card space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">💬</span>
            <h3 className="font-heading text-lg font-bold text-charcoal">
              Community Review Summary & Trust Notes
            </h3>
          </div>
          <Badge variant="outline" className="text-xs capitalize">
            Sentiment: {synthesis.review_summary.overall_sentiment}
          </Badge>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {/* Common Praises */}
          <div className="rounded-xl bg-cream/30 p-4 border border-border space-y-1.5">
            <span className="text-xs font-bold text-sage-dark block">Common Community Praises:</span>
            <ul className="text-xs text-charcoal-light space-y-1 list-disc pl-4">
              {synthesis.review_summary.common_praises.map((p, i) => (
                <li key={i}>{p}</li>
              ))}
            </ul>
          </div>

          {/* Common Complaints */}
          <div className="rounded-xl bg-cream/30 p-4 border border-border space-y-1.5">
            <span className="text-xs font-bold text-terracotta-dark block">Common Criticisms:</span>
            <ul className="text-xs text-charcoal-light space-y-1 list-disc pl-4">
              {synthesis.review_summary.common_complaints.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Trust notes (promotional check) */}
        {synthesis.review_summary.trust_notes.length > 0 && (
          <div className="rounded-xl bg-cream p-3.5 border border-border text-xs text-charcoal-light leading-relaxed">
            <strong className="text-charcoal block mb-0.5">Community Trust Note:</strong>
            {synthesis.review_summary.trust_notes.join(' · ')}
          </div>
        )}
      </Card>

      {/* ─── Transparent Source Links ───────────────────────────────── */}
      <div className="text-xs text-charcoal-lighter space-y-1 px-1">
        <span className="font-medium">Information Sources Cited:</span>
        <div className="flex flex-wrap gap-2 pt-1">
          {sourceLinks.map((url, i) => (
            <a
              key={i}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sage hover:underline bg-white px-2.5 py-1 rounded-md border border-border truncate max-w-xs text-[11px]"
            >
              🔗 {new URL(url).hostname}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
