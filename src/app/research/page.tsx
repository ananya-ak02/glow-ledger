import { Navbar } from '@/components/shared/navbar';
import { ResearchPageView } from '@/components/research/research-page-view';
import { SupabaseWakeup } from '@/components/shared/supabase-wakeup';

export const metadata = {
  title: 'Product Research Engine — GlowLedger',
  description:
    'Research any skincare product. Get an objective, personalized verdict with ingredient breakdowns, Reddit sentiment analysis, and routine placement.',
};

export default function ResearchPage() {
  return (
    <SupabaseWakeup>
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1">
          <ResearchPageView />
        </main>
      </div>
    </SupabaseWakeup>
  );
}
