export interface HeroItem {
  id: number;
  title: string;
  url: string | null;
  image: string;
  created_at: string;
}

export interface HeroesResponse {
  status: string;
  message: string;
  data: HeroItem[];
  statusCode: number;
}

export async function getHeroes(locale: string = 'ar'): Promise<HeroItem[]> {
  try {
    const response = await fetch('https://app.mosaic-hrd.org/api/heroes', {
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
      throw new Error('Failed to fetch heroes');
    }
    
    const data: HeroesResponse = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching heroes:', error);
    // Return empty array - component will handle it
    return [];
  }
}
