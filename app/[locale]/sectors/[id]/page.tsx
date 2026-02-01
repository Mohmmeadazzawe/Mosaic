'use client';

import { useState, useEffect, useCallback } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getSectorById, type SectorItem } from '@/lib/api/sectors';
import { getProjectsPaginated, type ProjectItem } from '@/lib/api/projects';
import { getActivitiesPaginated, type ActivityItem } from '@/lib/api/activities';
import { getSuccessStoriesBySector, type SuccessStoryItem } from '@/lib/api/successStories';
import { getCentersBySector, type CenterItem } from '@/lib/api/centers';
import Loading from '@/components/common/Loading';
import { getDictionary } from '@/lib/i18n/dictionary';
import type { Locale } from '@/lib/i18n/config';

function stripDescriptionHtml(html: string): string {
  if (!html) return '';
  return html
    .replace(/<img[^>]*>/gi, '')
    .replace(/<hr[^>]*>/gi, '');
}

export default function SectorDetailPage({
  params,
}: {
  params: { locale: Locale; id: string };
}) {
  const { locale, id } = params;
  const dict = getDictionary(locale);

  const [sector, setSector] = useState<SectorItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [successStories, setSuccessStories] = useState<SuccessStoryItem[]>([]);
  const [centersAll, setCentersAll] = useState<CenterItem[]>([]);
  const [centersPage, setCentersPage] = useState(1);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [projectsPage, setProjectsPage] = useState(1);
  const [projectsTotalPages, setProjectsTotalPages] = useState(1);
  const [successStoriesPage, setSuccessStoriesPage] = useState(1);
  const [successStoriesTotalPages, setSuccessStoriesTotalPages] = useState(1);
  const [activitiesPage, setActivitiesPage] = useState(1);
  const [activitiesTotalPages, setActivitiesTotalPages] = useState(1);

  const centersPerPage = 4;
  const centersTotalPages = Math.max(1, Math.ceil(centersAll.length / centersPerPage));
  const centers = centersAll.slice(
    (centersPage - 1) * centersPerPage,
    centersPage * centersPerPage
  );

  const fetchSector = useCallback(async () => {
    if (!id) {
      setLoading(false);
      setError('No sector ID');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await getSectorById(id, locale);
      if (data) {
        setSector(data);
        setProjectsPage(1);
        setSuccessStoriesPage(1);
        setCentersPage(1);
        setActivitiesPage(1);
        const [projectsData, successStoriesData, centersData, activitiesData] = await Promise.all([
          getProjectsPaginated(1, '', '', '', 4, locale, id),
          getSuccessStoriesBySector(id, 1, 4, locale),
          getCentersBySector(id, 1, 100, locale),
          getActivitiesPaginated(1, '', '', id, '', 4, locale),
        ]);
        setProjects(projectsData.projects);
        setProjectsTotalPages(projectsData.totalPages);
        setSuccessStories(successStoriesData.stories);
        setSuccessStoriesTotalPages(successStoriesData.totalPages);
        setCentersAll(centersData.centers);
        setActivities(activitiesData.activities);
        setActivitiesTotalPages(activitiesData.totalPages);
      } else {
        setSector(null);
      }
    } catch (err) {
      console.error('Error fetching sector:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      setSector(null);
    } finally {
      setLoading(false);
    }
  }, [id, locale]);

  useEffect(() => {
    fetchSector();
  }, [fetchSector]);

  const handleProjectsPageChange = async (page: number) => {
    setProjectsPage(page);
    const data = await getProjectsPaginated(page, '', '', '', 4, locale, id);
    setProjects(data.projects);
    setProjectsTotalPages(data.totalPages);
  };

  const handleSuccessStoriesPageChange = async (page: number) => {
    setSuccessStoriesPage(page);
    const data = await getSuccessStoriesBySector(id, page, 4, locale);
    setSuccessStories(data.stories);
    setSuccessStoriesTotalPages(data.totalPages);
  };

  const handleCentersPageChange = (page: number) => {
    setCentersPage(page);
  };

  const handleActivitiesPageChange = async (page: number) => {
    setActivitiesPage(page);
    const data = await getActivitiesPaginated(page, '', '', id, '', 4, locale);
    setActivities(data.activities);
    setActivitiesTotalPages(data.totalPages);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div
          className="w-full h-[200px] md:h-[280px] flex items-center justify-center"
          style={{ backgroundColor: '#EDF5FB' }}
        >
          <h1 className="text-2xl md:text-4xl font-bold text-[#25445E] px-4">
            {dict.sectorDetail.loadingTitle}
          </h1>
        </div>
        <div className="container mx-auto px-[3%] md:px-[4%] py-16">
          <Loading locale={locale} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div
          className="w-full h-[200px] md:h-[280px] flex items-center justify-center"
          style={{ backgroundColor: '#EDF5FB' }}
        >
          <h1 className="text-2xl md:text-4xl font-bold text-[#25445E] px-4">
            {dict.sectorDetail.loadingTitle}
          </h1>
        </div>
        <div className="container mx-auto px-[3%] md:px-[4%] py-12 text-center">
          <p className="text-red-600 mb-4">{dict.sectorDetail.errorMessage}</p>
          <button
            onClick={fetchSector}
            className="px-6 py-3 bg-[#4DA2DF] text-white rounded-lg font-bold hover:bg-[#3993d4] transition-colors"
          >
            {dict.sectorDetail.retry}
          </button>
        </div>
      </div>
    );
  }

  if (!sector) {
    notFound();
  }

  const descriptionHtml = sector.description
    ? stripDescriptionHtml(sector.description)
    : '';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Banner / Hero */}
      <div className="relative w-full h-[400px] md:h-[500px]">
        {sector.image ? (
          <>
            <Image
              src={sector.image}
              alt={sector.name}
              fill
              sizes="100vw"
              className="object-cover"
              priority
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
            <div className="absolute inset-0 bg-black/40" />
          </>
        ) : (
          <div
            className="absolute inset-0"
            style={{ backgroundColor: sector.color || '#4DA2DF' }}
          />
        )}
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-3xl md:text-5xl font-bold text-white text-center px-4">
            {sector.name}
          </h1>
        </div>
      </div>

      <div className="container mx-auto px-[3%] md:px-[4%] py-8 md:py-12">
        {/* Back Button */}
        <Link
          href={`/${locale}/about`}
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
          {dict.sectorDetail.backToAbout}
        </Link>

        {/* Sector description */}
        {(sector.image || descriptionHtml) && (
          <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 mb-8 md:mb-12">
            {sector.image && (
              <div className="relative w-full h-[200px] md:h-[280px] mb-6 rounded-lg overflow-hidden">
                <Image
                  src={sector.image}
                  alt={sector.name}
                  fill
                  sizes="100vw"
                  className="object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            )}
            {descriptionHtml && (
              <div
                className="prose max-w-none text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: descriptionHtml }}
              />
            )}
          </div>
        )}

        {/* Projects Section */}
        {projects.length > 0 && (
          <section className="mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-[#25445E] mb-6 md:mb-8 text-center">
              {dict.sectorDetail.projectsTitle}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
              {projects.map((project) => (
                <Link
                  key={project.id}
                  href={`/${locale}/projects/${project.id}`}
                  className="bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-xl group"
                >
                  <div className="relative h-48 md:h-56 w-full bg-gray-200">
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
                  <div className="p-4">
                    <h3 className="text-base md:text-lg font-bold text-[#25445E] line-clamp-2 group-hover:text-[#4DA2DF] transition-colors">
                      {project.name}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>

            {projectsTotalPages > 1 && (
              <div className="flex justify-center items-center gap-2 flex-wrap">
                <button
                  onClick={() => handleProjectsPageChange(projectsPage - 1)}
                  disabled={projectsPage === 1}
                  className={`px-4 py-2 rounded-lg font-bold transition-all ${
                    projectsPage === 1
                      ? 'text-gray-300 cursor-not-allowed'
                      : 'text-[#25445E] hover:bg-[#EDF5FB] cursor-pointer'
                  }`}
                >
                  {locale === 'ar' ? 'السابق' : 'Previous'}
                </button>
                {Array.from({ length: projectsTotalPages }, (_, i) => i + 1).map((page) => {
                  if (
                    page === 1 ||
                    page === projectsTotalPages ||
                    (page >= projectsPage - 1 && page <= projectsPage + 1)
                  ) {
                    return (
                      <button
                        key={page}
                        onClick={() => handleProjectsPageChange(page)}
                        className={`px-4 py-2 rounded-lg font-bold transition-all ${
                          page === projectsPage
                            ? 'bg-[#4DA2DF] text-white'
                            : 'text-[#25445E] hover:bg-[#EDF5FB]'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  } else if (page === projectsPage - 2 || page === projectsPage + 2) {
                    return <span key={page} className="px-2 text-gray-400">...</span>;
                  }
                  return null;
                })}
                <button
                  onClick={() => handleProjectsPageChange(projectsPage + 1)}
                  disabled={projectsPage === projectsTotalPages}
                  className={`px-4 py-2 rounded-lg font-bold transition-all ${
                    projectsPage === projectsTotalPages
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

        {/* Success Stories Section */}
        {successStories.length > 0 && (
          <section className="mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-[#25445E] mb-6 md:mb-8 text-center">
              {dict.sectorDetail.successStoriesTitle}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
              {successStories.slice(0, 4).map((story) => (
                <Link
                  key={story.id}
                  href={`/${locale}/success-stories/${story.id}`}
                  className="bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-xl group"
                >
                  <div className="relative h-48 md:h-56 w-full bg-gray-200">
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

        {/* Centers Section */}
        {centersAll.length > 0 && (
          <section className="mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-[#25445E] mb-6 md:mb-8 text-center">
              {dict.sectorDetail.centersTitle}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
              {centers.map((center) => (
                <Link
                  key={center.id}
                  href={`/${locale}/centers/${center.id}`}
                  className="bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-xl group"
                >
                  {center.image ? (
                    <div className="relative h-48 md:h-56 w-full bg-gray-200">
                      <Image
                        src={center.image}
                        alt={center.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                  ) : (
                    <div className="h-48 md:h-56 w-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-400 text-4xl">📍</span>
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="text-base md:text-lg font-bold text-[#25445E] line-clamp-2 group-hover:text-[#4DA2DF] transition-colors">
                      {center.name}
                    </h3>
                    {center.address && (
                      <p className="text-xs text-gray-500 mt-2 line-clamp-1">📍 {center.address}</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>

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

        {/* Activities Section */}
        {activities.length > 0 && (
          <section className="mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-[#25445E] mb-6 md:mb-8 text-center">
              {dict.sectorDetail.activitiesTitle}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
              {activities.map((activity) => (
                <Link
                  key={activity.id}
                  href={`/${locale}/activities/${activity.id}`}
                  className="bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-xl group"
                >
                  <div className="relative h-48 md:h-56 w-full bg-gray-200">
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
      </div>
    </div>
  );
}
