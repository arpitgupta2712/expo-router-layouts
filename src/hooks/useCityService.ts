import { useState, useEffect, useCallback } from 'react';
import { cityService } from '../services/CityService';
import { City } from '../types/AdminTypes';

interface UseCityServiceReturn {
  cities: City[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  getCityById: (id: number) => Promise<City | null>;
  getCityByName: (name: string) => Promise<City | null>;
  searchCities: (query: string) => Promise<City[]>;
  getCitiesWithMetro: () => Promise<City[]>;
  clearCache: () => void;
  cacheStatus: { hasCache: boolean; timestamp?: number; age?: number };
}

/**
 * Hook for using the CityService to fetch and manage city data
 */
export const useCityService = (): UseCityServiceReturn => {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCities = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const cityData = await cityService.getCities();
      setCities(cityData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch cities';
      setError(errorMessage);
      console.error('❌ useCityService error:', errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const getCityById = useCallback(async (id: number): Promise<City | null> => {
    try {
      return await cityService.getCityById(id);
    } catch (err) {
      console.error('❌ Error fetching city by ID:', err);
      return null;
    }
  }, []);

  const getCityByName = useCallback(async (name: string): Promise<City | null> => {
    try {
      return await cityService.getCityByName(name);
    } catch (err) {
      console.error('❌ Error fetching city by name:', err);
      return null;
    }
  }, []);

  const searchCities = useCallback(async (query: string): Promise<City[]> => {
    try {
      return await cityService.searchCities(query);
    } catch (err) {
      console.error('❌ Error searching cities:', err);
      return [];
    }
  }, []);

  const getCitiesWithMetro = useCallback(async (): Promise<City[]> => {
    try {
      return await cityService.getCitiesWithMetro();
    } catch (err) {
      console.error('❌ Error fetching cities with metro:', err);
      return [];
    }
  }, []);

  const clearCache = useCallback(() => {
    cityService.clearCache();
  }, []);

  const getCacheStatus = useCallback(() => {
    return cityService.getCacheStatus();
  }, []);

  // Load cities on mount
  useEffect(() => {
    fetchCities();
  }, [fetchCities]);

  return {
    cities,
    loading,
    error,
    refetch: fetchCities,
    getCityById,
    getCityByName,
    searchCities,
    getCitiesWithMetro,
    clearCache,
    cacheStatus: getCacheStatus(),
  };
};
