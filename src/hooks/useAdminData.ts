import { useState, useEffect, useCallback } from 'react';
import { adminService } from '../services/AdminService';
import { 
  UseAdminDataReturn, 
  MultiAdminResponse, 
  Admin, 
  Venue, 
  Facility 
} from '../types/AdminTypes';

/**
 * Hook for fetching and managing admin data
 */
export const useAdminData = (adminIds: string[] = ['9910545678', '9999099867']): UseAdminDataReturn => {
  const [data, setData] = useState<MultiAdminResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await adminService.getMultipleAdmins(adminIds);
      setData(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch admin data';
      setError(errorMessage);
      console.error('❌ useAdminData error:', errorMessage);
    } finally {
      setLoading(false);
    }
  }, [adminIds]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
};

/**
 * Hook for getting all venues from admin data
 */
export const useVenues = (adminIds: string[] = ['9910545678', '9999099867']) => {
  const { data, loading, error, refetch } = useAdminData(adminIds);
  const [venues, setVenues] = useState<Venue[]>([]);

  useEffect(() => {
    if (data?.data.venues) {
      // Venues are directly available in data.venues, not nested under admins
      const allVenues = data.data.venues.filter(venue => venue && venue.id && venue.name);
      setVenues(allVenues);
    }
  }, [data]);

  const getVenuesByCity = useCallback((cityId: string): Venue[] => {
    return venues.filter(venue => venue.city_id && venue.city_id.toString() === cityId);
  }, [venues]);

  const getVenuesBySport = useCallback((sport: string): Venue[] => {
    return venues.filter(venue => 
      venue.sports.some(s => s.toLowerCase().includes(sport.toLowerCase()))
    );
  }, [venues]);

  const getVenuesByAdmin = useCallback((adminId: string): Venue[] => {
    // Since venues are not nested under admins in the API response,
    // we'll need to implement this based on your business logic
    // For now, return all venues
    return venues;
  }, [venues]);

  return {
    venues,
    loading,
    error,
    getVenuesByCity,
    getVenuesBySport,
    getVenuesByAdmin,
    refetch,
  };
};

/**
 * Hook for getting all facilities from admin data
 */
export const useFacilities = (adminIds: string[] = ['9910545678', '9999099867']) => {
  const { data, loading, error, refetch } = useAdminData(adminIds);
  const [facilities, setFacilities] = useState<Facility[]>([]);

  useEffect(() => {
    if (data?.data.venues) {
      const allFacilities = data.data.venues
        .flatMap(venue => venue.facilities);
      setFacilities(allFacilities);
    }
  }, [data]);

  const getFacilitiesByVenue = useCallback((venueId: string): Facility[] => {
    if (!data?.data.venues) return [];
    const venue = data.data.venues.find(v => v.id === venueId);
    return venue?.facilities || [];
  }, [data]);

  const getFacilitiesBySport = useCallback((sport: string): Facility[] => {
    return facilities.filter(facility => 
      facility.sports.some(s => s.name.toLowerCase().includes(sport.toLowerCase()))
    );
  }, [facilities]);

  const getFacilitiesByPriceRange = useCallback((minPrice: number, maxPrice: number): Facility[] => {
    return facilities.filter(facility => {
      const price = parseFloat(facility.price);
      return price >= minPrice && price <= maxPrice;
    });
  }, [facilities]);

  return {
    facilities,
    loading,
    error,
    getFacilitiesByVenue,
    getFacilitiesBySport,
    getFacilitiesByPriceRange,
    refetch,
  };
};

/**
 * Hook for getting cities from admin data
 */
export const useCities = (adminIds: string[] = ['9910545678', '9999099867']) => {
  const { data, loading, error, refetch } = useAdminData(adminIds);
  const [cities, setCities] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    if (data?.data.summary.unique_cities) {
      setCities(data.data.summary.unique_cities);
    }
  }, [data]);

  const getCityById = useCallback((cityId: string) => {
    return cities.find(city => city.id === cityId);
  }, [cities]);

  const getCityByName = useCallback((cityName: string) => {
    return cities.find(city => 
      city.name.toLowerCase().includes(cityName.toLowerCase())
    );
  }, [cities]);

  return {
    cities,
    loading,
    error,
    getCityById,
    getCityByName,
    refetch,
  };
};

/**
 * Hook for getting sports from admin data
 */
export const useSports = (adminIds: string[] = ['9910545678', '9999099867']) => {
  const { data, loading, error, refetch } = useAdminData(adminIds);
  const [sports, setSports] = useState<string[]>([]);

  useEffect(() => {
    if (data?.data.summary.unique_sports) {
      setSports(data.data.summary.unique_sports);
    }
  }, [data]);

  const getSportByName = useCallback((sportName: string) => {
    return sports.find(sport => 
      sport.toLowerCase().includes(sportName.toLowerCase())
    );
  }, [sports]);

  return {
    sports,
    loading,
    error,
    getSportByName,
    refetch,
  };
};
