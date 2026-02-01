import { mockStatistics } from '@/lib/mockData';
import type { Dictionary } from '@/lib/i18n/dictionary';
import type { Locale } from '@/lib/i18n/config';

interface StatisticsProps {
  locale: Locale;
  dict: Dictionary;
}

export default function Statistics({ locale, dict }: StatisticsProps) {
  return (
    <section className="py-16 bg-blue-600 text-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          {locale === 'ar' ? 'إحصائياتنا' : 'Our Statistics'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {mockStatistics.map((stat) => (
            <div key={stat.id} className="text-center">
              <div className="text-5xl font-bold mb-2">{stat.value}+</div>
              <div className="text-xl">
                {locale === 'ar' ? stat.label : stat.labelEn}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
