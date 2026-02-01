import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { locales } from '@/lib/i18n/config';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HtmlAttributes from '@/components/layout/HtmlAttributes';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const { locale } = params;
  return {
    title: locale === 'ar' ? 'موزاييك للإغاثة والتنمية الإنسانية' : 'Mosaic HRD',
    description:
      locale === 'ar'
        ? 'موزاييك للإغاثة والتنمية الإنسانية - نصنع التغيير الإيجابي لمن يحتاجه'
        : 'Mosaic for Humanitarian Relief and Development - Making positive change for those in need',
  };
}

export default function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const { locale } = params;
  if (!locales.includes(locale as any)) {
    notFound();
  }

  const dir = locale === 'ar' ? 'rtl' : 'ltr';
  const lang = locale;

  return (
    <>
      <HtmlAttributes lang={lang} dir={dir} />
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header locale={locale as any} />
        <main className="flex-grow mt-[126px]">{children}</main>
        <Footer locale={locale as any} />
      </div>
    </>
  );
}
