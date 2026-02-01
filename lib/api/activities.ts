export interface ActivityTag {
  id: number;
  name: string;
  created_at?: string;
}

export interface ActivityItem {
  id: number;
  name: string;
  description: string;
  image: string;
  images?: string[];
  tags: ActivityTag[];
  sectors?: string[];
  projects?: string[];
  centers?: string[];
  publishing_date?: string;
  video_url?: string | null;
  created_at?: string;
}

export interface ActivitiesPaginatedResponse {
  status: string;
  message: string;
  data: {
    activities: ActivityItem[];
    activity_tags?: ActivityTag[];
    total?: number;
    count?: number;
    per_page?: number;
    current_page?: number;
    total_pages?: number;
    links?: { first: string; last: string; prev: string | null; next: string | null };
  };
  statusCode: number;
}

export async function getActivitiesPaginated(
  page: number = 1,
  search: string = '',
  centerId: string = '',
  sectorId: string = '',
  tagId: string = '',
  perPage: number = 6,
  locale: string = 'ar'
): Promise<{
  activities: ActivityItem[];
  tags: ActivityTag[];
  currentPage: number;
  totalPages: number;
  total: number;
}> {
  try {
    const params = new URLSearchParams({
      search: search || '',
      center_id: centerId || '',
      tag_id: tagId || '',
      page: page.toString(),
      per_page: perPage.toString(),
    });
    if (sectorId) params.set('sector_id', sectorId);

    const response = await fetch(
      `https://app.mosaic-hrd.org/api/activities/paginated?${params.toString()}`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Accept-Language': locale,
        },
        next: { revalidate: 3600 },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch activities');
    }

    const data: ActivitiesPaginatedResponse = await response.json();
    const dataObj = data.data ?? {};
    const activitiesList = Array.isArray(dataObj.activities) ? dataObj.activities : [];

    const allTags = new Map<number, ActivityTag>();
    if (dataObj?.activity_tags && dataObj.activity_tags.length > 0) {
      dataObj.activity_tags.forEach((tag) => allTags.set(tag.id, tag));
    } else {
      activitiesList.forEach((activity) => {
        activity.tags?.forEach((tag) => {
          if (!allTags.has(tag.id)) allTags.set(tag.id, tag);
        });
      });
    }

    return {
      activities: activitiesList,
      tags: Array.from(allTags.values()),
      currentPage: dataObj?.current_page ?? 1,
      totalPages: dataObj?.total_pages ?? 1,
      total: dataObj?.total ?? 0,
    };
  } catch (error) {
    console.error('Error fetching activities:', error);
    return {
      activities: [],
      tags: [],
      currentPage: 1,
      totalPages: 1,
      total: 0,
    };
  }
}

export interface ActivityDetailResponse {
  status: string;
  message: string;
  data: {
    activity: ActivityItem;
    activity_tags?: ActivityTag[];
  };
  statusCode: number;
}

export async function getActivityById(
  id: string,
  locale: string = 'ar'
): Promise<{ activity: ActivityItem | null; tags: ActivityTag[] }> {
  try {
    const response = await fetch(`https://app.mosaic-hrd.org/api/activities/${id}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Accept-Language': locale,
      },
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch activity details');
    }

    const data: ActivityDetailResponse = await response.json();
    return {
      activity: data.data?.activity || null,
      tags: data.data?.activity_tags || [],
    };
  } catch (error) {
    console.error(`Error fetching activity ${id}:`, error);
    return { activity: null, tags: [] };
  }
}

export async function getActivitiesByProject(
  projectId: string,
  search: string = '',
  centerId: string = '',
  sectorId: string = '',
  tagId: string = '',
  page: number = 1,
  perPage: number = 4,
  locale: string = 'ar'
): Promise<{
  activities: ActivityItem[];
  currentPage: number;
  totalPages: number;
  total: number;
}> {
  try {
    const params = new URLSearchParams({
      search: search,
      project_id: projectId,
      center_id: centerId,
      sector_id: sectorId,
      tag_id: tagId,
      page: page.toString(),
      per_page: perPage.toString(),
    });

    const response = await fetch(
      `https://app.mosaic-hrd.org/api/activities/paginated?${params.toString()}`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Accept-Language': locale,
        },
        next: { revalidate: 3600 },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch activities');
    }

    const data: ActivitiesPaginatedResponse = await response.json();
    const dataObj = data.data;
    const activitiesList = Array.isArray(dataObj?.activities)
      ? dataObj.activities
      : Array.isArray((dataObj as { data?: ActivityItem[] })?.data)
        ? (dataObj as { data: ActivityItem[] }).data
        : [];

    return {
      activities: activitiesList,
      currentPage: dataObj?.current_page ?? 1,
      totalPages: dataObj?.total_pages ?? 1,
      total: dataObj?.total ?? 0,
    };
  } catch (error) {
    console.error('Error fetching activities:', error);
    return {
      activities: [],
      currentPage: 1,
      totalPages: 1,
      total: 0,
    };
  }
}
