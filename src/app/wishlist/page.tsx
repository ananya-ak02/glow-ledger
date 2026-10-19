import { Navbar } from '@/components/shared/navbar';
import { WishlistView } from '@/components/wishlist/wishlist-view';
import { SupabaseWakeup } from '@/components/shared/supabase-wakeup';

export const metadata = {
  title: 'Wishlist & Product Compare — GlowLedger',
  description:
    'Compare two skincare products side-by-side using cached reports without additional AI API costs.',
};

export default function WishlistPage() {
  return (
    <SupabaseWakeup>
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1">
          <WishlistView />
        </main>
      </div>
    </SupabaseWakeup>
  );
}
