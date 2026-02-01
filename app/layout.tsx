import { defaultLocale } from '@/lib/i18n/config';
import './globals.css';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang={defaultLocale} dir={defaultLocale === 'ar' ? 'rtl' : 'ltr'}>
      <body>{children}</body>
    </html>
  );
}
