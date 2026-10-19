import { Navbar } from '@/components/shared/navbar';
import { OnboardingWizard } from '@/components/onboarding/onboarding-wizard';
import { SupabaseWakeup } from '@/components/shared/supabase-wakeup';

export const metadata = {
  title: 'Skin Profile Onboarding — GlowLedger',
  description: 'Tell us about your skin type, concerns, current routine, and past triggers.',
};

export default function OnboardingPage() {
  return (
    <SupabaseWakeup>
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1">
          <OnboardingWizard />
        </main>
      </div>
    </SupabaseWakeup>
  );
}
