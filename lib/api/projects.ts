export interface ProjectTag {
  id: number;
  name: string;
  created_at?: string;
}

export interface ProjectItem {
  id: number;
  name: string;
  description: string;
  color: string;
  image: string;
  tags: ProjectTag[];
  sectors?: string[];
  centers?: string[];
  created_at?: string;
}

export interface ProjectsPaginatedResponse {
  status: string;
  message: string;
  data: {
    projects: ProjectItem[];
    project_tags?: ProjectTag[];
    total: number;
    count: number;
    per_page: number;
    current_page: number;
    total_pages: number;
    links: {
      first: string;
      last: string;
      prev: string | null;
      next: string | null;
    };
  };
  statusCode: number;
}

export interface ProjectDetailResponse {
  status: string;
  message: string;
  data: ProjectItem | { project: ProjectItem };
  statusCode: number;
}

export async function getProjectsPaginated(
  page: number = 1,
  search: string = '',
  centerId: string = '',
  tagId: string = '',
  perPage: number = 4,
  locale: string = 'ar',
  sectorId: string = ''
): Promise<{
  projects: ProjectItem[];
  currentPage: number;
  totalPages: number;
  total: number;
}> {
  try {
    const params = new URLSearchParams({
      search: search,
      center_id: centerId,
      tag_id: tagId,
      page: page.toString(),
      per_page: perPage.toString(),
    });
    if (sectorId) params.set('sector_id', sectorId);

    const response = await fetch(
      `https://app.mosaic-hrd.org/api/projects/paginated?${params.toString()}`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Accept-Language': locale,
        },
        next: { revalidate: 3600 }, // Cache for 1 hour
        cache: 'no-store', // For development, remove in production
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch projects');
    }

    const data: ProjectsPaginatedResponse = await response.json();
    return {
      projects: data.data?.projects || [],
      currentPage: data.data?.current_page || 1,
      totalPages: data.data?.total_pages || 1,
      total: data.data?.total || 0,
    };
  } catch (error) {
    console.error('Error fetching projects:', error);
    return {
      projects: [],
      currentPage: 1,
      totalPages: 1,
      total: 0,
    };
  }
}

export async function getProjectById(
  projectId: string,
  locale: string = 'ar'
): Promise<ProjectItem | null> {
  try {
    const response = await fetch(
      `https://app.mosaic-hrd.org/api/projects/${projectId}`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Accept-Language': locale,
        },
        next: { revalidate: 3600 },
        cache: 'no-store',
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch project');
    }

    const data: ProjectDetailResponse = await response.json();
    // Handle both response structures: data.project or data directly
    if (!data.data) return null;
    if ('project' in data.data) {
      return data.data.project;
    }
    return data.data as ProjectItem;
  } catch (error) {
    console.error('Error fetching project:', error);
    return null;
  }
}
