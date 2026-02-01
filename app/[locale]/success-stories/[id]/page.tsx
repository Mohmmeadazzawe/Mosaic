'use client';

import { useState, useEffect } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getSuccessStoryById, type SuccessStoryItem, type SuccessStoryTag } from '@/lib/api/successStories';
import Loading from '@/components/common/Loading';
import { getDictionary } from '@/lib/i18n/dictionary';
import type { Locale } from '@/lib/i18n/config';

export default function SuccessStoryDetailPage({
  params,
}: {
  params: { locale: Locale; id: string };
}) {
  const { locale, id } = params;
  const dict = getDictionary(locale);

  const [story, setStory] = useState<SuccessStoryItem | null>(null);
  const [tags, setTags] = useState<SuccessStoryTag[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const data = await getSuccessStoryById(id, locale);
        if (!data.story) {
          setLoading(false);
          return;
        }
        setStory(data.story);
        setTags(data.tags);
      } catch (error) {
        console.error('Error fetching success story:', error);
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

  if (!story) {
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Image - Full Width */}
      <div className="relative w-full h-[400px] md:h-[500px]">
        <Image
          src={story.image}
          alt={story.name}
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
          href={`/${locale}/success-stories`}
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
          {locale === 'ar' ? 'العودة إلى قصص النجاح' : 'Back to Success Stories'}
        </Link>

        {/* Name and Publishing Date */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <h1 className="text-2xl md:text-4xl font-bold text-[#25445E] flex-1">
            {story.name}
          </h1>
          {story.publishing_date && (
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
              <span className="text-sm md:text-base">{formatDate(story.publishing_date)}</span>
            </div>
          )}
        </div>

        {/* Projects, Tags, Labels, and Sectors - Four Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
          {/* Column 1: Projects */}
          <div className="flex flex-col gap-2">
            <span className="text-sm md:text-base font-semibold text-[#25445E]">
              {locale === 'ar' ? 'المشاريع:' : 'Projects:'}
            </span>
            <div className="flex flex-wrap gap-2">
              {story.projects && story.projects.length > 0 ? (
                story.projects.map((project, index) => (
                  <span
                    key={index}
                    className="text-xs md:text-sm text-[#4DA2DF] bg-[#EDF5FB] px-3 py-1 rounded-full"
                  >
                    {project}
                  </span>
                ))
              ) : (
                <span className="text-sm text-gray-500">
                  {locale === 'ar' ? 'لا توجد مشاريع' : 'No projects'}
                </span>
              )}
            </div>
          </div>

          {/* Column 2: Tags */}
          <div className="flex flex-col gap-2">
            <span className="text-sm md:text-base font-semibold text-[#25445E]">
              {locale === 'ar' ? 'وسوم:' : 'Tags:'}
            </span>
            <div className="flex flex-wrap gap-2">
              {story.tags && story.tags.length > 0 ? (
                story.tags.map((tag) => (
                  <span
                    key={tag.id}
                    className="text-xs md:text-sm text-[#4DA2DF] bg-[#EDF5FB] px-3 py-1 rounded-full"
                  >
                    {tag.name}
                  </span>
                ))
              ) : (
                <span className="text-sm text-gray-500">
                  {locale === 'ar' ? 'لا توجد وسوم' : 'No tags'}
                </span>
              )}
            </div>
          </div>

          {/* Column 3: Labels */}
          <div className="flex flex-col gap-2">
            <span className="text-sm md:text-base font-semibold text-[#25445E]">
              {locale === 'ar' ? 'العلامات:' : 'Labels:'}
            </span>
            <div className="flex flex-wrap gap-2">
              {tags.length > 0 ? (
                tags.map((tag) => (
                  <span
                    key={tag.id}
                    className="text-xs md:text-sm text-[#4DA2DF] bg-[#EDF5FB] px-3 py-1 rounded-full"
                  >
                    {tag.name}
                  </span>
                ))
              ) : (
                <span className="text-sm text-gray-500">
                  {locale === 'ar' ? 'لا توجد علامات' : 'No labels'}
                </span>
              )}
            </div>
          </div>

          {/* Column 4: Sectors */}
          <div className="flex flex-col gap-2">
            <span className="text-sm md:text-base font-semibold text-[#25445E]">
              {locale === 'ar' ? 'القطاعات:' : 'Sectors:'}
            </span>
            <div className="flex flex-wrap gap-2">
              {story.sectors && story.sectors.length > 0 ? (
                story.sectors.map((sector, index) => (
                  <span
                    key={index}
                    className="text-xs md:text-sm text-[#4DA2DF] bg-[#EDF5FB] px-3 py-1 rounded-full"
                  >
                    {sector}
                  </span>
                ))
              ) : (
                <span className="text-sm text-gray-500">
                  {locale === 'ar' ? 'لا توجد قطاعات' : 'No sectors'}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 mb-6">
          <div
            className="prose max-w-none text-gray-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: story.description }}
          />
        </div>

        {/* Video URL */}
        {story.video_url && (
          <div className="mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-[#25445E] mb-4 text-center">
              {story.name}
            </h2>
            <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-gray-200">
              <iframe
                src={getYouTubeEmbedUrl(story.video_url)}
                title={story.name}
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        )}

        {/* Images Carousel - Conditional */}
        {story.images && story.images.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-[#25445E] mb-4">
              {locale === 'ar' ? 'الصور' : 'Images'}
            </h2>
            <div className="relative">
              {/* Main Image */}
              <div className="relative w-full h-[400px] md:h-[500px] rounded-lg overflow-hidden mb-4">
                <Image
                  src={story.images[currentImageIndex]}
                  alt={`${story.name} - ${currentImageIndex + 1}`}
                  fill
                  sizes="100vw"
                  className="object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>

              {/* Navigation Buttons */}
              {story.images.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setCurrentImageIndex((prev) => (prev === 0 ? story.images!.length - 1 : prev - 1))
                    }
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-[#25445E] p-2 rounded-full shadow-lg transition-all"
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
                    onClick={() =>
                      setCurrentImageIndex((prev) => (prev === story.images!.length - 1 ? 0 : prev + 1))
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-[#25445E] p-2 rounded-full shadow-lg transition-all"
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
              {story.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {story.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`relative w-20 h-20 md:w-24 md:h-24 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                        currentImageIndex === index
                          ? 'border-[#4DA2DF] ring-2 ring-[#4DA2DF]'
                          : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <Image
                        src={image}
                        alt={`${story.name} thumbnail ${index + 1}`}
                        fill
                        sizes="96px"
                        className="object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Image Counter */}
              {story.images.length > 1 && (
                <div className="text-center mt-2 text-sm text-gray-600">
                  {currentImageIndex + 1} / {story.images.length}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
