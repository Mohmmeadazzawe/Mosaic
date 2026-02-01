'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  getReportsPaginated,
  type ReportItem,
  type ReportTag,
} from '@/lib/api/reports';
import Loading from '@/components/common/Loading';
import { getDictionary } from '@/lib/i18n/dictionary';
import type { Locale } from '@/lib/i18n/config';

const PER_PAGE = 6;

function ReportCard({ report, locale }: { report: ReportItem; locale: Locale }) {
  const [imageLoading, setImageLoading] = useState(true);

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString(
      locale === 'ar' ? 'ar-SA' : 'en-US',
      { year: 'numeric', month: 'short', day: 'numeric' }
    );
  };

  return (
    <Link
      href={`/${locale}/reports/${report.id}`}
      className="bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-xl group"
    >
      <div className="relative h-48 md:h-56 w-full bg-gray-200">
        {report.image && imageLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-200 z-10">
            <div className="w-8 h-8 border-4 border-[#4DA2DF] border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        {report.image ? (
          <Image
            src={report.image}
            alt={report.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover"
            onLoad={() => setImageLoading(false)}
            onError={() => setImageLoading(false)}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-4xl">
            📄
          </div>
        )}
      </div>
      <div className="p-4 md:p-6">
        <h3 className="text-lg md:text-xl font-bold text-[#25445E] mb-3 line-clamp-2 group-hover:text-[#4DA2DF] transition-colors">
          {report.name}
        </h3>
        {report.publishing_date && (
          <div className="flex items-center gap-2 text-gray-600 mb-2 text-sm">
            <svg
              className="w-4 h-4 text-[#4DA2DF] shrink-0"
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
            <span>{formatDate(report.publishing_date)}</span>
          </div>
        )}
        {report.tags && report.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {report.tags.slice(0, 3).map((tag) => (
              <span
                key={tag.id}
                className="text-xs text-[#4DA2DF] bg-[#EDF5FB] px-2 py-1 rounded-full"
              >
                {tag.name}
              </span>
            ))}
            {report.tags.length > 3 && (
              <span className="text-xs text-gray-500">+{report.tags.length - 3}</span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}

export default function ReportsPage({ params }: { params: { locale: Locale } }) {
  const { locale } = params;
  const dict = getDictionary(locale);

  const [reports, setReports] = useState<ReportItem[]>([]);
  const [tags, setTags] = useState<ReportTag[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTagId, setSelectedTagId] = useState<string>('');

  useEffect(() => {
    async function fetchReports() {
      setLoading(true);
      try {
        const data = await getReportsPaginated(
          currentPage,
          searchQuery,
          selectedTagId,
          PER_PAGE,
          locale
        );
        setReports(data.reports);
        if (data.tags.length > 0) setTags(data.tags);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error('Error fetching reports:', error);
        setReports([]);
      } finally {
        setLoading(false);
      }
    }
    fetchReports();
  }, [locale, currentPage, searchQuery, selectedTagId]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-[3%] md:px-[4%] py-8 md:py-12">
        <h1 className="text-3xl md:text-4xl font-bold text-[#25445E] mb-8 text-center">
          {dict.nav.reports}
        </h1>

        <div className="flex flex-col lg:flex-row gap-8">
          <main className="flex-1">
            {loading ? (
              <Loading locale={locale} />
            ) : reports.length === 0 ? (
              <p className="text-center text-gray-600 py-12">
                {dict.reports.noReports}
              </p>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {reports.map((report) => (
                    <ReportCard key={report.id} report={report} locale={locale} />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 flex-wrap">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`px-4 py-2 rounded-lg font-bold ${
                        currentPage === 1
                          ? 'text-gray-300 cursor-not-allowed'
                          : 'text-[#25445E] hover:bg-[#EDF5FB]'
                      }`}
                    >
                      {locale === 'ar' ? 'السابق' : 'Previous'}
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => {
                        if (
                          page === 1 ||
                          page === totalPages ||
                          (page >= currentPage - 1 && page <= currentPage + 1)
                        ) {
                          return (
                            <button
                              key={page}
                              onClick={() => handlePageChange(page)}
                              className={`px-4 py-2 rounded-lg font-bold ${
                                page === currentPage
                                  ? 'bg-[#4DA2DF] text-white'
                                  : 'text-[#25445E] hover:bg-[#EDF5FB]'
                              }`}
                            >
                              {page}
                            </button>
                          );
                        }
                        if (page === currentPage - 2 || page === currentPage + 2) {
                          return (
                            <span key={page} className="px-2 text-gray-400">
                              ...
                            </span>
                          );
                        }
                        return null;
                      }
                    )}
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`px-4 py-2 rounded-lg font-bold ${
                        currentPage === totalPages
                          ? 'text-gray-300 cursor-not-allowed'
                          : 'text-[#25445E] hover:bg-[#EDF5FB]'
                      }`}
                    >
                      {locale === 'ar' ? 'التالي' : 'Next'}
                    </button>
                  </div>
                )}
              </>
            )}
          </main>

          <aside className="w-full lg:w-72 shrink-0">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
              <label className="block text-sm font-semibold text-[#25445E] mb-2">
                {dict.reports.searchPlaceholder}
              </label>
              <input
                type="search"
                placeholder={dict.reports.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#4DA2DF] focus:border-transparent"
              />
              {tags.length > 0 && (
                <>
                  <h2 className="text-lg font-bold text-[#25445E] mt-6 mb-3">
                    {dict.reports.tags}
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => {
                        setSelectedTagId('');
                        setCurrentPage(1);
                      }}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                        !selectedTagId
                          ? 'bg-[#4DA2DF] text-white'
                          : 'bg-[#EDF5FB] text-[#25445E] hover:bg-[#dceef9]'
                      }`}
                    >
                      {locale === 'ar' ? 'الكل' : 'All'}
                    </button>
                    {tags.map((tag) => (
                      <button
                        key={tag.id}
                        onClick={() => {
                          setSelectedTagId(selectedTagId === String(tag.id) ? '' : String(tag.id));
                          setCurrentPage(1);
                        }}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                          selectedTagId === String(tag.id)
                            ? 'bg-[#4DA2DF] text-white'
                            : 'bg-[#EDF5FB] text-[#25445E] hover:bg-[#dceef9]'
                        }`}
                      >
                        {tag.name}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
