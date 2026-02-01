import { getDictionary } from '@/lib/i18n/dictionary';
import Hero from '@/components/sections/Hero';
import AboutUsSection from '@/components/sections/AboutUsSection';
import Sectors from '@/components/sections/Sectors';
import Projects from '@/components/sections/Projects';
import SuccessStories from '@/components/sections/SuccessStories';
import CallToAction from '@/components/sections/CallToAction';
import Partners from '@/components/sections/Partners';
import type { Locale } from '@/lib/i18n/config';

export default function HomePage({ params }: { params: { locale: Locale } }) {
  const { locale } = params;
  const dict = getDictionary(locale);

  return (
    <div>
      <Hero locale={locale} dict={dict} />
      <AboutUsSection locale={locale} dict={dict} />
      <Sectors locale={locale} dict={dict} />
      <Projects locale={locale} dict={dict} />
      <SuccessStories locale={locale} dict={dict} />
      <CallToAction locale={locale} dict={dict} />
      <Partners locale={locale} dict={dict} />
    </div>
  );
}
