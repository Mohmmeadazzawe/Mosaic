import nextDynamic from 'next/dynamic';
import { getDictionary } from '@/lib/i18n/dictionary';
import { getHomeStatistics } from '@/lib/api/statistics';
import { getAllCenters } from '@/lib/api/centers';
import { getSectors } from '@/lib/api/sectors';
import type { Locale } from '@/lib/i18n/config';
import AboutBanner from '@/components/sections/AboutBanner';
import AboutBody from '@/components/sections/AboutBody';
import AboutSectors from '@/components/sections/AboutSectors';
import Loading from '@/components/common/Loading';

export const dynamic = 'force-dynamic';

const CentersMap = nextDynamic(
  () => import('@/components/sections/CentersMap'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[500px] flex items-center justify-center bg-gray-100 rounded-xl">
        <Loading text="" size="medium" />
      </div>
    ),
  }
);

export default async function AboutPage({ params }: { params: { locale: Locale } }) {
  const { locale } = params;
  const dict = getDictionary(locale);

  const [homeStats, centers, sectors] = await Promise.all([
    getHomeStatistics(locale),
    getAllCenters(locale),
    getSectors(locale),
  ]);

  return (
    <main className="min-h-screen">
      <AboutBanner dict={dict} />
      <AboutBody dict={dict} youtubeUrl={homeStats.youtube_url} />

      {/* Map section */}
      <div className="container mx-auto px-[3%] md:px-[4%] py-8 md:py-12">
        <div className="mx-4 md:mx-8 lg:mx-16">
          {centers.length === 0 ? (
            <div className="w-full h-[500px] rounded-xl bg-gray-100 flex items-center justify-center text-gray-600">
              {dict.about.noCenters}
            </div>
          ) : (
            <CentersMap centers={centers} locale={locale} />
          )}
        </div>
      </div>

      <AboutSectors sectors={sectors} locale={locale} dict={dict} />
    </main>
  );
}
