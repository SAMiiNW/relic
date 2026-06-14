import type { Metadata } from 'next';
import { Cormorant_Garamond, Outfit, Space_Mono } from 'next/font/google';
import './globals.css';

const cormorant = Cormorant_Garamond({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-cormorant',
  display: 'swap',
});
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit', display: 'swap' });
const spaceMono = Space_Mono({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-space-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Relic | On-chain AI provenance oracle',
  description:
    'Register an artifact and submit provenance evidence. An injection-resistant AI authenticator rules GENUINE, DOUBTFUL, or FORGERY with an authenticity score under GenLayer validator consensus, issuing a tamper-evident certificate of authenticity on-chain.',
  openGraph: {
    title: 'Relic | On-chain AI provenance oracle',
    description:
      'A certificate of authenticity issued by AI under GenLayer validator consensus. Evidence in, ruling on-chain.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${outfit.variable} ${spaceMono.variable}`}
    >
      <body className="bg-stock text-parchment font-body antialiased">{children}</body>
    </html>
  );
}
