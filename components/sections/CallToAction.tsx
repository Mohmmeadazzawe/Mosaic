import Link from 'next/link';
import type { Dictionary } from '@/lib/i18n/dictionary';
import type { Locale } from '@/lib/i18n/config';

interface CallToActionProps {
  locale: Locale;
  dict: Dictionary;
}

export default function CallToAction({ locale, dict }: CallToActionProps) {
  const ctaTitle = dict?.home?.ctaTitle || (locale === 'ar' ? 'انضم إلينا وساعد في إحداث فرق' : 'Join us and help make a difference');
  const ctaSubtitle = dict?.home?.ctaSubtitle || (locale === 'ar' ? 'يمكنك المساهمة في عملنا الإنساني من خلال التبرع أو التطوع معنا' : 'You can contribute to our humanitarian work by donating or volunteering with us');
  const donateNow = dict?.home?.donateNow || (locale === 'ar' ? 'تبرع الآن' : 'Donate Now');
  const joinUs = dict?.nav?.joinus || (locale === 'ar' ? 'انضم إلينا' : 'Join Us');

  return (
    <section className="w-full py-6 md:py-8">
      <div 
        className="w-full px-[3%] md:px-[4%] py-8 md:py-10 mx-auto"
        style={{
          background: 'linear-gradient(to right, #1e40af, #3b82f6)',
        }}
      >
        <div className="container mx-auto text-center">
          {/* Main Heading */}
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3 md:mb-4">
            {ctaTitle}
          </h2>
          
          {/* Subheading */}
          <p className="text-base md:text-lg text-white/90 mb-6 md:mb-8 max-w-3xl mx-auto">
            {ctaSubtitle}
          </p>
          
          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center items-center">
            {/* Join Us Button - White with border */}
            <Link
              href={`/${locale}/joinus`}
              className="bg-white text-[#4DA2DF] border-2 border-[#4DA2DF] px-8 py-3 md:px-10 md:py-4 font-bold hover:bg-[#EDF5FB] transition-colors duration-200 text-base md:text-lg whitespace-nowrap"
            >
              {joinUs}
            </Link>
            
            {/* Donate Now Button - Light Blue */}
            <Link
              href={`/${locale}/donations`}
              className="bg-[#4DA2DF] text-white px-8 py-3 md:px-10 md:py-4 font-bold hover:bg-[#3993d4] transition-colors duration-200 text-base md:text-lg whitespace-nowrap"
            >
              {donateNow}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
