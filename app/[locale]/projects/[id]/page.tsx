'use client';

import { useState, useEffect } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getProjectById, type ProjectItem } from '@/lib/api/projects';
import { getSuccessStoriesByProject, type SuccessStoryItem } from '@/lib/api/successStories';
import { getActivitiesByProject, type ActivityItem } from '@/lib/api/activities';
import { getCentersByProject, type CenterItem } from '@/lib/api/centers';
import Loading from '@/components/common/Loading';
import { getDictionary } from '@/lib/i18n/dictionary';
import type { Locale } from '@/lib/i18n/config';

// Center Card Component with Image Loader
function CenterCard({ center, locale }: { center: CenterItem; locale: Locale }) {
  const [imageLoading, setImageLoading] = useState(true);

  return (
    <Link
      href={`/${locale}/centers/${center.id}`}
      className="bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-xl group"
    >
      {center.image && (
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
            src={center.image}
            alt={center.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover"
            onLoad={() => setImageLoading(false)}
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
              setImageLoading(false);
            }}
          />
        </div>
      )}
      <div className="p-4">
        <h3 className="text-base md:text-lg font-bold text-[#25445E] mb-2 line-clamp-2 group-hover:text-[#4DA2DF] transition-colors">
          {center.name}
        </h3>
        {center.description && (
          <p className="text-sm text-gray-600 line-clamp-2">{center.description}</p>
        )}
        {center.address && (
          <p className="text-xs text-gray-500 mt-2">📍 {center.address}</p>
        )}
      </div>
    </Link>
  );
}

