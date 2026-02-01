export interface PartnerItem {
  id: number;
  name: string;
  image: string;
  website?: string;
  created_at?: string;
}

export interface PartnersResponse {
  status: string;
  message: string;
  data: PartnerItem[];
  statusCode: number;
}

export async function getPartners(locale: string = 'ar'): Promise<PartnerItem[]> {
  try {
    const response = await fetch('https://app.mosaic-hrd.org/api/partners', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Accept-Language': locale,
      },
      next: { revalidate: 3600 }, // Cache for 1 hour
      cache: 'no-store', // For development, remove in production
    });

    if (!response.ok) {
      throw new Error('Failed to fetch partners');
    }

    const data: PartnersResponse = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching partners:', error);
    return [];
  }
}
