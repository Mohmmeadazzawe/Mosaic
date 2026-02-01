import type { Dictionary } from '@/lib/i18n/dictionary';
import type { Locale } from '@/lib/i18n/config';

interface ServicesProps {
  locale: Locale;
  dict: Dictionary;
}

export default function Services({ locale, dict }: ServicesProps) {
  const services = [
    {
      title: locale === 'ar' ? 'الإغاثة الطارئة' : 'Emergency Relief',
      description: locale === 'ar' 
        ? 'تقديم المساعدات العاجلة للمتضررين'
        : 'Providing urgent assistance to those affected',
      icon: '🚑',
    },
    {
      title: locale === 'ar' ? 'التعليم' : 'Education',
      description: locale === 'ar'
        ? 'دعم التعليم في المناطق المحتاجة'
        : 'Supporting education in needy areas',
      icon: '📚',
    },
    {
      title: locale === 'ar' ? 'التمكين الاقتصادي' : 'Economic Empowerment',
      description: locale === 'ar'
        ? 'دعم المشاريع الصغيرة والمتوسطة'
        : 'Supporting small and medium enterprises',
      icon: '💼',
    },
    {
      title: locale === 'ar' ? 'الدعم النفسي' : 'Psychological Support',
      description: locale === 'ar'
        ? 'تقديم الدعم النفسي والاجتماعي'
        : 'Providing psychological and social support',
      icon: '💙',
    },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          {locale === 'ar' ? 'خدماتنا' : 'Our Services'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="text-4xl mb-4">{service.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
              <p className="text-gray-600">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
