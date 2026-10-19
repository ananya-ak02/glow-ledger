import { Navbar } from '@/components/shared/navbar';
import { ReactionLogView } from '@/components/reactions/reaction-log-view';
import { SupabaseWakeup } from '@/components/shared/supabase-wakeup';

export const metadata = {
  title: 'Reaction & Trigger Log — GlowLedger',
  description:
    'Log negative skin reactions and auto-detect recurring ingredient triggers to protect your skin.',
};

export default function ReactionsPage() {
  return (
    <SupabaseWakeup>
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1">
          <ReactionLogView />
        </main>
      </div>
    </SupabaseWakeup>
  );
}
