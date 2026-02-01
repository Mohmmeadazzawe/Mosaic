import { getDictionary } from '@/lib/i18n/dictionary';
import JoinUsForm from '@/components/sections/JoinUsForm';
import type { Locale } from '@/lib/i18n/config';

export default function JoinUsPage({ params }: { params: { locale: Locale } }) {
  const { locale } = params;
  const dict = getDictionary(locale);

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-center">
          {dict.nav.joinus}
        </h1>
        
        <p className="text-xl text-gray-600 mb-12 text-center">
          {locale === 'ar'
            ? 'انضم إلينا في رحلتنا لصنع التغيير الإيجابي. نحن نبحث عن متطوعين متحمسين ومتفانين للمساهمة في مهمتنا الإنسانية.'
            : 'Join us on our journey to make positive change. We are looking for passionate and dedicated volunteers to contribute to our humanitarian mission.'}
        </p>

        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-6">
            {locale === 'ar' ? 'نموذج التسجيل' : 'Registration Form'}
          </h2>
          <JoinUsForm locale={locale} dict={dict} />
        </div>

        <div className="mt-8 bg-blue-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">
            {locale === 'ar' ? 'لماذا تنضم إلينا؟' : 'Why Join Us?'}
          </h3>
          <ul className="space-y-2 text-gray-700">
            <li>
              {locale === 'ar'
                ? '• فرصة للمساهمة في قضايا إنسانية مهمة'
                : '• Opportunity to contribute to important humanitarian causes'}
            </li>
            <li>
              {locale === 'ar'
                ? '• تطوير المهارات والخبرات'
                : '• Develop skills and experience'}
            </li>
            <li>
              {locale === 'ar'
                ? '• العمل ضمن فريق متعاون ومتفاني'
                : '• Work with a cooperative and dedicated team'}
            </li>
            <li>
              {locale === 'ar'
                ? '• إحداث فرق حقيقي في حياة الآخرين'
                : '• Make a real difference in others\' lives'}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