export default function ProjectDetailPage({
  params,
}: {
  params: { locale: Locale; id: string };
}) {
  const { locale, id } = params;
  const dict = getDictionary(locale);

  const [project, setProject] = useState<ProjectItem | null>(null);
  const [successStories, setSuccessStories] = useState<SuccessStoryItem[]>([]);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [centers, setCenters] = useState<CenterItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [successStoriesPage, setSuccessStoriesPage] = useState(1);
  const [successStoriesTotalPages, setSuccessStoriesTotalPages] = useState(1);
  const [activitiesPage, setActivitiesPage] = useState(1);
  const [activitiesTotalPages, setActivitiesTotalPages] = useState(1);
  const [centersPage, setCentersPage] = useState(1);
  const [centersTotalPages, setCentersTotalPages] = useState(1);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        // Fetch project details
        const projectData = await getProjectById(id, locale);
        if (!projectData) {
          setLoading(false);
          return;
        }
        setProject(projectData);

        // Fetch success stories
        const storiesData = await getSuccessStoriesByProject(id, 1, 4, locale);
        setSuccessStories(storiesData.stories);
        setSuccessStoriesTotalPages(storiesData.totalPages);

        // Fetch activities
        const activitiesData = await getActivitiesByProject(id, '', '', '', '', 1, 4, locale);
        setActivities(activitiesData.activities);
        setActivitiesTotalPages(activitiesData.totalPages);

        // Fetch centers
        const centersData = await getCentersByProject(id, '', 1, 4, locale);
        setCenters(centersData.centers);
        setCentersTotalPages(centersData.totalPages);
      } catch (error) {
        console.error('Error fetching project data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id, locale]);

  const handleSuccessStoriesPageChange = async (page: number) => {
    setSuccessStoriesPage(page);
    const data = await getSuccessStoriesByProject(id, page, 4, locale);
    setSuccessStories(data.stories);
    setSuccessStoriesTotalPages(data.totalPages);
  };

  const handleActivitiesPageChange = async (page: number) => {
    setActivitiesPage(page);
    const data = await getActivitiesByProject(id, '', '', '', '', page, 4, locale);
    setActivities(data.activities);
    setActivitiesTotalPages(data.totalPages);
  };

  const handleCentersPageChange = async (page: number) => {
    setCentersPage(page);
    const data = await getCentersByProject(id, '', page, 4, locale);
    setCenters(data.centers);
    setCentersTotalPages(data.totalPages);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-[3%] md:px-[4%] py-16">
        <Loading locale={locale} />
      </div>
    );
  }

  if (!project) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative w-full h-[400px] md:h-[500px]">
        <Image
          src={project.image}
          alt={project.name}
          fill
          sizes="100vw"
          className="object-cover"
          priority
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-3xl md:text-5xl font-bold text-white text-center px-4">
            {project.name}
          </h1>
        </div>
      </div>

      <div className="container mx-auto px-[3%] md:px-[4%] py-8 md:py-12">
        {/* Back Button */}
        <Link
          href={`/${locale}/projects`}
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
          {locale === 'ar' ? 'العودة إلى المشاريع' : 'Back to Projects'}
        </Link>

        {/* Project Description */}
        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 mb-8 md:mb-12">
          {/* Project Image */}
          <div className="relative w-full h-[400px] md:h-[500px] mb-6 rounded-lg overflow-hidden">
            <Image
              src={project.image}
              alt={project.name}
              fill
              sizes="100vw"
              className="object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>

          {/* Project Info (Date & Tags) */}
          <div className="flex flex-col md:flex-row gap-4 md:gap-6 mb-6 pb-6 border-b border-gray-200">
            {project.created_at && (
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
                  <strong>{locale === 'ar' ? 'تاريخ الإنشاء:' : 'Created:'}</strong>{' '}
                  {new Date(project.created_at).toLocaleDateString(
                    locale === 'ar' ? 'ar-SA' : 'en-US',
                    {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    }
                  )}
                </span>
              </div>
            )}
            {project.tags && project.tags.length > 0 && (
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
                <span className="text-sm md:text-base font-semibold text-[#25445E]">
                  {locale === 'ar' ? 'التاغات:' : 'Tags:'}
                </span>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
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

          {/* Project Description */}
          <div
            className="prose max-w-none text-gray-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: project.description }}
          />
        </div>

        {/* Success Stories Section */}
        {successStories.length > 0 && (
          <section className="mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-[#25445E] mb-6 md:mb-8 text-center">
              {dict.nav.successStories}
            </h2>
            <div
              className={
                successStories.length < 4 ? 'flex justify-center mb-6' : 'mb-6'
              }
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {successStories.map((story) => (
                  <Link
                    key={story.id}
                    href={`/${locale}/success-stories/${story.id}`}
                    className="bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-xl group"
                  >
                    <div className="relative h-48 md:h-56 w-full">
                      <Image
                        src={story.image}
                        alt={story.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-base md:text-lg font-bold text-[#25445E] line-clamp-2 group-hover:text-[#4DA2DF] transition-colors">
                        {story.name}
                      </h3>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Pagination for Success Stories */}
            {successStoriesTotalPages > 1 && (
              <div className="flex justify-center items-center gap-2 flex-wrap">
                <button
                  onClick={() => handleSuccessStoriesPageChange(successStoriesPage - 1)}
                  disabled={successStoriesPage === 1}
                  className={`px-4 py-2 rounded-lg font-bold transition-all ${
                    successStoriesPage === 1
                      ? 'text-gray-300 cursor-not-allowed'
                      : 'text-[#25445E] hover:bg-[#EDF5FB] cursor-pointer'
                  }`}
                >
                  {locale === 'ar' ? 'السابق' : 'Previous'}
                </button>

                {Array.from({ length: successStoriesTotalPages }, (_, i) => i + 1).map((page) => {
                  if (
                    page === 1 ||
                    page === successStoriesTotalPages ||
                    (page >= successStoriesPage - 1 && page <= successStoriesPage + 1)
                  ) {
                    return (
                      <button
                        key={page}
                        onClick={() => handleSuccessStoriesPageChange(page)}
                        className={`px-4 py-2 rounded-lg font-bold transition-all ${
                          page === successStoriesPage
                            ? 'bg-[#4DA2DF] text-white'
                            : 'text-[#25445E] hover:bg-[#EDF5FB]'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  } else if (page === successStoriesPage - 2 || page === successStoriesPage + 2) {
                    return <span key={page} className="px-2 text-gray-400">...</span>;
                  }
                  return null;
                })}

                <button
                  onClick={() => handleSuccessStoriesPageChange(successStoriesPage + 1)}
                  disabled={successStoriesPage === successStoriesTotalPages}
                  className={`px-4 py-2 rounded-lg font-bold transition-all ${
                    successStoriesPage === successStoriesTotalPages
                      ? 'text-gray-300 cursor-not-allowed'
                      : 'text-[#25445E] hover:bg-[#EDF5FB] cursor-pointer'
                  }`}
                >
                  {locale === 'ar' ? 'التالي' : 'Next'}
                </button>
              </div>
            )}
          </section>
        )}

        {/* Activities Section */}
        {activities.length > 0 && (
          <section className="mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-[#25445E] mb-6 md:mb-8 text-center">
              {dict.nav.activities}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
              {activities.map((activity) => (
                <Link
                  key={activity.id}
                  href={`/${locale}/activities/${activity.id}`}
                  className="bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-xl group"
                >
                  <div className="relative h-48 md:h-56 w-full">
                    <Image
                      src={activity.image}
                      alt={activity.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-base md:text-lg font-bold text-[#25445E] line-clamp-2 group-hover:text-[#4DA2DF] transition-colors">
                      {activity.name}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination for Activities */}
            {activitiesTotalPages > 1 && (
              <div className="flex justify-center items-center gap-2 flex-wrap">
                <button
                  onClick={() => handleActivitiesPageChange(activitiesPage - 1)}
                  disabled={activitiesPage === 1}
                  className={`px-4 py-2 rounded-lg font-bold transition-all ${
                    activitiesPage === 1
                      ? 'text-gray-300 cursor-not-allowed'
                      : 'text-[#25445E] hover:bg-[#EDF5FB] cursor-pointer'
                  }`}
                >
                  {locale === 'ar' ? 'السابق' : 'Previous'}
                </button>

                {Array.from({ length: activitiesTotalPages }, (_, i) => i + 1).map((page) => {
                  if (
                    page === 1 ||
                    page === activitiesTotalPages ||
                    (page >= activitiesPage - 1 && page <= activitiesPage + 1)
                  ) {
                    return (
                      <button
                        key={page}
                        onClick={() => handleActivitiesPageChange(page)}
                        className={`px-4 py-2 rounded-lg font-bold transition-all ${
                          page === activitiesPage
                            ? 'bg-[#4DA2DF] text-white'
                            : 'text-[#25445E] hover:bg-[#EDF5FB]'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  } else if (page === activitiesPage - 2 || page === activitiesPage + 2) {
                    return <span key={page} className="px-2 text-gray-400">...</span>;
                  }
                  return null;
                })}

                <button
                  onClick={() => handleActivitiesPageChange(activitiesPage + 1)}
                  disabled={activitiesPage === activitiesTotalPages}
                  className={`px-4 py-2 rounded-lg font-bold transition-all ${
                    activitiesPage === activitiesTotalPages
                      ? 'text-gray-300 cursor-not-allowed'
                      : 'text-[#25445E] hover:bg-[#EDF5FB] cursor-pointer'
                  }`}
                >
                  {locale === 'ar' ? 'التالي' : 'Next'}
                </button>
              </div>
            )}
          </section>
        )}

        {/* Centers Section */}
        {centers.length > 0 && (
          <section className="mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-[#25445E] mb-6 md:mb-8 text-center">
              {locale === 'ar' ? 'المراكز' : 'Centers'}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
              {centers.map((center) => (
                <CenterCard key={center.id} center={center} locale={locale} />
              ))}
            </div>

            {/* Pagination for Centers */}
            {centersTotalPages > 1 && (
              <div className="flex justify-center items-center gap-2 flex-wrap">
                <button
                  onClick={() => handleCentersPageChange(centersPage - 1)}
                  disabled={centersPage === 1}
                  className={`px-4 py-2 rounded-lg font-bold transition-all ${
                    centersPage === 1
                      ? 'text-gray-300 cursor-not-allowed'
                      : 'text-[#25445E] hover:bg-[#EDF5FB] cursor-pointer'
                  }`}
                >
                  {locale === 'ar' ? 'السابق' : 'Previous'}
                </button>

                {Array.from({ length: centersTotalPages }, (_, i) => i + 1).map((page) => {
                  if (
                    page === 1 ||
                    page === centersTotalPages ||
                    (page >= centersPage - 1 && page <= centersPage + 1)
                  ) {
                    return (
                      <button
                        key={page}
                        onClick={() => handleCentersPageChange(page)}
                        className={`px-4 py-2 rounded-lg font-bold transition-all ${
                          page === centersPage
                            ? 'bg-[#4DA2DF] text-white'
                            : 'text-[#25445E] hover:bg-[#EDF5FB]'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  } else if (page === centersPage - 2 || page === centersPage + 2) {
                    return <span key={page} className="px-2 text-gray-400">...</span>;
                  }
                  return null;
                })}

                <button
                  onClick={() => handleCentersPageChange(centersPage + 1)}
                  disabled={centersPage === centersTotalPages}
                  className={`px-4 py-2 rounded-lg font-bold transition-all ${
                    centersPage === centersTotalPages
                      ? 'text-gray-300 cursor-not-allowed'
                      : 'text-[#25445E] hover:bg-[#EDF5FB] cursor-pointer'
                  }`}
                >
                  {locale === 'ar' ? 'التالي' : 'Next'}
                </button>
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
}
