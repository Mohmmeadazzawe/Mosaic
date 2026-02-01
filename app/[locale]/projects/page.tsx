'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getProjectsPaginated, type ProjectItem } from '@/lib/api/projects';
import Loading from '@/components/common/Loading';
import { getDictionary } from '@/lib/i18n/dictionary';
import type { Locale } from '@/lib/i18n/config';

export default function ProjectsPage({ params }: { params: { locale: Locale } }) {
  const { locale } = params;
  const dict = getDictionary(locale);
  
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const perPage = 9; // 3 columns × 3 rows

  useEffect(() => {
    async function fetchProjects() {
      setLoading(true);
      try {
        const data = await getProjectsPaginated(currentPage, '', '', '', perPage, locale);
        setProjects(data.projects);
        setTotalPages(data.totalPages);
        setTotal(data.total);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, [currentPage, locale]);

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
    <div className="container mx-auto px-[3%] md:px-[4%] py-12 md:py-16">
      {/* Title */}
      <h1 className="text-3xl md:text-4xl font-bold text-[#25445E] mb-8 md:mb-12 text-center">
        {dict.nav.projects}
      </h1>

      {/* Projects Grid - 3 columns */}
      {projects.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-8 md:mb-12">
            {projects.map((project) => (
              <Link
                key={project.id}
                href={`/${locale}/projects/${project.id}`}
                className="bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-xl flex flex-col group"
              >
                {/* Project Image */}
                <div className="relative h-48 md:h-56 w-full">
                  <Image
                    src={project.image}
                    alt={project.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>

                {/* Project Content */}
                <div className="p-4 md:p-6 flex-grow flex flex-col">
                  {/* Project Title */}
                  <h3 className="text-lg md:text-xl font-bold text-[#25445E] mb-4 flex-grow line-clamp-2">
                    {project.name}
                  </h3>

                  {/* Tags */}
                  {project.tags && project.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tags.slice(0, 4).map((tag) => (
                        <span
                          key={tag.id}
                          className="text-xs md:text-sm text-[#4DA2DF] bg-[#EDF5FB] px-2 py-1 rounded-full"
                        >
                          {tag.name}
                        </span>
                      ))}
                      {project.tags.length > 4 && (
                        <span className="text-xs md:text-sm text-gray-500 px-2 py-1">
                          +{project.tags.length - 4}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Learn More Button */}
                  <div className="mt-auto">
                    <span className="inline-block bg-[#4DA2DF] text-white px-4 py-2 md:px-6 md:py-3 rounded-lg font-bold text-center hover:bg-[#3993d4] transition-colors duration-200 text-sm md:text-base w-full">
                      {dict.common.readMore}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
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
                // Show first page, last page, current page, and pages around current
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
          <div className="text-center mt-6 text-gray-600">
            {locale === 'ar' 
              ? `عرض ${projects.length} من ${total} مشروع`
              : `Showing ${projects.length} of ${total} projects`}
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            {locale === 'ar' ? 'لا توجد مشاريع متاحة' : 'No projects available'}
          </p>
        </div>
      )}
    </div>
  );
}
