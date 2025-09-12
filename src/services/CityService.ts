import { City } from '../types/AdminTypes';

interface CityApiResponse {
  success: boolean;
  code: number;
  data: City[];
}

interface CityServiceCache {
  data: City[];
  timestamp: number;
}

class CityService {
  private baseUrl = 'https://api.hudle.in/api/v1';
  private cache: CityServiceCache | null = null;
  private readonly CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

  /**
   * Get all cities from Hudle API with caching
   */
  async getCities(): Promise<City[]> {
    const now = Date.now();

    // Check cache first
    if (this.cache && (now - this.cache.timestamp < this.CACHE_DURATION)) {
      console.log('📦 Returning cached city data');
      return this.cache.data;
    }

    try {
      console.log('🌐 Fetching city data from Hudle API...');
      const response = await fetch(`${this.baseUrl}/cities`, {
        method: 'GET',
        headers: {
          'Accept': '*/*',
          'Accept-Language': 'en-US,en;q=0.9',
          'Api-Secret': 'hudle-api1798@prod',
          'Connection': 'keep-alive',
          'Origin': 'https://hudle.in',
          'Referer': 'https://hudle.in/',
          'Sec-Fetch-Dest': 'empty',
          'Sec-Fetch-Mode': 'cors',
          'Sec-Fetch-Site': 'same-site',
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const apiResponse: CityApiResponse = await response.json();
      
      if (!apiResponse.success) {
        throw new Error(`API error: ${apiResponse.code}`);
      }

      // Update cache
      this.cache = { 
        data: apiResponse.data, 
        timestamp: now 
      };
      
      console.log(`✅ City data fetched and cached successfully (${apiResponse.data.length} cities)`);
      return apiResponse.data;
      
    } catch (error) {
      console.error('❌ Error fetching cities:', error);
      
      // Return cached data if available, even if expired
      if (this.cache) {
        console.log('⚠️ Using expired cached city data due to API error');
        return this.cache.data;
      }
      
      throw error;
    }
  }

  /**
   * Get city by ID
   */
  async getCityById(id: number): Promise<City | null> {
    try {
      const cities = await this.getCities();
      return cities.find(city => city.id === id) || null;
    } catch (error) {
      console.error('❌ Error fetching city by ID:', error);
      return null;
    }
  }

  /**
   * Get city by name (case-insensitive)
   */
  async getCityByName(name: string): Promise<City | null> {
    try {
      const cities = await this.getCities();
      return cities.find(city => 
        city.name.toLowerCase() === name.toLowerCase()
      ) || null;
    } catch (error) {
      console.error('❌ Error fetching city by name:', error);
      return null;
    }
  }

  /**
   * Search cities by partial name match
   */
  async searchCities(query: string): Promise<City[]> {
    try {
      const cities = await this.getCities();
      const lowercaseQuery = query.toLowerCase();
      
      return cities.filter(city => 
        city.name.toLowerCase().includes(lowercaseQuery)
      );
    } catch (error) {
      console.error('❌ Error searching cities:', error);
      return [];
    }
  }

  /**
   * Get cities with metro stations
   */
  async getCitiesWithMetro(): Promise<City[]> {
    try {
      const cities = await this.getCities();
      return cities.filter(city => city.show_metro_station);
    } catch (error) {
      console.error('❌ Error fetching cities with metro:', error);
      return [];
    }
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache = null;
    console.log('🗑️ City service cache cleared');
  }

  /**
   * Get cache status
   */
  getCacheStatus(): { hasCache: boolean; timestamp?: number; age?: number } {
    if (!this.cache) {
      return { hasCache: false };
    }

    const age = Date.now() - this.cache.timestamp;
    return {
      hasCache: true,
      timestamp: this.cache.timestamp,
      age: age,
    };
  }
}

// Export singleton instance
export const cityService = new CityService();
