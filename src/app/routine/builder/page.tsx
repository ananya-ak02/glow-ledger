import { Navbar } from '@/components/shared/navbar';
import { RoutineBuilderView } from '@/components/routine/routine-builder-view';
import { SupabaseWakeup } from '@/components/shared/supabase-wakeup';

export const metadata = {
  title: 'Routine Builder & Intro Timeline — GlowLedger',
  description:
    'Build an optimized AM and PM routine with a safe, sequential one-new-active-at-a-time introduction schedule.',
};

export default function RoutineBuilderPage() {
  return (
    <SupabaseWakeup>
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1">
          <RoutineBuilderView />
        </main>
      </div>
    </SupabaseWakeup>
  );
}
