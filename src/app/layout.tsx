import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'GlowLedger — Your Skincare Intelligence',
  description:
    'Personalized skincare analysis. Find out if a product is right for YOUR skin and where it fits in YOUR routine.',
  keywords: ['skincare', 'routine', 'ingredients', 'analysis', 'personalized'],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#FAF6F1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background antialiased">
        {children}
      </body>
    </html>
  );
}
