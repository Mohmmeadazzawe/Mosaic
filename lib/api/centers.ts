export interface CenterTag {
  id: number;
  name: string;
  created_at?: string;
}

export interface CenterItem {
  id: number;
  name: string;
  description?: string;
  image?: string;
  address?: string;
  lat?: number;
  lon?: number;
  opening_date?: string;
  sector_id?: string[];
  tags?: CenterTag[];
  created_at?: string;
}

export interface CentersPaginatedResponse {
  status: string;
  message: string;
  data: {
    centers: CenterItem[];
    total?: number;
    current_page?: number;
    total_pages?: number;
  };
  statusCode: number;
}

export interface CenterDetailResponse {
  status: string;
  message: string;
  data: {
    center: CenterItem;
    center_tags?: CenterTag[];
  };
  statusCode: number;
}

export interface CentersListResponse {
  status: string;
  message: string;
  data: {
    centers: CenterItem[];
    center_tags?: CenterTag[];
  };
  statusCode: number;
}

export async function getCentersByProject(
  projectId: string,
  sectorId: string = '',
  page: number = 1,
  perPage: number = 4,
  locale: string = 'ar'
): Promise<{
  centers: CenterItem[];
  currentPage: number;
  totalPages: number;
  total: number;
}> {
  try {
    const params = new URLSearchParams({
      project_id: projectId,
      sector_id: sectorId,
      page: page.toString(),
      per_page: perPage.toString(),
    });

    const response = await fetch(
      `https://app.mosaic-hrd.org/api/centers/paginated?${params.toString()}`,
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
      throw new Error('Failed to fetch centers');
    }

    const data: CentersPaginatedResponse = await response.json();
    return {
      centers: data.data?.centers || [],
      currentPage: data.data?.current_page || 1,
      totalPages: data.data?.total_pages || 1,
      total: data.data?.total || 0,
    };
  } catch (error) {
    console.error('Error fetching centers:', error);
    return {
      centers: [],
      currentPage: 1,
      totalPages: 1,
      total: 0,
    };
  }
}

export async function getCentersBySector(
  sectorId: string,
  page: number = 1,
  perPage: number = 4,
  locale: string = 'ar'
): Promise<{
  centers: CenterItem[];
  currentPage: number;
  totalPages: number;
  total: number;
}> {
  try {
    const params = new URLSearchParams({
      project_id: '',
      sector_id: sectorId,
      page: page.toString(),
      per_page: perPage.toString(),
    });

    const response = await fetch(
      `https://app.mosaic-hrd.org/api/centers/paginated?${params.toString()}`,
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
      throw new Error('Failed to fetch centers');
    }

    const data: CentersPaginatedResponse = await response.json();
    const allCenters = data.data?.centers || [];
    const total = data.data?.total ?? allCenters.length;
    const totalPages =
      data.data?.total_pages ?? Math.max(1, Math.ceil(total / perPage));
    const centers =
      allCenters.length <= perPage
        ? allCenters
        : allCenters.slice((page - 1) * perPage, page * perPage);
    return {
      centers,
      currentPage: page,
      totalPages,
      total: total || allCenters.length,
    };
  } catch (error) {
    console.error('Error fetching centers by sector:', error);
    return {
      centers: [],
      currentPage: 1,
      totalPages: 1,
      total: 0,
    };
  }
}

export async function getCenterById(
  id: string,
  locale: string = 'ar'
): Promise<{ center: CenterItem | null; tags: CenterTag[] }> {
  try {
    const response = await fetch(`https://app.mosaic-hrd.org/api/centers/${id}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Accept-Language': locale,
      },
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch center details');
    }

    const data: CenterDetailResponse = await response.json();
    return {
      center: data.data?.center || null,
      tags: data.data?.center_tags || [],
    };
  } catch (error) {
    console.error(`Error fetching center ${id}:`, error);
    return { center: null, tags: [] };
  }
}

export async function getAllCenters(
  locale: string = 'ar'
): Promise<CenterItem[]> {
  try {
    const response = await fetch('https://app.mosaic-hrd.org/api/centers', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Accept-Language': locale,
      },
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch centers');
    }

    const data: CentersListResponse = await response.json();
    return data.data?.centers || [];
  } catch (error) {
    console.error('Error fetching centers:', error);
    return [];
  }
}
