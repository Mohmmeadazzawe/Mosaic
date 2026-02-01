import nextDynamic from 'next/dynamic';
import { getDictionary } from '@/lib/i18n/dictionary';
import { SITE_CONFIG } from '@/lib/constants';
import ContactForm from '@/components/sections/ContactForm';
import Loading from '@/components/common/Loading';
import type { Locale } from '@/lib/i18n/config';

const ContactMap = nextDynamic(
  () => import('@/components/sections/ContactMap'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[400px] flex items-center justify-center bg-gray-100 rounded-lg">
        <Loading text="" size="medium" />
      </div>
    ),
  }
);

export default async function ContactPage({ params }: { params: { locale: Locale } }) {
  const { locale } = params;
  const dict = getDictionary(locale);

  const contactLabel = locale === 'ar' ? 'تواصل' : 'Contact';
  const getInTouch = locale === 'ar' ? 'تواصل معنا' : 'Get in Touch';
  const description =
    locale === 'ar'
      ? 'املأ النموذج وسيتواصل معك فريقنا خلال 24 ساعة.'
      : 'Fill in the form and our team will contact you within 24 hours.';
  const addressLabel = locale === 'ar' ? 'العنوان' : 'Address';
  const emailLabel = locale === 'ar' ? 'البريد الإلكتروني' : 'Email';
  const ourLocation = locale === 'ar' ? 'موقعنا' : 'Our Location';
  const mapTitle = locale === 'ar' ? 'موقع الجمعية' : 'Association Location';

  return (
    <div className="min-h-screen">
      {/* Main contact block - like old build: one row, info left + form right */}
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 max-w-6xl mx-auto px-4 md:px-6 py-12 md:py-16 bg-white rounded-2xl shadow-sm border border-gray-100 mx-4 md:mx-6 lg:mx-auto">
        {/* Left: Contact info */}
        <div className="flex-1 px-4 md:px-8 py-6 lg:py-8">
          <p className="text-[#4DA2DF] text-base font-semibold mb-2">{contactLabel}</p>
          <h1 className="text-gray-800 text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
            {getInTouch}
          </h1>
          <p className="text-gray-600 text-base mb-8 max-w-md">{description}</p>

          <div className="flex flex-col gap-6 md:gap-8">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-[#EDF5FB] flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-[#4DA2DF]"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden
                >
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                </svg>
              </div>
              <div>
                <h3 className="text-gray-800 font-semibold text-lg mb-1">{addressLabel}</h3>
                <p className="text-gray-600">{SITE_CONFIG.address[locale]}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-[#EDF5FB] flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-[#4DA2DF]"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden
                >
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-gray-800 font-semibold text-lg mb-1">{emailLabel}</h3>
                <a
                  href={`mailto:${SITE_CONFIG.email}`}
                  className="text-[#4DA2DF] hover:text-[#25445E] transition-colors"
                >
                  {SITE_CONFIG.email}
                </a>
              </div>
            </div>

          </div>
        </div>

        {/* Right: Form in card */}
        <div className="flex-1 bg-[#EDF5FB]/60 lg:bg-[#f8f9fa] rounded-2xl p-6 md:p-8 border border-[#4DA2DF]/10">
          <ContactForm locale={locale} dict={dict} />
        </div>
      </div>

      {/* Map section - like old build */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-10 md:py-14">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-gray-400 font-light">——</span>
          <span className="text-gray-500 text-sm uppercase tracking-widest">{ourLocation}</span>
        </div>
        <h2 className="text-[#25445E] text-2xl md:text-3xl font-bold mb-6 md:mb-8">
          {mapTitle}
        </h2>
        <div className="w-full min-h-[400px] rounded-xl overflow-hidden bg-gray-100">
          <ContactMap locale={locale} />
        </div>
      </div>
    </div>
  );
}
