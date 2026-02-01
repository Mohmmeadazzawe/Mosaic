'use client';

import { useState, useEffect } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getActivityById, type ActivityItem, type ActivityTag } from '@/lib/api/activities';
import Loading from '@/components/common/Loading';
import { getDictionary } from '@/lib/i18n/dictionary';
import type { Locale } from '@/lib/i18n/config';

export default function ActivityDetailPage({
  params,
}: {
  params: { locale: Locale; id: string };
}) {
  const { locale, id } = params;
  const dict = getDictionary(locale);

  const [activity, setActivity] = useState<ActivityItem | null>(null);
  const [tags, setTags] = useState<ActivityTag[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageLoading, setImageLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const data = await getActivityById(id, locale);
        if (!data.activity) {
          setLoading(false);
          return;
        }
        setActivity(data.activity);
        setTags(data.tags);
      } catch (error) {
        console.error('Error fetching activity:', error);
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

  if (!activity) {
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

  const getYouTubeEmbedUrl = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    const videoId = match && match[2].length === 11 ? match[2] : null;
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
  };

  const handlePrevImage = () => {
    if (activity.images && activity.images.length > 0) {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === 0 ? activity.images!.length - 1 : prevIndex - 1
      );
    }
  };

  const handleNextImage = () => {
    if (activity.images && activity.images.length > 0) {
      setImageLoading(true);
      setCurrentImageIndex((prevIndex) =>
        prevIndex === activity.images!.length - 1 ? 0 : prevIndex + 1
      );
    }
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleImageChange = (index: number) => {
    setImageLoading(true);
    setCurrentImageIndex(index);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Image - Full Width */}
      {activity.image && (
        <div className="relative w-full h-[400px] md:h-[500px]">
          <Image
            src={activity.image}
            alt={activity.name}
            fill
            sizes="100vw"
            className="object-cover"
            priority
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        </div>
      )}

      <div className="container mx-auto px-[3%] md:px-[4%] py-8 md:py-12">
        {/* Back Button */}
        <Link
          href={`/${locale}/activities`}
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
          {locale === 'ar' ? 'العودة إلى الأنشطة' : 'Back to Activities'}
        </Link>

        {/* Name and Publishing Date */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <h1 className="text-2xl md:text-4xl font-bold text-[#25445E] flex-1">
            {activity.name}
          </h1>
          {activity.publishing_date && (
            <div className="flex items-center gap-2 text-gray-600">
              <svg
                className="w-5 h-5 text-[#4DA2DF]"
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
              <span className="text-sm md:text-base">{formatDate(activity.publishing_date)}</span>
            </div>
          )}
        </div>

        {/* Projects, Tags, and Sectors - Three Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6">
          {/* Column 1: Projects */}
          {activity.projects && activity.projects.length > 0 && (
            <div className="flex flex-col gap-2">
              <span className="text-sm md:text-base font-semibold text-[#25445E]">
                {locale === 'ar' ? 'المشاريع:' : 'Projects:'}
              </span>
              <div className="flex flex-wrap gap-2">
                {activity.projects.map((project, index) => (
                  <span
                    key={index}
                    className="text-xs md:text-sm text-[#4DA2DF] bg-[#EDF5FB] px-3 py-1 rounded-full"
                  >
                    {project}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Column 2: Tags */}
          {activity.tags && activity.tags.length > 0 && (
            <div className="flex flex-col gap-2">
              <span className="text-sm md:text-base font-semibold text-[#25445E]">
                {locale === 'ar' ? 'وسوم:' : 'Tags:'}
              </span>
              <div className="flex flex-wrap gap-2">
                {activity.tags.map((tag) => (
                  <span
                    key={tag.id}
                    className="text-xs md:text-sm text-[#4DA2DF] bg-[#EDF5FB] px-3 py-1 rounded-full"
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Column 3: Sectors */}
          {activity.sectors && activity.sectors.length > 0 && (
            <div className="flex flex-col gap-2">
              <span className="text-sm md:text-base font-semibold text-[#25445E]">
                {locale === 'ar' ? 'القطاعات:' : 'Sectors:'}
              </span>
              <div className="flex flex-wrap gap-2">
                {activity.sectors.map((sector, index) => (
                  <span
                    key={index}
                    className="text-xs md:text-sm text-[#4DA2DF] bg-[#EDF5FB] px-3 py-1 rounded-full"
                  >
                    {sector}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Description */}
        {activity.description && (
          <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 mb-6">
            <div
              className="prose max-w-none text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: activity.description }}
            />
          </div>
        )}

        {/* Video URL - Conditional */}
        {activity.video_url && (
          <div className="mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-[#25445E] mb-4 text-center">
              {activity.name}
            </h2>
            <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-gray-200">
              <iframe
                src={getYouTubeEmbedUrl(activity.video_url)}
                title={activity.name}
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        )}

        {/* Images Carousel - Conditional */}
        {activity.images && activity.images.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-[#25445E] mb-4">
              {locale === 'ar' ? 'الصور' : 'Images'}
            </h2>
            <div className="relative">
              {/* Main Image */}
              <div className="relative w-full h-[400px] md:h-[500px] rounded-lg overflow-hidden mb-4 bg-gray-200">
                {/* Loader */}
                {imageLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-200 z-10">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 border-4 border-[#4DA2DF] border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-sm text-gray-600">
                        {locale === 'ar' ? 'جاري التحميل...' : 'Loading...'}
                      </span>
                    </div>
                  </div>
                )}
                <Image
                  src={activity.images[currentImageIndex]}
                  alt={`${activity.name} - ${currentImageIndex + 1}`}
                  fill
                  sizes="100vw"
                  className="object-cover"
                  onLoad={handleImageLoad}
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                    setImageLoading(false);
                  }}
                />
              </div>

              {/* Navigation Buttons */}
              {activity.images.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    disabled={imageLoading}
                    className={`absolute top-1/2 ${
                      locale === 'ar' ? 'right-4' : 'left-4'
                    } -translate-y-1/2 bg-black/50 text-white p-2 rounded-full z-20 hover:bg-black/75 transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
                    aria-label={locale === 'ar' ? 'الصورة السابقة' : 'Previous image'}
                  >
                    <svg
                      className={`w-6 h-6 ${locale === 'ar' ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={handleNextImage}
                    disabled={imageLoading}
                    className={`absolute top-1/2 ${
                      locale === 'ar' ? 'left-4' : 'right-4'
                    } -translate-y-1/2 bg-black/50 text-white p-2 rounded-full z-20 hover:bg-black/75 transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
                    aria-label={locale === 'ar' ? 'الصورة التالية' : 'Next image'}
                  >
                    <svg
                      className={`w-6 h-6 ${locale === 'ar' ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}

              {/* Thumbnails */}
              {activity.images.length > 1 && (
                <div className="flex justify-center gap-2 mt-4 flex-wrap">
                  {activity.images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => handleImageChange(index)}
                      disabled={imageLoading}
                      className={`w-20 h-16 relative rounded-lg overflow-hidden border-2 ${
                        index === currentImageIndex ? 'border-[#4DA2DF]' : 'border-transparent'
                      } hover:border-[#4DA2DF] transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      <Image
                        src={img}
                        alt={`${activity.name} thumbnail ${index + 1}`}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
