'use client';

import { useState, useEffect } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  getStatisticById,
  getLatestStatistics,
  type StatisticsListItem,
  type StatisticTag,
} from '@/lib/api/statistics';
import Loading from '@/components/common/Loading';
import { getDictionary } from '@/lib/i18n/dictionary';
import type { Locale } from '@/lib/i18n/config';

// Helper to convert YouTube URL to embed URL
const getYouTubeEmbedUrl = (url: string) => {
  const videoIdMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/))([^&?#]+)/);
  return videoIdMatch ? `https://www.youtube.com/embed/${videoIdMatch[1]}` : '';
};

// Helper to extract YouTube URL from description
const extractYouTubeUrl = (description: string): string | null => {
  const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/))([^&\s?#]+)/;
  const match = description.match(youtubeRegex);
  return match ? match[0] : null;
};

// Statistics Card Component with Image Loader
function StatisticsCard({ statistic, locale }: { statistic: StatisticsListItem; locale: Locale }) {
  const [imageLoading, setImageLoading] = useState(true);

  return (
    <Link
      href={`/${locale}/statistics/${statistic.id}`}
      className="bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-xl group"
    >
      {/* Statistics Image */}
      <div className="relative h-48 md:h-56 w-full bg-gray-200">
        {/* Loader */}
        {imageLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-200 z-10">
            <div className="flex flex-col items-center gap-2">
              <div className="w-8 h-8 border-4 border-[#4DA2DF] border-t-transparent rounded-full animate-spin"></div>
            </div>
          </div>
        )}
        <Image
          src={statistic.image}
          alt={statistic.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover"
          onLoad={() => setImageLoading(false)}
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
            setImageLoading(false);
          }}
        />
      </div>

      {/* Statistics Content */}
      <div className="p-4 md:p-6">
        {/* Statistics Title */}
        <h3 className="text-base md:text-lg font-bold text-[#25445E] mb-2 line-clamp-2 group-hover:text-[#4DA2DF] transition-colors">
          {statistic.name}
        </h3>

        {/* Publishing Date */}
        {statistic.publishing_date && (
          <div className="flex items-center gap-2 text-gray-600 text-sm">
            <svg
              className="w-4 h-4 text-[#4DA2DF]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span>
              {new Date(statistic.publishing_date).toLocaleDateString(
                locale === 'ar' ? 'ar-SA' : 'en-US',
                {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                }
              )}
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}

export default function StatisticsDetailPage({
  params,
}: {
  params: { locale: Locale; id: string };
}) {
  const { locale, id } = params;
  const dict = getDictionary(locale);

  const [statistic, setStatistic] = useState<StatisticsListItem | null>(null);
  const [tags, setTags] = useState<StatisticTag[]>([]);
  const [latestStatistics, setLatestStatistics] = useState<StatisticsListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [statisticData, latestData] = await Promise.all([
          getStatisticById(id, locale),
          getLatestStatistics(locale),
        ]);

        if (!statisticData.statistic) {
          setLoading(false);
          return;
        }

        setStatistic(statisticData.statistic);
        setTags(statisticData.tags);
        // Filter out current statistic from latest statistics
        setLatestStatistics(latestData.filter((stat) => stat.id.toString() !== id).slice(0, 4));
      } catch (error) {
        console.error('Error fetching statistic data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id, locale]);

  if (loading) {
    return (
      <div className="container mx-auto px-[3%] md:px-[4%] py-16">
        <Loading locale={locale} />
      </div>
    );
  }

  if (!statistic) {
    notFound();
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(
      locale === 'ar' ? 'ar-SA' : 'en-US',
      {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }
    );
  };

  // Extract YouTube URL from description
  const youtubeUrl = extractYouTubeUrl(statistic.description);
  // Remove YouTube URL from description for display
  const cleanDescription = youtubeUrl
    ? statistic.description.replace(/(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/))([^&\s?#]+)/g, '').trim()
    : statistic.description;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Image - Full Width */}
      <div className="relative w-full h-[400px] md:h-[500px]">
        <Image
          src={statistic.image}
          alt={statistic.name}
          fill
          sizes="100vw"
          className="object-cover"
          priority
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
      </div>

      <div className="container mx-auto px-[3%] md:px-[4%] py-8 md:py-12">
        {/* Back Button */}
        <Link
          href={`/${locale}/statistics`}
          className="inline-flex items-center gap-2 text-[#4DA2DF] hover:text-[#3993d4] mb-6 transition-colors"
        >
          <svg
            className={`w-5 h-5 ${locale === 'ar' ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {locale === 'ar' ? 'العودة إلى الإحصائيات' : 'Back to Statistics'}
        </Link>

        {/* Statistic Header: Name and Publishing Date */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white rounded-lg shadow-lg p-6 md:p-8 mb-8 md:mb-12">
          <h1 className="text-2xl md:text-3xl font-bold text-[#25445E] mb-4 md:mb-0">
            {statistic.name}
          </h1>
          {statistic.publishing_date && (
            <span className="text-gray-600 text-sm md:text-base">
              <strong>{locale === 'ar' ? 'تاريخ النشر:' : 'Published:'}</strong>{' '}
              {formatDate(statistic.publishing_date)}
            </span>
          )}
        </div>

        {/* Tags */}
        {statistic.tags && statistic.tags.length > 0 && (
          <div className="mb-8 md:mb-12">
            <div className="flex flex-col gap-2 bg-white rounded-lg shadow-sm p-4">
              <span className="text-sm md:text-base font-semibold text-[#25445E] mb-2">
                {locale === 'ar' ? 'الوسوم:' : 'Tags:'}
              </span>
              <div className="flex flex-wrap gap-2">
                {statistic.tags.map((tag) => (
                  <span
                    key={tag.id}
                    className="text-xs md:text-sm text-[#4DA2DF] bg-[#EDF5FB] px-3 py-1 rounded-full"
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Description */}
        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 mb-6">
          <div
            className="prose max-w-none text-gray-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: cleanDescription }}
          />
        </div>

        {/* Video URL - Conditional */}
        {youtubeUrl && (
          <div className="mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-[#25445E] mb-4 text-center">
              {statistic.name}
            </h2>
            <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-gray-200">
              <iframe
                src={getYouTubeEmbedUrl(youtubeUrl)}
                title={statistic.name}
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        )}

        {/* Latest Statistics Section */}
        {latestStatistics.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl md:text-3xl font-bold text-[#25445E] mb-6 md:mb-8 text-center">
              {locale === 'ar' ? 'أحدث الإحصائيات' : 'Latest Statistics'}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {latestStatistics.map((stat) => (
                <StatisticsCard key={stat.id} statistic={stat} locale={locale} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
