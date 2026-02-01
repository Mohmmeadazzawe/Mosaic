import Link from 'next/link';
import type { SectorItem } from '@/lib/api/sectors';
import type { Dictionary } from '@/lib/i18n/dictionary';
import type { Locale } from '@/lib/i18n/config';

interface AboutSectorsProps {
  sectors: SectorItem[];
  locale: Locale;
  dict: Dictionary;
}

export default function AboutSectors({ sectors, locale, dict }: AboutSectorsProps) {
  if (sectors.length === 0) return null;

  return (
    <section className="container mx-auto px-[3%] md:px-[4%] py-8 md:py-12">
      <h2 className="text-3xl md:text-4xl font-bold text-[#25445E] mb-8 md:mb-12 text-center">
        {dict.about.sectorsTitle}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 md:gap-8">
        {sectors.map((sector) => (
          <div
            key={sector.id}
            className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col"
          >
            <div
              className="h-2 w-full"
              style={{ backgroundColor: sector.color || '#4DA2DF' }}
            />
            <div className="p-6 flex-grow flex flex-col">
              <h3 className="text-xl md:text-2xl font-bold text-[#25445E] mb-6 flex-grow">
                {sector.name}
              </h3>
              <Link
                href={`/${locale}/sectors/${sector.id}`}
                className="mt-auto bg-[#4DA2DF] text-white px-6 py-3 rounded-lg font-bold text-center hover:bg-[#3993d4] transition-colors duration-200"
              >
                {dict.common.learnMore}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
