import Link from 'next/link';

export default function LandingPage() {
  return (
    <main className="flex min-h-screen flex-col">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-[var(--space-page)] py-4 border-b border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sage text-white shadow-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
            >
              <path d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446A9 9 0 1 1 8.25 4.407 7.5 7.5 0 0 0 12 3Z" />
            </svg>
          </div>
          <span className="font-heading text-xl font-bold tracking-tight text-charcoal">
            GlowLedger
          </span>
        </div>

        <div className="hidden sm:flex items-center gap-6 text-xs font-semibold text-charcoal-light">
          <Link href="/research" className="hover:text-charcoal transition-colors">
            Research Engine
          </Link>
          <Link href="/routine" className="hover:text-charcoal transition-colors">
            Routine Analyzer
          </Link>
          <Link href="/safety" className="hover:text-charcoal transition-colors">
            Safety & Ethics
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="rounded-full px-5 py-2 text-xs font-semibold text-charcoal transition-colors hover:bg-cream-dark"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="rounded-full bg-sage px-5 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:bg-sage-dark hover:shadow-md"
          >
            Get started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex flex-1 flex-col items-center justify-center px-[var(--space-page)] py-16 text-center">
        <div className="mx-auto max-w-2xl animate-fade-in">
          {/* Soft gradient blob behind heading */}
          <div className="relative">
            <div className="absolute -top-20 left-1/2 -z-10 h-72 w-72 -translate-x-1/2 rounded-full bg-gradient-to-br from-blush via-sage-light to-cream opacity-60 blur-3xl" />
            <span className="inline-block rounded-full bg-sage/10 border border-sage/30 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-sage-dark mb-4">
              Zero-Cost Skincare Intelligence
            </span>
            <h1 className="font-heading text-4xl font-bold leading-tight tracking-tight text-charcoal sm:text-5xl md:text-6xl">
              Let&apos;s understand{' '}
              <span className="bg-gradient-to-r from-sage-dark to-terracotta bg-clip-text text-transparent">
                your skin
              </span>
            </h1>
          </div>

          <p className="mt-6 text-lg leading-relaxed text-charcoal-light sm:text-xl">
            Stop guessing. Find out if a product is right for{' '}
            <em className="font-medium text-terracotta">your</em> skin,
            and exactly where it fits in your routine.
          </p>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/onboarding"
              className="w-full rounded-full bg-sage px-8 py-3.5 text-base font-semibold text-white shadow-md transition-all hover:bg-sage-dark hover:shadow-lg sm:w-auto"
            >
              Start your skin profile
            </Link>
            <Link
              href="/research"
              className="w-full rounded-full border border-border bg-card px-8 py-3.5 text-base font-semibold text-charcoal transition-colors hover:bg-cream-dark sm:w-auto shadow-sm"
            >
              Research a product →
            </Link>
          </div>

          {/* Trust line */}
          <p className="mt-8 text-xs text-charcoal-lighter">
            Free forever · No credit card · Private & Open Source · Permanent zero-cost stack
          </p>
        </div>
      </section>

      {/* How it works */}
      <section
        id="how-it-works"
        className="bg-card px-[var(--space-page)] py-20 border-t border-border"
      >
        <div className="mx-auto max-w-4xl">
          <h2 className="font-heading text-center text-3xl font-bold text-charcoal">
            How GlowLedger works
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-charcoal-light text-sm">
            Three steps to ending skincare decision paralysis
          </p>

          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {[
              {
                step: '01',
                title: 'Tell us about your skin',
                description:
                  'Quick 5-step intake: skin type, concerns, active routine, and products that previously caused irritation or breakouts.',
                colorClass: 'bg-sage',
                href: '/onboarding',
                cta: 'Start intake →',
              },
              {
                step: '02',
                title: 'Research any product',
                description:
                  'Paste a product name or ingredient list. We check Reddit, INCI databases, and formulas — then deliver a personalized verdict.',
                colorClass: 'bg-terracotta',
                href: '/research',
                cta: 'Research now →',
              },
              {
                step: '03',
                title: 'Build your routine',
                description:
                  'Scientific thinnest-to-thickest layering with a safe, one-new-active-at-a-time intro schedule that protects your barrier.',
                colorClass: 'bg-sage-dark',
                href: '/routine/builder',
                cta: 'View builder →',
              },
            ].map((item) => (
              <Link
                key={item.step}
                href={item.href}
                className="group rounded-2xl border border-border bg-card p-6 shadow-card transition-all hover:shadow-lg hover:border-sage flex flex-col justify-between text-left"
              >
                <div>
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold text-white ${item.colorClass}`}
                  >
                    {item.step}
                  </div>
                  <h3 className="mt-4 font-heading text-lg font-semibold text-charcoal group-hover:text-sage-dark transition-colors">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-charcoal-light">
                    {item.description}
                  </p>
                </div>
                <span className="mt-4 text-xs font-semibold text-sage-dark pt-3 border-t border-border/60">
                  {item.cta}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Disclaimer footer */}
      <footer className="border-t border-border bg-background px-[var(--space-page)] py-10">
        <div className="mx-auto max-w-4xl text-center space-y-4">
          <div className="flex flex-wrap justify-center gap-6 text-xs font-semibold text-charcoal-light">
            <Link href="/onboarding" className="hover:text-charcoal transition-colors">Skin Profile</Link>
            <Link href="/research" className="hover:text-charcoal transition-colors">Product Research</Link>
            <Link href="/routine" className="hover:text-charcoal transition-colors">Routine Analyzer</Link>
            <Link href="/routine/builder" className="hover:text-charcoal transition-colors">Routine Builder</Link>
            <Link href="/reactions" className="hover:text-charcoal transition-colors">Reaction Log</Link>
            <Link href="/wishlist" className="hover:text-charcoal transition-colors">Wishlist & Compare</Link>
            <Link href="/safety" className="hover:text-charcoal transition-colors font-bold text-terracotta">Safety & Disclaimers</Link>
          </div>

          <p className="text-xs leading-relaxed text-charcoal-lighter max-w-2xl mx-auto">
            GlowLedger is for informational and educational purposes only and is not medical
            advice. Always patch test new products and consult a board-certified dermatologist
            for persistent skin concerns or severe acne. Distributed as an open-source portfolio demonstration project.
          </p>

          <p className="text-xs text-charcoal-lighter pt-2 border-t border-border/50">
            © 2026 GlowLedger · Built with 🌿, Next.js, Supabase, Gemini Flash & Groq · Zero Paid Infrastructure
          </p>
        </div>
      </footer>
    </main>
  );
}
