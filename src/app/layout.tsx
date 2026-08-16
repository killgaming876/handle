import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'HANDLE — We Handle It.',
  description: 'A business operating system for customer conversations, repetitive work and everyday operations.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
