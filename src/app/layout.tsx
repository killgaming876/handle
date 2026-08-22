import type { Metadata } from 'next';
import './globals.css';
import UltraEffects from '@/components/UltraEffects';
import AdaptiveQualityRuntime from '@/components/AdaptiveQualityRuntime';

export const metadata: Metadata = {
  title: 'HANDLE — We Handle It.',
  description: 'HANDLE is the business operating system that connects conversations, tools, knowledge and repetitive work.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <AdaptiveQualityRuntime />
        <UltraEffects />
        {children}
      </body>
    </html>
  );
}
