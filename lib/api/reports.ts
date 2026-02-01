export interface ReportTag {
  id: number;
  name: string;
  created_at?: string;
}

export interface ReportItem {
  id: number;
  name: string;
  description?: string;
  image?: string;
  publishing_date?: string;
  pdf?: string;
  tags?: ReportTag[];
  created_at?: string;
}

export interface ReportsPaginatedResponse {
  status: string;
  message: string;
  data: {
    reports?: ReportItem[];
    report_tags?: ReportTag[];
    total?: number;
    current_page?: number;
    total_pages?: number;
  };
  statusCode: number;
}

export interface ReportDetailResponse {
  status: string;
  message: string;
  data: {
    report?: ReportItem;
  };
  statusCode: number;
}

export async function getReportsPaginated(
  page: number = 1,
  search: string = '',
  tagId: string = '',
  perPage: number = 6,
  locale: string = 'ar'
): Promise<{
  reports: ReportItem[];
  tags: ReportTag[];
  currentPage: number;
  totalPages: number;
  total: number;
}> {
  try {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (tagId) params.set('tag_id', tagId);
    params.set('page', page.toString());
    params.set('per_page', perPage.toString());

    const response = await fetch(
      `https://app.mosaic-hrd.org/api/reports/paginated?${params.toString()}`,
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
      throw new Error('Failed to fetch reports');
    }

    const data: ReportsPaginatedResponse = await response.json();
    const allReports = data.data?.reports || [];
    const total = data.data?.total ?? allReports.length;
    const totalPages =
      data.data?.total_pages ?? Math.max(1, Math.ceil(total / perPage));
    const reports =
      allReports.length <= perPage
        ? allReports
        : allReports.slice((page - 1) * perPage, page * perPage);

    return {
      reports,
      tags: data.data?.report_tags || [],
      currentPage: page,
      totalPages,
      total: total || allReports.length,
    };
  } catch (error) {
    console.error('Error fetching reports:', error);
    return {
      reports: [],
      tags: [],
      currentPage: 1,
      totalPages: 1,
      total: 0,
    };
  }
}

export async function getReportById(
  id: string,
  locale: string = 'ar'
): Promise<ReportItem | null> {
  try {
    const response = await fetch(
      `https://app.mosaic-hrd.org/api/reports/${id}`,
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
      throw new Error('Failed to fetch report');
    }

    const data: ReportDetailResponse = await response.json();
    return data.data?.report ?? null;
  } catch (error) {
    console.error('Error fetching report:', error);
    return null;
  }
}
