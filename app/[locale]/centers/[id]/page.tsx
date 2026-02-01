'use client';

import { useState, useEffect } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getCenterById, getAllCenters, type CenterItem, type CenterTag } from '@/lib/api/centers';
import { getProjectsPaginated, type ProjectItem } from '@/lib/api/projects';
import { getActivitiesPaginated, type ActivityItem } from '@/lib/api/activities';
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
      {/* Center Image */}
      <div className="relative h-48 md:h-56 w-full bg-gray-200">
        {/* Loader */}
        {imageLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-200 z-10">
            <div className="flex flex-col items-center gap-2">
              <div className="w-8 h-8 border-4 border-[#4DA2DF] border-t-transparent rounded-full animate-spin"></div>
            </div>
          </div>
        )}
        {center.image && (
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
        )}
      </div>

      {/* Center Content */}
      <div className="p-4">
        <h3 className="text-base md:text-lg font-bold text-[#25445E] line-clamp-2 group-hover:text-[#4DA2DF] transition-colors">
          {center.name}
        </h3>
      </div>
    </Link>
  );
}

// Project Card Component with Image Loader
function ProjectCard({ project, locale }: { project: ProjectItem; locale: Locale }) {
  const [imageLoading, setImageLoading] = useState(true);

  return (
    <Link
      href={`/${locale}/projects/${project.id}`}
      className="bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-xl group"
    >
      {/* Project Image */}
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
          src={project.image}
          alt={project.name}
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

      {/* Project Content */}
      <div className="p-4">
        <h3 className="text-base md:text-lg font-bold text-[#25445E] line-clamp-2 group-hover:text-[#4DA2DF] transition-colors">
          {project.name}
        </h3>
        {project.tags && project.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {project.tags.slice(0, 2).map((tag) => (
              <span
                key={tag.id}
                className="text-xs text-[#4DA2DF] bg-[#EDF5FB] px-2 py-1 rounded-full"
              >
                {tag.name}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}

// Activity Card Component with Image Loader
function ActivityCard({ activity, locale }: { activity: ActivityItem; locale: Locale }) {
  const [imageLoading, setImageLoading] = useState(true);

  return (
    <Link
      href={`/${locale}/activities/${activity.id}`}
      className="bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-xl group"
    >
      {/* Activity Image */}
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
          src={activity.image}
          alt={activity.name}
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

      {/* Activity Content */}
      <div className="p-4">
        <h3 className="text-base md:text-lg font-bold text-[#25445E] line-clamp-2 group-hover:text-[#4DA2DF] transition-colors">
          {activity.name}
        </h3>
        {activity.publishing_date && (
          <div className="flex items-center gap-2 text-gray-600 text-sm mt-2">
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
              {new Date(activity.publishing_date).toLocaleDateString(
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

export default function CenterDetailPage({
  params,
}: {
  params: { locale: Locale; id: string };
}) {
  const { locale, id } = params;
  const dict = getDictionary(locale);

  const [center, setCenter] = useState<CenterItem | null>(null);
  const [tags, setTags] = useState<CenterTag[]>([]);
  const [allCentersList, setAllCentersList] = useState<CenterItem[]>([]);
  const [centersPage, setCentersPage] = useState(1);
  const CENTERS_PER_PAGE = 4;
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [projectsPage, setProjectsPage] = useState(1);
  const [projectsTotalPages, setProjectsTotalPages] = useState(1);
  const [activitiesPage, setActivitiesPage] = useState(1);
  const [activitiesTotalPages, setActivitiesTotalPages] = useState(1);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        // Fetch center details
        const centerData = await getCenterById(id, locale);
        if (!centerData.center) {
          setLoading(false);
          return;
        }
        setCenter(centerData.center);
        setTags(centerData.tags);

        // Fetch all centers (excluding current center)
        const centersData = await getAllCenters(locale);
        setAllCentersList(centersData.filter((c) => c.id.toString() !== id));

        // Fetch projects
        const projectsData = await getProjectsPaginated(1, '', id, '', 4, locale);
        setProjects(projectsData.projects);
        setProjectsTotalPages(projectsData.totalPages);

        // Fetch activities
        const activitiesData = await getActivitiesPaginated(1, '', id, '', '', 4, locale);
        setActivities(activitiesData.activities);
        setActivitiesTotalPages(activitiesData.totalPages);
      } catch (error) {
        console.error('Error fetching center data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id, locale]);

  const handleProjectsPageChange = async (page: number) => {
    setProjectsPage(page);
    const data = await getProjectsPaginated(page, '', id, '', 4, locale);
    setProjects(data.projects);
    setProjectsTotalPages(data.totalPages);
  };

  const handleActivitiesPageChange = async (page: number) => {
    setActivitiesPage(page);
    const data = await getActivitiesPaginated(page, '', id, '', '', 4, locale);
    setActivities(data.activities);
    setActivitiesTotalPages(data.totalPages);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-[3%] md:px-[4%] py-16">
        <Loading locale={locale} />
      </div>
    );
  }

  if (!center) {
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

  const centersTotalPages = Math.ceil(allCentersList.length / CENTERS_PER_PAGE) || 1;
  const displayedCenters = allCentersList.slice(
    (centersPage - 1) * CENTERS_PER_PAGE,
    centersPage * CENTERS_PER_PAGE
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Image - Full Width */}
      {center.image && (
        <div className="relative w-full h-[400px] md:h-[500px]">
          <Image
            src={center.image}
            alt={center.name}
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

        {/* Center Header: Name and Opening Date */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white rounded-lg shadow-lg p-6 md:p-8 mb-8 md:mb-12">
          <h1 className="text-2xl md:text-3xl font-bold text-[#25445E] mb-4 md:mb-0">
            {center.name}
          </h1>
          {center.opening_date && (
            <span className="text-gray-600 text-sm md:text-base">
              <strong>{locale === 'ar' ? 'تاريخ الافتتاح:' : 'Opening Date:'}</strong>{' '}
              {formatDate(center.opening_date)}
            </span>
          )}
        </div>

        {/* Center Info: Address, Sectors, Tags */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12">
          {/* Address */}
          {center.address && (
            <div className="flex flex-col gap-2 bg-white rounded-lg shadow-sm p-4">
              <span className="text-sm md:text-base font-semibold text-[#25445E]">
                {locale === 'ar' ? 'العنوان:' : 'Address:'}
              </span>
              <span className="text-sm text-gray-700">{center.address}</span>
            </div>
          )}

          {/* Sectors */}
          {center.sector_id && center.sector_id.length > 0 && (
            <div className="flex flex-col gap-2 bg-white rounded-lg shadow-sm p-4">
              <span className="text-sm md:text-base font-semibold text-[#25445E]">
                {locale === 'ar' ? 'القطاعات:' : 'Sectors:'}
              </span>
              <div className="flex flex-wrap gap-2">
                {center.sector_id.map((sector, index) => (
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

          {/* Tags */}
          {center.tags && center.tags.length > 0 && (
            <div className="flex flex-col gap-2 bg-white rounded-lg shadow-sm p-4">
              <span className="text-sm md:text-base font-semibold text-[#25445E]">
                {locale === 'ar' ? 'الوسوم:' : 'Tags:'}
              </span>
              <div className="flex flex-wrap gap-2">
                {center.tags.map((tag) => (
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
        </div>

        {/* Description */}
        {center.description && (
          <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 mb-8 md:mb-12">
            <div
              className="prose max-w-none text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: center.description }}
            />
          </div>
        )}

        {/* Projects Section */}
        {projects.length > 0 && (
          <div className="mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-[#25445E] mb-6 md:mb-8 text-center">
              {locale === 'ar' ? 'المشاريع' : 'Projects'}
            </h2>
            <div
              className={
                projects.length < 4
                  ? 'flex justify-center mb-6'
                  : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6'
              }
            >
              {projects.length < 4 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                  {projects.map((project) => (
                    <ProjectCard key={project.id} project={project} locale={locale} />
                  ))}
                </div>
              )}
              {projects.length >= 4 &&
                projects.map((project) => (
                  <ProjectCard key={project.id} project={project} locale={locale} />
                ))}
            </div>

            {/* Projects Pagination */}
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
          </div>
        )}

        {/* Activities Section */}
        {activities.length > 0 && (
          <div className="mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-[#25445E] mb-6 md:mb-8 text-center">
              {locale === 'ar' ? 'أنشطة المركز' : 'Center Activities'}
            </h2>
            <div
              className={
                activities.length < 4
                  ? 'flex justify-center mb-6'
                  : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6'
              }
            >
              {activities.length < 4 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                  {activities.map((activity) => (
                    <ActivityCard key={activity.id} activity={activity} locale={locale} />
                  ))}
                </div>
              )}
              {activities.length >= 4 &&
                activities.map((activity) => (
                  <ActivityCard key={activity.id} activity={activity} locale={locale} />
                ))}
            </div>

            {/* Activities Pagination */}
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
          </div>
        )}

        {/* Other Centers Section */}
        {allCentersList.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl md:text-3xl font-bold text-[#25445E] mb-6 md:mb-8 text-center">
              {locale === 'ar' ? 'المراكز الأخرى' : 'Other Centers'}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
              {displayedCenters.map((c) => (
                <CenterCard key={c.id} center={c} locale={locale} />
              ))}
            </div>

            {/* Centers Pagination */}
            {centersTotalPages > 1 && (
              <div className="flex justify-center items-center gap-2 flex-wrap">
                <button
                  onClick={() => setCentersPage((p) => Math.max(1, p - 1))}
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
                        onClick={() => setCentersPage(page)}
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
                  onClick={() => setCentersPage((p) => Math.min(centersTotalPages, p + 1))}
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
          </div>
        )}
      </div>
    </div>
  );
}
