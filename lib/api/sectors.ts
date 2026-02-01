export interface SectorItem {
  id: number;
  name: string;
  color: string;
  description?: string;
  image?: string;
  created_at?: string;
}

export interface SectorsResponse {
  status: string;
  message: string;
  data: SectorItem[];
  statusCode: number;
}

export interface SectorDetailResponse {
  status: string;
  message: string;
  data: SectorItem | SectorItem[];
  statusCode: number;
}

export async function getSectorById(id: string, locale: string = 'ar'): Promise<SectorItem | null> {
  try {
    const response = await fetch(`https://app.mosaic-hrd.org/api/sectors/${id}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Accept-Language': locale,
      },
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch sector');
    }

    const data: SectorDetailResponse = await response.json();
    if (!data.data) return null;
    const item = Array.isArray(data.data) ? data.data[0] : data.data;
    return item ?? null;
  } catch (error) {
    console.error('Error fetching sector by id:', error);
    // Fallback: fetch all sectors and find by id
    try {
      const sectors = await getSectors(locale, '');
      const found = sectors.find(
        (s) => String(s.id) === id || s.id === Number(id)
      );
      return found ?? null;
    } catch (fallbackError) {
      console.error('Fallback getSectors failed:', fallbackError);
      return null;
    }
  }
}

export async function getSectors(locale: string = 'ar', search: string = ''): Promise<SectorItem[]> {
  try {
    const response = await fetch(`https://app.mosaic-hrd.org/api/sectors?search=${search}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Accept-Language': locale,
      },
      next: { revalidate: 3600 },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch sectors');
    }
    
    const data: SectorsResponse = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching sectors:', error);
    // Return empty array - component will handle it
    return [];
  }
}
