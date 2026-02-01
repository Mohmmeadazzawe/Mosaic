export interface StatisticItem {
  title: string;
  number: string;
}

export interface HomeStatisticsResponse {
  status: string;
  message: string;
  data: {
    statistics: StatisticItem[];
    youtube_url: string;
  };
  statusCode: number;
}

export interface StatisticTag {
  id: number;
  name: string;
  created_at?: string;
}

export interface StatisticsListItem {
  id: number;
  name: string;
  description: string;
  image: string;
  publishing_date?: string;
  tags: StatisticTag[];
  created_at?: string;
}

export interface StatisticsPaginatedResponse {
  status: string;
  message: string;
  data: {
    statistics: StatisticsListItem[];
    statistic_tags?: StatisticTag[];
    total?: number;
    current_page?: number;
    total_pages?: number;
  };
  statusCode: number;
}

export async function getStatisticsPaginated(
  page: number = 1,
  perPage: number = 10,
  locale: string = 'ar'
): Promise<{
  statistics: StatisticsListItem[];
  tags: StatisticTag[];
  currentPage: number;
  totalPages: number;
  total: number;
}> {
  try {
    const response = await fetch(
      `https://app.mosaic-hrd.org/api/statistics/paginated?page=${page}&per_page=${perPage}`,
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
      throw new Error('Failed to fetch statistics');
    }

    const data: StatisticsPaginatedResponse = await response.json();
    
    // Extract tags from response
    const allTags = new Map<number, StatisticTag>();
    if (data.data?.statistic_tags && data.data.statistic_tags.length > 0) {
      data.data.statistic_tags.forEach((tag) => {
        allTags.set(tag.id, tag);
      });
    } else if (data.data?.statistics) {
      // Fallback: extract tags from statistics
      data.data.statistics.forEach((stat) => {
        if (stat.tags) {
          stat.tags.forEach((tag) => {
            if (!allTags.has(tag.id)) {
              allTags.set(tag.id, tag);
            }
          });
        }
      });
    }

    return {
      statistics: data.data?.statistics || [],
      tags: Array.from(allTags.values()),
      currentPage: data.data?.current_page || 1,
      totalPages: data.data?.total_pages || 1,
      total: data.data?.total || 0,
    };
  } catch (error) {
    console.error('Error fetching statistics:', error);
    return {
      statistics: [],
      tags: [],
      currentPage: 1,
      totalPages: 1,
      total: 0,
    };
  }
}

export interface StatisticsDetailResponse {
  status: string;
  message: string;
  data: {
    statistic: StatisticsListItem;
    statistic_tags?: StatisticTag[];
  };
  statusCode: number;
}

export interface StatisticsListResponse {
  status: string;
  message: string;
  data: {
    statistics: StatisticsListItem[];
    statistic_tags?: StatisticTag[];
  };
  statusCode: number;
}

export async function getStatisticById(
  id: string,
  locale: string = 'ar'
): Promise<{ statistic: StatisticsListItem | null; tags: StatisticTag[] }> {
  try {
    const response = await fetch(`https://app.mosaic-hrd.org/api/statistics/${id}`, {
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
      throw new Error('Failed to fetch statistic details');
    }

    const data: StatisticsDetailResponse = await response.json();
    return {
      statistic: data.data?.statistic || null,
      tags: data.data?.statistic_tags || [],
    };
  } catch (error) {
    console.error(`Error fetching statistic ${id}:`, error);
    return { statistic: null, tags: [] };
  }
}

export async function getLatestStatistics(
  locale: string = 'ar'
): Promise<StatisticsListItem[]> {
  try {
    const response = await fetch('https://app.mosaic-hrd.org/api/statistics', {
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
      throw new Error('Failed to fetch latest statistics');
    }

    const data: StatisticsListResponse = await response.json();
    return data.data?.statistics || [];
  } catch (error) {
    console.error('Error fetching latest statistics:', error);
    return [];
  }
}

export async function getHomeStatistics(locale: string = 'ar'): Promise<{
  statistics: StatisticItem[];
  youtube_url: string;
}> {
  try {
    const response = await fetch('https://app.mosaic-hrd.org/api/home-statistics', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Accept-Language': locale,
      },
      next: { revalidate: 3600 },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch statistics');
    }
    
    const data: HomeStatisticsResponse = await response.json();
    return {
      statistics: data.data?.statistics || [],
      youtube_url: data.data?.youtube_url || '',
    };
  } catch (error) {
    console.error('Error fetching statistics:', error);
    // Return empty - component will handle it
    return {
      statistics: [],
      youtube_url: '',
    };
  }
}
