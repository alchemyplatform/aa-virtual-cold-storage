import { BaseLayout } from '@/components/layout/base';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

// Next.js edge runtime
// https://nextjs.org/docs/pages/api-reference/edge
// export const runtime = 'edge';
// export const preferredRegion = 'iad1';

export const metadata: Metadata = {
  title: 'Cold Storage Plugin',
  description: 'Alchemy Modular Account with Cold Storage Plugin'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <BaseLayout>{children}</BaseLayout>
        </Providers>
      </body>
    </html>
  );
}
