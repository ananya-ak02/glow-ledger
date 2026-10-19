import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { RoutineAnalysis } from '@/types/ai';
import type { VerdictFlag } from '@/types/database';

interface ConflictAlertCardProps {
  conflicts: RoutineAnalysis['conflicts'];
  issues: RoutineAnalysis['issues'];
  flags?: VerdictFlag[];
}

export function ConflictAlertCard({ conflicts, issues, flags = [] }: ConflictAlertCardProps) {
  const hasSevereIssues =
    conflicts.length > 0 ||
    issues.some((i) => i.severity === 'major') ||
    flags.length > 0;

  if (!hasSevereIssues && issues.length === 0) {
    return (
      <Card className="p-6 border-sage/40 bg-[var(--color-verdict-good-bg)] shadow-sm">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🌿</span>
          <div>
            <h4 className="font-heading text-base font-semibold text-charcoal">
              No Active Conflicts Detected
            </h4>
            <p className="text-xs text-charcoal-light mt-0.5">
              Your selected products do not present high-risk chemical contraindications (e.g. stacking retinoids with AHA/BHAs).
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Pregnancy / Allergy Safety Flags */}
      {flags.map((flag, idx) => (
        <Card
          key={idx}
          className="p-5 border-terracotta bg-[var(--color-verdict-avoid-bg)] shadow-sm"
        >
          <div className="flex items-start gap-3">
            <span className="text-xl">⚠️</span>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="font-heading text-sm font-bold text-charcoal">
                  {flag.type === 'pregnancy' ? 'Pregnancy Safety Contraindication' : 'Allergy / Sensitivity Warning'}
                </h4>
                <Badge variant="avoid" className="text-[10px] uppercase">
                  Safety Flag
                </Badge>
              </div>
              <p className="mt-1 text-xs text-terracotta-dark leading-relaxed">
                {flag.message}
              </p>
            </div>
          </div>
        </Card>
      ))}

      {/* Ingredient Conflicts */}
      {conflicts.map((conflict, idx) => (
        <Card
          key={idx}
          className="p-5 border-terracotta/40 bg-[var(--color-verdict-avoid-bg)] shadow-sm"
        >
          <div className="flex items-start gap-3">
            <span className="text-xl">⚡</span>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-charcoal">
                    {conflict.ingredient_a} + {conflict.ingredient_b}
                  </span>
                </div>
                <Badge variant="avoid" className="text-[10px]">
                  Conflict
                </Badge>
              </div>
              <p className="mt-1 text-xs text-charcoal-light">
                <strong>Issue:</strong> {conflict.issue}
              </p>
              <div className="mt-2.5 rounded-lg bg-white/70 p-2.5 border border-terracotta/20 text-xs text-charcoal">
                <span className="font-semibold text-terracotta-dark">Recommendation:</span>{' '}
                {conflict.recommendation}
              </div>
            </div>
          </div>
        </Card>
      ))}

      {/* Formula & Timing Issues */}
      {issues.map((issue, idx) => (
        <Card
          key={idx}
          className="p-5 border-border bg-card shadow-sm"
        >
          <div className="flex items-start gap-3">
            <span className="text-xl">
              {issue.severity === 'major' ? '⚠️' : '💡'}
            </span>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-charcoal">
                  {issue.step}
                </h4>
                <Badge
                  variant={issue.severity === 'major' ? 'avoid' : 'caution'}
                  className="text-[10px] capitalize"
                >
                  {issue.severity} Issue
                </Badge>
              </div>
              <p className="mt-1 text-xs text-charcoal-light">
                {issue.issue}
              </p>
              <p className="mt-2 text-xs text-sage-dark font-medium">
                → {issue.suggestion}
              </p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
