import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface LayeringTimelineProps {
  layeringOrder: { step: number; product: string; category: string }[];
}

export function LayeringTimeline({ layeringOrder }: LayeringTimelineProps) {
  if (layeringOrder.length === 0) {
    return (
      <Card className="p-6 border-border bg-card text-center">
        <p className="text-xs text-charcoal-light">
          Add products to your routine to see the scientific layering sequence.
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-6 border-border bg-card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <span className="text-xl">📋</span>
          <div>
            <h3 className="font-heading text-lg font-bold text-charcoal">
              Scientific Layering Order
            </h3>
            <p className="text-xs text-charcoal-light">
              Formulated from thinnest consistency to thickest occlusive to maximize molecular absorption
            </p>
          </div>
        </div>
        <Badge variant="outline" className="text-xs">
          Thinnest → Thickest
        </Badge>
      </div>

      <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-border">
        {layeringOrder.map((step, idx) => (
          <div key={idx} className="relative flex items-center justify-between gap-4">
            {/* Step dot */}
            <div className="absolute -left-6 flex h-5 w-5 items-center justify-center rounded-full bg-sage text-white text-[10px] font-bold ring-4 ring-card">
              {idx + 1}
            </div>

            <div className="flex-1 rounded-xl border border-border bg-cream/30 p-3.5 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-charcoal">
                  {step.product}
                </span>
                <div className="text-[11px] text-charcoal-lighter capitalize">
                  {step.category}
                </div>
              </div>

              <div className="text-[11px] text-charcoal-light font-medium bg-white px-2.5 py-1 rounded-md border border-border">
                Step {idx + 1}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
