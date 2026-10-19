import { Navbar } from '@/components/shared/navbar';
import { RoutineAnalyzerView } from '@/components/routine/routine-analyzer-view';
import { SupabaseWakeup } from '@/components/shared/supabase-wakeup';

export const metadata = {
  title: 'Routine Analyzer — GlowLedger',
  description:
    'Comprehensive skincare routine analysis. Detect chemical conflicts, layering order issues, and missing targeted ingredients.',
};

export default function RoutinePage() {
  return (
    <SupabaseWakeup>
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1">
          <RoutineAnalyzerView />
        </main>
      </div>
    </SupabaseWakeup>
  );
}
