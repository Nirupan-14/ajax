import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Ceramic Pro Ajax | Premium Detailing & Ceramic Coating',
  description:
    'Ceramic Pro Ajax c/o Flawless Finish — Expert car detailing, ceramic coating, paint correction, window tinting, vehicle wraps & PPF in Ajax, ON. 5.0★ · 193 Reviews · Open 7 Days.',
  keywords:
    'ceramic coating Ajax, car detailing Ajax Ontario, paint correction Ajax, window tinting Ajax, vehicle wraps Ajax, PPF Ajax, auto detailing GTA',
  authors: [{ name: 'Ceramic Pro Ajax' }],
  openGraph: {
    title: 'Ceramic Pro Ajax | Premium Detailing & Ceramic Coating',
    description:
      'Expert detailing & ceramic coating in Ajax, ON. 5.0★ Google Rating · 193 Reviews · Mobile Service.',
    type: 'website',
    locale: 'en_CA',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="bg-black scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
