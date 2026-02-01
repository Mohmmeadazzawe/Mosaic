'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getProjectsPaginated, type ProjectItem } from '@/lib/api/projects';
import Loading from '@/components/common/Loading';
import type { Dictionary } from '@/lib/i18n/dictionary';
import type { Locale } from '@/lib/i18n/config';

interface ProjectsProps {
  locale: Locale;
  dict: Dictionary;
}

export default function Projects({ locale, dict }: ProjectsProps) {
  const [allProjects, setAllProjects] = useState<ProjectItem[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);
  const projectsPerSlide = 4;

  useEffect(() => {
    async function fetchAllProjects() {
      setLoading(true);
      try {
        // جلب جميع المشاريع
        let allProjectsData: ProjectItem[] = [];
        let page = 1;
        let hasMore = true;

        while (hasMore) {
          const data = await getProjectsPaginated(page, '', '', '', 10, locale);
          allProjectsData = [...allProjectsData, ...data.projects];
          
          if (data.projects.length === 0 || page >= data.totalPages) {
            hasMore = false;
          } else {
            page++;
          }
        }

        setAllProjects(allProjectsData);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchAllProjects();
  }, [locale]);

  // تقسيم المشاريع إلى slides
  const totalSlides = Math.ceil(allProjects.length / projectsPerSlide);
  const currentProjects = allProjects.slice(
    currentSlide * projectsPerSlide,
    (currentSlide + 1) * projectsPerSlide
  );

  const goToPrevious = () => {
    if (currentSlide > 0) {
      setCurrentSlide((prev) => prev - 1);
    }
  };

  const goToNext = () => {
    if (currentSlide < totalSlides - 1) {
      setCurrentSlide((prev) => prev + 1);
    }
  };

  if (loading) {
    return (
      <section className="container mx-auto px-[3%] md:px-[4%] py-8 md:py-10">
        <Loading locale={locale} />
      </section>
    );
  }

  if (allProjects.length === 0 && !loading) {
    return null;
  }

  return (
    <section className="container mx-auto px-[3%] md:px-[4%] py-8 md:py-10">
      {/* Title and Pagination */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 md:mb-12 gap-4">
        <h2 className="text-3xl md:text-4xl font-bold text-[#25445E]">
          {dict.nav.projects}
        </h2>
        
        {/* Pagination Controls - يظهر دائماً إذا كان هناك أكثر من 4 مشاريع */}
        {allProjects.length > projectsPerSlide && (
          <div className="flex items-center gap-4">
            <button
              onClick={goToPrevious}
              disabled={currentSlide === 0}
              className={`p-2 rounded-lg transition-all ${
                currentSlide === 0
                  ? 'text-gray-300 cursor-not-allowed'
                  : 'text-[#25445E] hover:bg-[#EDF5FB] cursor-pointer'
              }`}
              aria-label="Previous"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={locale === 'ar' ? 'M9 5l7 7-7 7' : 'M15 19l-7-7 7-7'}
                />
              </svg>
            </button>
            
            <span className="text-[#25445E] font-bold text-lg">
              {String(currentSlide + 1).padStart(2, '0')}/{String(totalSlides).padStart(2, '0')}
            </span>
            
            <button
              onClick={goToNext}
              disabled={currentSlide >= totalSlides - 1}
              className={`p-2 rounded-lg transition-all ${
                currentSlide >= totalSlides - 1
                  ? 'text-gray-300 cursor-not-allowed'
                  : 'text-[#25445E] hover:bg-[#EDF5FB] cursor-pointer'
              }`}
              aria-label="Next"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={locale === 'ar' ? 'M15 19l-7-7 7-7' : 'M9 5l7 7-7 7'}
                />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Projects Grid - يعرض 4 بطاقات في كل slide */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-8 md:mb-12">
        {currentProjects.map((project) => (
          <div
            key={project.id}
            className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col"
          >
            {/* Project Image */}
            <div className="relative h-48 md:h-56 w-full">
              <Image
                src={project.image}
                alt={project.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>

            {/* Project Content */}
            <div className="p-4 md:p-6 flex-grow flex flex-col">
              {/* Project Title */}
              <h3 className="text-lg md:text-xl font-bold text-[#25445E] mb-4 flex-grow">
                {project.name}
              </h3>

              {/* Tags/Sectors - عرض جميع التاغات */}
              {project.tags && project.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map((tag) => (
                    <span
                      key={tag.id}
                      className="text-xs md:text-sm text-[#4DA2DF] bg-[#EDF5FB] px-2 py-1 rounded"
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              )}

              {/* Read More Button */}
              <Link
                href={`/${locale}/projects/${project.id}`}
                className="mt-auto bg-[#4DA2DF] text-white px-4 py-2 md:px-6 md:py-3 rounded-lg font-bold text-center hover:bg-[#3993d4] transition-colors duration-200 text-sm md:text-base"
              >
                {dict.common.readMore}
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* View All Projects Button */}
      <div className="text-center">
        <Link
          href={`/${locale}/projects`}
          className="inline-block bg-[#4DA2DF] text-white px-8 py-3 rounded-lg font-bold hover:bg-[#3993d4] transition-colors duration-200"
        >
          {dict.home.viewAllProjects}
        </Link>
      </div>
    </section>
  );
}
