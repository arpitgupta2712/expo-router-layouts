import React, { useState, useEffect, useCallback, createContext, useContext, ReactNode } from 'react';
import { adminService } from '../services/AdminService';
import { 
  UseAdminDataReturn, 
  MultiAdminResponse, 
  Admin, 
  Venue, 
  Facility,
  City,
  Sport
} from '../types/AdminTypes';

// Create context for admin data
const AdminDataContext = createContext<UseAdminDataReturn | null>(null);

/**
 * Provider component for admin data
 */
export const AdminDataProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<MultiAdminResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🌐 Fetching admin data from API...');
      const result = await adminService.getMultipleAdmins(['9910545678', '9999099867']);
      setData(result);
      console.log('✅ Admin data fetched and cached successfully');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch admin data';
      setError(errorMessage);
      console.error('❌ useAdminData error:', errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const value: UseAdminDataReturn = {
    data,
    loading,
    error,
    refetch: fetchData,
  };

  return React.createElement(
    AdminDataContext.Provider,
    { value },
    children
  );
};

/**
 * Hook to use admin data from context
 */
export const useAdminData = (): UseAdminDataReturn => {
  const context = useContext(AdminDataContext);
  if (!context) {
    throw new Error('useAdminData must be used within AdminDataProvider');
  }
  return context;
};

/**
 * Hook for getting all cities from admin data
 */
export const useCities = () => {
  const { data, loading, error } = useAdminData();
  
  const cities: City[] = data?.data?.summary?.unique_cities || [];
  
  return {
    cities,
    loading,
    error,
  };
};

/**
 * Hook for getting all venues from admin data
 */
export const useVenues = () => {
  const { data, loading, error } = useAdminData();
  
  const venues: Venue[] = data?.data?.venues || [];
  
  const getVenuesByCity = useCallback((cityId: string | number) => {
    if (!venues.length) return [];
    return venues.filter(venue => venue.city_id && venue.city_id.toString() === cityId.toString());
  }, [venues]);

  const getVenuesByAdmin = useCallback((adminId: string) => {
    // Since venues are at the top level, return all venues
    return venues;
  }, [venues]);

  return {
    venues,
    loading,
    error,
    getVenuesByCity,
    getVenuesByAdmin,
  };
};

/**
 * Hook for getting all facilities from admin data
 */
export const useFacilities = () => {
  const { data, loading, error } = useAdminData();
  
  const allFacilities: Facility[] = data?.data?.venues?.flatMap(venue => venue.facilities) || [];
  
  const getFacilitiesByVenue = useCallback((venueId: string) => {
    if (!data?.data?.venues) return [];
    const venue = data.data.venues.find(v => v.id === venueId);
    return venue?.facilities || [];
  }, [data]);

  const getFacilitiesBySport = useCallback((sportName: string) => {
    if (!allFacilities.length) return [];
    return allFacilities.filter(facility => 
      facility.sports?.some(s => s.name === sportName)
    );
  }, [allFacilities]);

  const getFacilitiesByPriceRange = useCallback((minPrice: number, maxPrice: number) => {
    if (!allFacilities.length) return [];
    return allFacilities.filter(facility => {
      const price = parseFloat(facility.price);
      return price >= minPrice && price <= maxPrice;
    });
  }, [allFacilities]);

  return {
    facilities: allFacilities,
    loading,
    error,
    getFacilitiesByVenue,
    getFacilitiesBySport,
    getFacilitiesByPriceRange,
  };
};

/**
 * Hook for getting all sports from admin data
 */
export const useSports = () => {
  const { data, loading, error } = useAdminData();
  
  const sports: Sport[] = data?.data?.summary?.unique_sports?.map((sportName, index) => ({ 
    id: `sport-${index}`, 
    name: sportName 
  })) || [];
  
  return {
    sports,
    loading,
    error,
  };
};
