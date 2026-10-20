import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { RoutineAnalysis } from '@/types/ai';

interface RoutineOverviewCardProps {
  assessment: string;
  correctSteps: RoutineAnalysis['correct'];
  metadata?: {
    modelUsed: string;
    provider: string;
    isMock: boolean;
  };
}

export function RoutineOverviewCard({
  assessment,
  correctSteps,
  metadata,
}: RoutineOverviewCardProps) {
  return (
    <Card className="p-6 border-border bg-card space-y-6">
      {/* Header with Assessment */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <Badge variant="good" className="text-xs">
            Routine Intelligence Verdict
          </Badge>

          {metadata && (
            <span className="text-[11px] text-charcoal-lighter">
              Engine: <strong className="text-charcoal capitalize">{metadata.modelUsed}</strong>
              {metadata.isMock && ' (Deterministic)'}
            </span>
          )}
        </div>

        <h2 className="font-heading text-xl font-bold text-charcoal leading-snug">
          Overall Assessment
        </h2>
        <p className="mt-2 text-sm text-charcoal-light leading-relaxed bg-cream/40 p-4 rounded-xl border border-border">
          {assessment}
        </p>
        {metadata?.isMock && (
          <div className="mt-2.5 rounded-lg border border-sage/40 bg-[var(--color-verdict-good-bg)]/60 px-3.5 py-2 text-[11px] text-charcoal flex items-center justify-between gap-2">
            <span className="flex items-center gap-1.5">
              <span>⚡</span>
              <span>
                Powered by the <strong>Zero-Cost Deterministic Rules Engine</strong> (Offline Mode). Add a free Gemini or Groq API key in <code className="bg-white/80 px-1 py-0.5 rounded border border-border">.env.local</code> to activate live LLM generative personalization!
              </span>
            </span>
          </div>
        )}
      </div>

      {/* What's Working */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">🌿</span>
          <h3 className="font-heading text-sm font-bold text-charcoal">
            What You&apos;re Doing Right
          </h3>
        </div>

        <div className="space-y-2.5">
          {correctSteps.map((step, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-border bg-[var(--color-verdict-good-bg)] p-3.5 flex items-start gap-3"
            >
              <span className="text-xs text-sage font-bold mt-0.5">✓</span>
              <div>
                <span className="text-xs font-semibold text-charcoal">
                  {step.step}
                </span>
                <p className="text-xs text-charcoal-light mt-0.5">
                  {step.reason}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
