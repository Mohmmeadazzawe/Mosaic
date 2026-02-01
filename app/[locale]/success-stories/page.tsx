'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getSuccessStoriesPaginated, type SuccessStoryItem, type SuccessStoryTag } from '@/lib/api/successStories';
import Loading from '@/components/common/Loading';
import { getDictionary } from '@/lib/i18n/dictionary';
import type { Locale } from '@/lib/i18n/config';

// Success Story Card Component with Image Loader
function SuccessStoryCard({ story, locale }: { story: SuccessStoryItem; locale: Locale }) {
  const [imageLoading, setImageLoading] = useState(true);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(
      locale === 'ar' ? 'ar-SA' : 'en-US',
      {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }
    );
  };

  return (
    <Link
      href={`/${locale}/success-stories/${story.id}`}
      className="bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-xl group"
    >
      {/* Story Image */}
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
          src={story.image}
          alt={story.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 50vw"
          className="object-cover"
          onLoad={() => setImageLoading(false)}
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
            setImageLoading(false);
          }}
        />
      </div>

      {/* Story Content */}
      <div className="p-4 md:p-6">
        {/* Story Title */}
        <h3 className="text-lg md:text-xl font-bold text-[#25445E] mb-4 line-clamp-2 group-hover:text-[#4DA2DF] transition-colors">
          {story.name}
        </h3>

        {/* Publishing Date */}
        {story.publishing_date && (
          <div className="flex items-center gap-2 text-gray-600 mb-3">
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
            <span className="text-sm">
              {locale === 'ar' ? 'تاريخ النشر:' : 'Publishing Date:'} {formatDate(story.publishing_date)}
            </span>
          </div>
        )}

        {/* Tags */}
        {story.tags && story.tags.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
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
                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
              />
            </svg>
            <div className="flex flex-wrap gap-2">
              {story.tags.slice(0, 2).map((tag) => (
                <span
                  key={tag.id}
                  className="text-xs md:text-sm text-[#4DA2DF] bg-[#EDF5FB] px-2 py-1 rounded-full"
                >
                  {tag.name}
                </span>
              ))}
              {story.tags.length > 2 && (
                <span className="text-xs md:text-sm text-gray-500">
                  +{story.tags.length - 2}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </Link>
  );
}

export default function SuccessStoriesPage({ params }: { params: { locale: Locale } }) {
  const { locale } = params;
  const dict = getDictionary(locale);

  const [stories, setStories] = useState<SuccessStoryItem[]>([]);
  const [allStories, setAllStories] = useState<SuccessStoryItem[]>([]);
  const [tags, setTags] = useState<SuccessStoryTag[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStories() {
      setLoading(true);
      try {
        const data = await getSuccessStoriesPaginated(currentPage, 6, locale);
        console.log('Fetched data in page:', data);
        console.log('Stories count:', data.stories.length);
        console.log('Tags count:', data.tags.length);
        setStories(data.stories);
        setAllStories(data.stories);
        setTags(data.tags);
        setTotalPages(data.totalPages);
        setTotal(data.total);
      } catch (error) {
        console.error('Error fetching success stories:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchStories();
  }, [currentPage, locale]);

  // Client-side filtering based on search and tag
  const filteredStories = useMemo(() => {
    let filtered = allStories;

    // Filter by tag
    if (selectedTag) {
      filtered = filtered.filter((story) =>
        story.tags?.some((tag) => tag.name === selectedTag)
      );
    }

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter((story) =>
        story.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  }, [allStories, selectedTag, searchQuery]);

  const handleTagClick = (tagName: string) => {
    if (selectedTag === tagName) {
      setSelectedTag(null);
    } else {
      setSelectedTag(tagName);
    }
  };

  // Navigation links (similar to navbar)
  const sections = [
    { key: 'home', href: `/${locale}` },
    { key: 'projects', href: `/${locale}/projects` },
    { key: 'statistics', href: `/${locale}/statistics` },
    { key: 'reports', href: `/${locale}/reports` },
    { key: 'successStories', href: `/${locale}/success-stories` },
    { key: 'activities', href: `/${locale}/activities` },
    { key: 'joinus', href: `/${locale}/joinus` },
    { key: 'contact', href: `/${locale}/contact` },
  ];

  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-[3%] md:px-[4%] py-16">
        <Loading locale={locale} />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-[3%] md:px-[4%] py-8 md:py-12">
      {/* Title */}
      <h1 className="text-3xl md:text-4xl font-bold text-[#25445E] mb-8 md:mb-12 text-center">
        {dict.nav.successStories}
      </h1>

      {/* Two Columns Layout */}
      <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
        {/* Column 1: Main Content - Stories */}
        <div className="flex-1">
          {/* Filter Message */}
          {selectedTag && (
            <div className="mb-6 p-4 bg-[#EDF5FB] rounded-lg flex items-center justify-between">
              <span className="text-[#25445E]">
                {locale === 'ar' ? 'عرض النتائج لوسم:' : 'Showing results for tag:'}{' '}
                <strong>{selectedTag}</strong>
              </span>
              <button
                onClick={() => setSelectedTag(null)}
                className="text-[#4DA2DF] hover:text-[#3993d4] font-semibold transition-colors"
              >
                {locale === 'ar' ? 'إلغاء الفلترة' : 'Clear Filter'}
              </button>
            </div>
          )}

          {/* Stories Grid - 2 columns */}
          {filteredStories.length > 0 || stories.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-8 md:mb-12">
                {(filteredStories.length > 0 ? filteredStories : stories).map((story) => (
                  <SuccessStoryCard
                    key={story.id}
                    story={story}
                    locale={locale}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && !selectedTag && !searchQuery.trim() && (
                <div className="flex justify-center items-center gap-2 flex-wrap">
                  <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 rounded-lg font-bold transition-all ${
                      currentPage === 1
                        ? 'text-gray-300 cursor-not-allowed'
                        : 'text-[#25445E] hover:bg-[#EDF5FB] cursor-pointer'
                    }`}
                  >
                    {locale === 'ar' ? 'السابق' : 'Previous'}
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                    if (
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={page}
                          onClick={() => goToPage(page)}
                          className={`px-4 py-2 rounded-lg font-bold transition-all ${
                            page === currentPage
                              ? 'bg-[#4DA2DF] text-white'
                              : 'text-[#25445E] hover:bg-[#EDF5FB]'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    } else if (page === currentPage - 2 || page === currentPage + 2) {
                      return <span key={page} className="px-2 text-gray-400">...</span>;
                    }
                    return null;
                  })}

                  <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-4 py-2 rounded-lg font-bold transition-all ${
                      currentPage === totalPages
                        ? 'text-gray-300 cursor-not-allowed'
                        : 'text-[#25445E] hover:bg-[#EDF5FB] cursor-pointer'
                    }`}
                  >
                    {locale === 'ar' ? 'التالي' : 'Next'}
                  </button>
                </div>
              )}

              {/* Results Count */}
              {!selectedTag && !searchQuery.trim() && (
                <div className="text-center mt-6 text-gray-600">
                  {locale === 'ar'
                    ? `عرض ${stories.length} من ${total} قصة نجاح`
                    : `Showing ${stories.length} of ${total} success stories`}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                {locale === 'ar' ? 'لا توجد قصص نجاح متاحة' : 'No success stories available'}
              </p>
            </div>
          )}
        </div>

        {/* Column 2: Sidebar */}
        <div className="w-full lg:w-80 flex-shrink-0">
          <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
            {/* Search Box */}
            <div className="mb-6">
              <input
                type="search"
                placeholder={locale === 'ar' ? 'بحث ...' : 'Search ...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4DA2DF] focus:border-transparent"
              />
            </div>

            {/* Sections */}
            <div className="mb-6">
              <h2 className="text-lg font-bold text-[#25445E] mb-4">
                {locale === 'ar' ? 'الأقسام' : 'Sections'}
              </h2>
              <div className="space-y-2">
                {sections.map((section) => (
                  <Link
                    key={section.key}
                    href={section.href}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-[#EDF5FB] transition-colors group"
                  >
                    <span className="text-[#25445E] group-hover:text-[#4DA2DF] transition-colors font-medium">
                      {dict.nav[section.key as keyof typeof dict.nav]}
                    </span>
                    <svg
                      className={`w-5 h-5 text-[#4DA2DF] ${locale === 'ar' ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Link>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div>
              <h2 className="text-lg font-bold text-[#25445E] mb-4">
                {locale === 'ar' ? 'العلامات' : 'Tags'}
              </h2>
              <div className="flex flex-wrap gap-2">
                {tags.length > 0 ? (
                  tags.map((tag) => (
                    <button
                      key={tag.id}
                      onClick={() => handleTagClick(tag.name)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                        selectedTag === tag.name
                          ? 'bg-[#4DA2DF] text-white'
                          : 'bg-[#EDF5FB] text-[#4DA2DF] hover:bg-[#4DA2DF] hover:text-white'
                      }`}
                    >
                      {tag.name}
                    </button>
                  ))
                ) : (
                  <span className="text-sm text-gray-500">
                    {locale === 'ar' ? 'لا توجد علامات' : 'No tags'}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
