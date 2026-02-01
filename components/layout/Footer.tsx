import Link from 'next/link';
import { SITE_CONFIG } from '@/lib/constants';
import type { Locale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionary';

interface FooterProps {
  locale: Locale;
}

export default function Footer({ locale }: FooterProps) {
  const dict = getDictionary(locale);

  return (
    <footer className="bg-gray-800 text-white mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">
              {locale === 'ar' ? SITE_CONFIG.nameAr : SITE_CONFIG.name}
            </h3>
            <p className="text-gray-300">
              {locale === 'ar'
                ? '💙موزاييك تساعد من القلب'
                : '💙Mosaic helps from the heart'}
            </p>
            <p className="text-gray-300 mt-2">
              {locale === 'ar'
                ? 'تعرف أكثر على رحلة موزاييك ورؤيتها. في هذا القسم نشارككم قصتنا وقيمنا ورسالتنا لنصنع التغيير الإيجابي لمن يحتاجه'
                : 'Learn more about Mosaic\'s journey and vision. In this section we share our story, values and message to make positive change for those in need'}
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">
              {locale === 'ar' ? 'الصفحات' : 'Pages'}
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href={`/${locale}`} className="text-gray-300 hover:text-white">
                  {dict.nav.home}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/projects`} className="text-gray-300 hover:text-white">
                  {dict.nav.projects}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/about`} className="text-gray-300 hover:text-white">
                  {dict.nav.about}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/contact`} className="text-gray-300 hover:text-white">
                  {dict.nav.contact}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">
              {locale === 'ar' ? 'مكتبنا' : 'Our Office'}
            </h4>
            <p 
              className="text-gray-300" 
              dir={locale === 'ar' ? 'rtl' : 'ltr'} 
              lang={locale}
            >
              {SITE_CONFIG.address[locale]}
            </p>
            <p className="text-gray-300 mt-2">
              <a href={`mailto:${SITE_CONFIG.email}`} className="hover:text-white">
                {SITE_CONFIG.email}
              </a>
            </p>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-4 text-center text-gray-400">
          <p>Peaklink 2025. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  );
}
