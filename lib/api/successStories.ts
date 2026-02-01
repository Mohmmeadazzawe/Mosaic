export interface SuccessStoryTag {
  id: number;
  name: string;
  created_at?: string;
}

export interface SuccessStoryItem {
  id: number;
  name: string;
  description: string;
  image: string;
  images?: string[];
  video_url?: string;
  publishing_date?: string;
  tags: SuccessStoryTag[];
  sectors?: string[];
  projects?: string[];
  created_at?: string;
}

export interface SuccessStoriesResponse {
  status: string;
  message: string;
  data: {
    success_stories: SuccessStoryItem[];
    success_stories_tags?: SuccessStoryTag[];
  };
  statusCode: number;
}

export interface SuccessStoriesPaginatedResponse {
  status: string;
  message: string;
  data: {
    success_stories?: SuccessStoryItem[];
    success_stories_tags?: SuccessStoryTag[];
    centers?: SuccessStoryItem[]; // Fallback for old API structure
    tags?: SuccessStoryTag[]; // Alternative tags field
    total?: number;
    current_page?: number;
    total_pages?: number;
  };
  statusCode: number;
}

export interface SuccessStoryDetailResponse {
  status: string;
  message: string;
  data: {
    success_story: SuccessStoryItem;
    success_stories_tags: SuccessStoryTag[];
  };
  statusCode: number;
}

export async function getSuccessStories(
  search: string = '',
  centerId: string = '',
  tagId: string = '',
  locale: string = 'ar'
): Promise<SuccessStoryItem[]> {
  try {
    const params = new URLSearchParams({
      search: search,
      center_id: centerId,
      tag_id: tagId,
    });

    const response = await fetch(
      `https://app.mosaic-hrd.org/api/success-stories?${params.toString()}`,
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
      throw new Error('Failed to fetch success stories');
    }

    const data: SuccessStoriesResponse = await response.json();
    return data.data?.success_stories || [];
  } catch (error) {
    console.error('Error fetching success stories:', error);
    return [];
  }
}

export async function getSuccessStoriesPaginated(
  page: number = 1,
  perPage: number = 6,
  locale: string = 'ar'
): Promise<{
  stories: SuccessStoryItem[];
  tags: SuccessStoryTag[];
  currentPage: number;
  totalPages: number;
  total: number;
}> {
  try {
    const response = await fetch(
      `https://app.mosaic-hrd.org/api/success-stories/paginated?page=${page}`,
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
      throw new Error('Failed to fetch success stories');
    }

    const data: SuccessStoriesPaginatedResponse = await response.json();
    
    console.log('Success Stories API Response:', JSON.stringify(data, null, 2));
    
    // Handle different response structures (data.success_stories or data.centers)
    let stories: SuccessStoryItem[] = [];
    if (data.data?.success_stories && Array.isArray(data.data.success_stories)) {
      stories = data.data.success_stories;
    } else if ((data.data as any)?.centers && Array.isArray((data.data as any).centers)) {
      // Fallback: sometimes API returns in centers field (old build compatibility)
      stories = (data.data as any).centers;
    }
    
    // Extract tags from all stories or use provided tags
    const allTags = new Map<number, SuccessStoryTag>();
    if (data.data?.success_stories_tags && data.data.success_stories_tags.length > 0) {
      data.data.success_stories_tags.forEach((tag) => {
        allTags.set(tag.id, tag);
      });
    } else if ((data.data as any)?.tags && Array.isArray((data.data as any).tags)) {
      (data.data as any).tags.forEach((tag: SuccessStoryTag) => {
        allTags.set(tag.id, tag);
      });
    } else if (stories.length > 0) {
      // Extract tags from stories
      stories.forEach((story) => {
        if (story.tags) {
          story.tags.forEach((tag) => {
            if (!allTags.has(tag.id)) {
              allTags.set(tag.id, tag);
            }
          });
        }
      });
    }

    console.log('Processed stories:', stories.length);
    console.log('Processed tags:', Array.from(allTags.values()).length);

    return {
      stories: stories,
      tags: Array.from(allTags.values()),
      currentPage: data.data?.current_page || 1,
      totalPages: data.data?.total_pages || 1,
      total: data.data?.total || stories.length,
    };
  } catch (error) {
    console.error('Error fetching success stories:', error);
    return {
      stories: [],
      tags: [],
      currentPage: 1,
      totalPages: 1,
      total: 0,
    };
  }
}

export async function getSuccessStoriesByProject(
  projectId: string,
  page: number = 1,
  perPage: number = 4,
  locale: string = 'ar'
): Promise<{
  stories: SuccessStoryItem[];
  currentPage: number;
  totalPages: number;
  total: number;
}> {
  try {
    const params = new URLSearchParams({
      search: '',
      project_id: projectId,
      sector_id: '',
      tag_id: '',
      page: page.toString(),
      per_page: perPage.toString(),
    });

    const response = await fetch(
      `https://app.mosaic-hrd.org/api/success-stories?${params.toString()}`,
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
      throw new Error('Failed to fetch success stories');
    }

    const data: SuccessStoriesPaginatedResponse = await response.json();
    return {
      stories: data.data?.success_stories || [],
      currentPage: data.data?.current_page || 1,
      totalPages: data.data?.total_pages || 1,
      total: data.data?.total || 0,
    };
  } catch (error) {
    console.error('Error fetching success stories:', error);
    return {
      stories: [],
      currentPage: 1,
      totalPages: 1,
      total: 0,
    };
  }
}

export async function getSuccessStoriesBySector(
  sectorId: string,
  page: number = 1,
  perPage: number = 4,
  locale: string = 'ar'
): Promise<{
  stories: SuccessStoryItem[];
  currentPage: number;
  totalPages: number;
  total: number;
}> {
  try {
    const params = new URLSearchParams({
      search: '',
      project_id: '',
      sector_id: sectorId,
      tag_id: '',
      page: page.toString(),
      per_page: perPage.toString(),
    });

    const response = await fetch(
      `https://app.mosaic-hrd.org/api/success-stories?${params.toString()}`,
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
      throw new Error('Failed to fetch success stories');
    }

    const data: SuccessStoriesPaginatedResponse = await response.json();
    const allStories = data.data?.success_stories || [];
    const total = data.data?.total ?? allStories.length;
    const totalPages =
      data.data?.total_pages ??
      Math.max(1, Math.ceil(total / perPage));
    const stories =
      allStories.length <= perPage
        ? allStories
        : allStories.slice((page - 1) * perPage, page * perPage);
    return {
      stories,
      currentPage: page,
      totalPages,
      total,
    };
  } catch (error) {
    console.error('Error fetching success stories by sector:', error);
    return {
      stories: [],
      currentPage: 1,
      totalPages: 1,
      total: 0,
    };
  }
}

export async function getSuccessStoryById(
  id: string,
  locale: string = 'ar'
): Promise<{
  story: SuccessStoryItem | null;
  tags: SuccessStoryTag[];
}> {
  try {
    const response = await fetch(`https://app.mosaic-hrd.org/api/success-stories/${id}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Accept-Language': locale,
      },
      next: { revalidate: 3600 },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch success story');
    }

    const data: SuccessStoryDetailResponse = await response.json();
    return {
      story: data.data?.success_story || null,
      tags: data.data?.success_stories_tags || [],
    };
  } catch (error) {
    console.error(`Error fetching success story ${id}:`, error);
    return {
      story: null,
      tags: [],
    };
  }
}
