// Core Data Types for Admin API Integration
// Based on the Frontend Multi-Admin Integration Guide

export interface City {
  id: string;
  name: string;
}

export interface Sport {
  id: string;
  name: string;
}

export interface Facility {
  id: string;
  name: string;
  price: string; // API returns as string
  slot_length: number;
  start_time: string;
  end_time: string;
  sports: Sport[];
  has_split_payment: boolean;
  split_payment_config?: any;
}

export interface Venue {
  id: string;
  name: string;
  city_id: number; // API returns as number
  city_name: string;
  region: string;
  address?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  image_url?: string;
  rating?: string; // API returns as string
  rating_count?: string; // API returns as string
  closest_metro?: string;
  web_url?: string;
  offer_text?: string;
  facilities_count: number;
  sports: string[];
  facilities: Facility[];
}

export interface Company {
  name: string;
  address: string;
  gstin: string;
  pan: string;
}

export interface Admin {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: Company;
  total_venues: number;
  total_facilities: number;
  sports: string[];
  cities: City[];
  regions: string[];
  // Note: venues are not nested under admin in the API response
}

export interface MultiAdminResponse {
  success: boolean;
  data: {
    success: boolean;
    admins: Admin[];
    venues: Venue[]; // Venues are at the top level, not nested under admins
    summary: {
      total_admins: number;
      total_venues: number;
      total_facilities: number;
      cities_covered: number;
      regions_covered: number;
      sports_offered: number;
      unique_cities: City[];
      unique_regions: string[];
      unique_sports: string[];
    };
  };
  message: string;
}

// API Error Types
export interface ApiError {
  success: false;
  message: string;
  error?: string;
  timestamp?: string;
}

// Booking Related Types
export interface BookingRequest {
  facility_id: string;
  venue_id: string;
  date: string;
  start_time: string;
  end_time: string;
  user_info: {
    name: string;
    email: string;
    phone: string;
  };
  payment_info?: {
    method: 'online' | 'offline';
    amount: number;
  };
}

export interface BookingResponse {
  success: boolean;
  data: {
    booking_id: string;
    status: 'confirmed' | 'pending' | 'cancelled';
    facility: Facility;
    venue: Venue;
    total_amount: number;
    booking_date: string;
  };
  message: string;
}

// Hook Return Types
export interface UseAdminDataReturn {
  data: MultiAdminResponse | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export interface UseBookingReturn {
  booking: BookingResponse | null;
  loading: boolean;
  error: string | null;
  bookFacility: (request: BookingRequest) => Promise<BookingResponse>;
  cancelBooking: (bookingId: string) => Promise<{ success: boolean; message: string }>;
  clearBooking: () => void;
}

export interface UseVenuesReturn {
  venues: Venue[];
  loading: boolean;
  error: string | null;
  getVenuesByCity: (cityId: string) => Venue[];
  getVenuesBySport: (sport: string) => Venue[];
  refetch: () => Promise<void>;
}

export interface UseFacilitiesReturn {
  facilities: Facility[];
  loading: boolean;
  error: string | null;
  getFacilitiesByVenue: (venueId: string) => Facility[];
  getFacilitiesBySport: (sport: string) => Facility[];
  refetch: () => Promise<void>;
}
