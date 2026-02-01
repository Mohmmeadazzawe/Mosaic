'use client';

import { useState, useEffect } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getReportById, type ReportItem } from '@/lib/api/reports';
import Loading from '@/components/common/Loading';
import { getDictionary } from '@/lib/i18n/dictionary';
import type { Locale } from '@/lib/i18n/config';

export default function ReportDetailPage({
  params,
}: {
  params: { locale: Locale; id: string };
}) {
  const { locale, id } = params;
  const dict = getDictionary(locale);

  const [report, setReport] = useState<ReportItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const data = await getReportById(id, locale);
        setReport(data);
      } catch (error) {
        console.error('Error fetching report:', error);
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

  if (!report) {
    notFound();
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString(
      locale === 'ar' ? 'ar-SA' : 'en-US',
      { year: 'numeric', month: 'long', day: 'numeric' }
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {report.image && (
        <div className="relative w-full h-[300px] md:h-[400px]">
          <Image
            src={report.image}
            alt={report.name}
            fill
            sizes="100vw"
            className="object-cover"
            priority
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
          <div className="absolute inset-0 bg-black/30" />
        </div>
      )}

      <div className="container mx-auto px-[3%] md:px-[4%] py-8 md:py-12">
        <Link
          href={`/${locale}/reports`}
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
          {dict.reports.backToReports}
        </Link>

        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 mb-8">
          <h1 className="text-2xl md:text-4xl font-bold text-[#25445E] mb-6">
            {report.name}
          </h1>

          <div className="flex flex-wrap items-center gap-4 mb-6 pb-6 border-b border-gray-200">
            {report.publishing_date && (
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
                <span className="text-sm md:text-base">
                  {dict.reports.publishingDate}: {formatDate(report.publishing_date)}
                </span>
              </div>
            )}
            {report.tags && report.tags.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
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
                    d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                  />
                </svg>
                <div className="flex flex-wrap gap-2">
                  {report.tags.map((tag) => (
                    <span
                      key={tag.id}
                      className="text-xs md:text-sm text-[#4DA2DF] bg-[#EDF5FB] px-2 py-1 rounded-full"
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {report.description && (
            <div
              className="prose max-w-none text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: report.description }}
            />
          )}

          {report.pdf && (
            <a
              href={report.pdf}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-8 px-6 py-3 bg-[#4DA2DF] text-white rounded-lg font-bold hover:bg-[#3993d4] transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              {dict.reports.downloadPdf}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
