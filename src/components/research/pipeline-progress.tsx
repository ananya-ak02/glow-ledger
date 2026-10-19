'use client';

interface PipelineProgressProps {
  currentStage: string;
}

export function PipelineProgress({ currentStage }: PipelineProgressProps) {
  const stages = [
    { label: 'Check Shared Cache', desc: 'Postgres TTL database' },
    { label: 'Resolve Ingredients', desc: 'Open Beauty Facts API' },
    { label: 'Community Review', desc: 'Reddit & Public Forums' },
    { label: 'AI Synthesis', desc: 'Gemini 2.0 Flash' },
    { label: 'Personalized Verdict', desc: 'Tailored to your skin' },
  ];

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="relative flex h-8 w-8 items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-sage-light opacity-40 animate-ping" />
          <div className="relative flex h-6 w-6 items-center justify-center rounded-full bg-sage text-white text-xs font-bold">
            ✦
          </div>
        </div>
        <div>
          <h4 className="text-sm font-bold text-charcoal">
            Conducting Product Intelligence Research
          </h4>
          <p className="text-xs text-sage-dark font-medium animate-pulse">
            {currentStage || 'Initializing research pipeline...'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2">
        {stages.map((st, idx) => (
          <div
            key={idx}
            className="rounded-xl border border-border/70 bg-cream/30 p-2.5 text-center"
          >
            <div className="text-[10px] font-semibold text-charcoal-lighter uppercase">
              Step {idx + 1}
            </div>
            <div className="text-xs font-medium text-charcoal mt-0.5 truncate">
              {st.label}
            </div>
            <div className="text-[10px] text-charcoal-lighter truncate">
              {st.desc}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
