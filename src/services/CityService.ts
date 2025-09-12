import { City } from '../types/AdminTypes';
import { logApi, logCache, LogLevel } from '../utils/core/logging';

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
      logCache(LogLevel.INFO, 'City data cache hit', { cityCount: this.cache.data.length });
      return this.cache.data;
    }

    try {
      logApi(LogLevel.INFO, 'Fetching city data from Hudle API');
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
      
      logApi(LogLevel.INFO, 'City data fetched successfully', { cityCount: apiResponse.data.length });
      return apiResponse.data;
      
    } catch (error) {
      logApi(LogLevel.ERROR, 'Failed to fetch cities', { error: error.message });
      
      // Return cached data if available, even if expired
      if (this.cache) {
        logCache(LogLevel.WARN, 'Using expired cached city data due to API error', { cityCount: this.cache.data.length });
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
      logApi(LogLevel.ERROR, 'Failed to fetch city by ID', { id, error: error.message });
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
      logApi(LogLevel.ERROR, 'Failed to fetch city by name', { name, error: error.message });
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
      logApi(LogLevel.ERROR, 'Failed to search cities', { query, error: error.message });
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
      logApi(LogLevel.ERROR, 'Failed to fetch cities with metro', { error: error.message });
      return [];
    }
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache = null;
    logCache(LogLevel.INFO, 'City service cache cleared');
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
