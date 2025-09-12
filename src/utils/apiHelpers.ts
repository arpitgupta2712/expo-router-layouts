import { Venue, Facility, Admin, City } from '../types/AdminTypes';

/**
 * Utility functions to work with the API data structure
 */

/**
 * Get venues grouped by city
 */
export const getVenuesByCity = (venues: Venue[]): Record<string, Venue[]> => {
  return venues.reduce((acc, venue) => {
    const cityId = venue.city_id.toString();
    if (!acc[cityId]) {
      acc[cityId] = [];
    }
    acc[cityId].push(venue);
    return acc;
  }, {} as Record<string, Venue[]>);
};

/**
 * Get venues grouped by admin (based on phone number matching)
 */
export const getVenuesByAdmin = (venues: Venue[], admins: Admin[]): Record<string, Venue[]> => {
  // This is a placeholder implementation since venues aren't directly linked to admins
  // You might need to implement this based on your business logic
  return {};
};

/**
 * Get venues by sport
 */
export const getVenuesBySport = (venues: Venue[], sport: string): Venue[] => {
  return venues.filter(venue => 
    venue.sports.some(s => s.toLowerCase().includes(sport.toLowerCase()))
  );
};

/**
 * Get facilities by venue
 */
export const getFacilitiesByVenue = (venues: Venue[], venueId: string): Facility[] => {
  const venue = venues.find(v => v.id === venueId);
  return venue?.facilities || [];
};

/**
 * Get facilities by sport
 */
export const getFacilitiesBySport = (venues: Venue[], sport: string): Facility[] => {
  return venues
    .flatMap(venue => venue.facilities)
    .filter(facility => 
      facility.sports.some(s => s.name.toLowerCase().includes(sport.toLowerCase()))
    );
};

/**
 * Get facilities by price range
 */
export const getFacilitiesByPriceRange = (venues: Venue[], minPrice: number, maxPrice: number): Facility[] => {
  return venues
    .flatMap(venue => venue.facilities)
    .filter(facility => {
      const price = parseFloat(facility.price);
      return price >= minPrice && price <= maxPrice;
    });
};

/**
 * Format price for display
 */
export const formatPrice = (price: string): string => {
  const numPrice = parseFloat(price);
  return `₹${numPrice.toLocaleString('en-IN')}`;
};

/**
 * Format rating for display
 */
export const formatRating = (rating: string | undefined): string => {
  if (!rating) return 'No rating';
  const numRating = parseFloat(rating);
  return numRating.toFixed(1);
};

/**
 * Get city name by ID
 */
export const getCityNameById = (cities: City[], cityId: number): string => {
  const city = cities.find(c => c.id === cityId);
  return city?.name || 'Unknown City';
};

/**
 * Get all unique sports from venues
 */
export const getAllSports = (venues: Venue[]): string[] => {
  const sports = new Set<string>();
  venues.forEach(venue => {
    venue.sports.forEach(sport => sports.add(sport));
  });
  return Array.from(sports).sort();
};

/**
 * Get all unique cities from venues
 */
export const getAllCities = (venues: Venue[]): City[] => {
  const cityMap = new Map<string, City>();
  venues.forEach(venue => {
    const cityId = venue.city_id.toString();
    if (!cityMap.has(cityId)) {
      cityMap.set(cityId, {
        id: parseInt(cityId),
        name: venue.city_name,
        latitude: 0,
        longitude: 0,
        photo: '',
        show_metro_station: false
      });
    }
  });
  return Array.from(cityMap.values()).sort((a, b) => a.name.localeCompare(b.name));
};

/**
 * Search venues by name, address, or sport
 */
export const searchVenues = (venues: Venue[], query: string): Venue[] => {
  const lowerQuery = query.toLowerCase();
  return venues.filter(venue => 
    venue.name.toLowerCase().includes(lowerQuery) ||
    venue.address?.toLowerCase().includes(lowerQuery) ||
    venue.sports.some(sport => sport.toLowerCase().includes(lowerQuery))
  );
};

/**
 * Get venue statistics
 */
export const getVenueStats = (venues: Venue[]) => {
  const totalVenues = venues.length;
  const totalFacilities = venues.reduce((sum, venue) => sum + venue.facilities_count, 0);
  const cities = getAllCities(venues);
  const sports = getAllSports(venues);
  
  return {
    totalVenues,
    totalFacilities,
    totalCities: cities.length,
    totalSports: sports.length,
    cities,
    sports,
  };
};
