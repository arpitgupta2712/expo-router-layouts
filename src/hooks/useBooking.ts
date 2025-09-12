import { useState, useCallback } from 'react';
import { adminService } from '../services/AdminService';
import { 
  UseBookingReturn, 
  BookingRequest, 
  BookingResponse 
} from '../types/AdminTypes';

/**
 * Hook for managing booking functionality
 */
export const useBooking = (): UseBookingReturn => {
  const [booking, setBooking] = useState<BookingResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const bookFacility = useCallback(async (request: BookingRequest) => {
    try {
      setLoading(true);
      setError(null);
      
      // Validate booking request
      if (!request.facility_id || !request.venue_id || !request.date || !request.start_time || !request.end_time) {
        throw new Error('Missing required booking information');
      }

      if (!request.user_info.name || !request.user_info.email || !request.user_info.phone) {
        throw new Error('Missing required user information');
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(request.user_info.email)) {
        throw new Error('Invalid email format');
      }

      // Validate phone format
      const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
      if (!phoneRegex.test(request.user_info.phone) || request.user_info.phone.replace(/\D/g, "").length < 10) {
        throw new Error('Invalid phone number format');
      }

      // Validate date (should be in the future)
      const bookingDate = new Date(request.date);
      const now = new Date();
      if (bookingDate < now) {
        throw new Error('Booking date cannot be in the past');
      }

      // Validate time range
      const startTime = new Date(`${request.date}T${request.start_time}`);
      const endTime = new Date(`${request.date}T${request.end_time}`);
      if (endTime <= startTime) {
        throw new Error('End time must be after start time');
      }

      console.log('📅 Booking facility:', request);
      const result = await adminService.bookFacility(request);
      setBooking(result);
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to book facility';
      setError(errorMessage);
      console.error('❌ useBooking error:', errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const cancelBooking = useCallback(async (bookingId: string) => {
    try {
      setLoading(true);
      setError(null);
      
      if (!bookingId) {
        throw new Error('Booking ID is required');
      }

      console.log('❌ Cancelling booking:', bookingId);
      const result = await adminService.cancelBooking(bookingId);
      
      if (result.success) {
        setBooking(null);
      }
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to cancel booking';
      setError(errorMessage);
      console.error('❌ useBooking cancel error:', errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearBooking = useCallback(() => {
    setBooking(null);
    setError(null);
  }, []);

  return {
    booking,
    loading,
    error,
    bookFacility,
    cancelBooking,
    clearBooking,
  };
};

/**
 * Hook for managing booking form state
 */
export const useBookingForm = () => {
  const [formData, setFormData] = useState<Partial<BookingRequest>>({
    user_info: {
      name: '',
      email: '',
      phone: '',
    },
  });

  const updateFormData = useCallback((updates: Partial<BookingRequest>) => {
    setFormData(prev => ({
      ...prev,
      ...updates,
      user_info: {
        ...prev.user_info,
        ...updates.user_info,
      },
    }));
  }, []);

  const resetForm = useCallback(() => {
    setFormData({
      user_info: {
        name: '',
        email: '',
        phone: '',
      },
    });
  }, []);

  const validateForm = useCallback((): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (!formData.facility_id) {
      errors.push('Please select a facility');
    }

    if (!formData.venue_id) {
      errors.push('Please select a venue');
    }

    if (!formData.date) {
      errors.push('Please select a date');
    }

    if (!formData.start_time) {
      errors.push('Please select start time');
    }

    if (!formData.end_time) {
      errors.push('Please select end time');
    }

    if (!formData.user_info?.name?.trim()) {
      errors.push('Name is required');
    }

    if (!formData.user_info?.email?.trim()) {
      errors.push('Email is required');
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.user_info.email)) {
        errors.push('Invalid email format');
      }
    }

    if (!formData.user_info?.phone?.trim()) {
      errors.push('Phone number is required');
    } else {
      const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
      if (!phoneRegex.test(formData.user_info.phone) || formData.user_info.phone.replace(/\D/g, "").length < 10) {
        errors.push('Invalid phone number format');
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }, [formData]);

  return {
    formData,
    updateFormData,
    resetForm,
    validateForm,
  };
};

/**
 * Hook for managing booking history (placeholder for future implementation)
 */
export const useBookingHistory = () => {
  const [bookings, setBookings] = useState<BookingResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBookingHistory = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // This would be implemented when the booking history API is available
      console.log('📋 Fetching booking history...');
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data for now
      setBookings([]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch booking history';
      setError(errorMessage);
      console.error('❌ useBookingHistory error:', errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const getBookingById = useCallback((bookingId: string) => {
    return bookings.find(booking => booking.data.booking_id === bookingId);
  }, [bookings]);

  const getBookingsByStatus = useCallback((status: 'confirmed' | 'pending' | 'cancelled') => {
    return bookings.filter(booking => booking.data.status === status);
  }, [bookings]);

  return {
    bookings,
    loading,
    error,
    fetchBookingHistory,
    getBookingById,
    getBookingsByStatus,
  };
};
