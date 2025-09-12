import { 
  MultiAdminResponse, 
  Admin, 
  ApiError, 
  BookingRequest, 
  BookingResponse 
} from '../types/AdminTypes';
import { logApi, logCache, logBooking, LogLevel } from '../utils/logging';

class AdminService {
  private baseUrl = 'https://claygrounds-6d703322b3bc.herokuapp.com/api/hudle/admins';
  private cache: Map<string, { data: MultiAdminResponse; timestamp: number }> = new Map();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  /**
   * Get multiple admins data with caching
   */
  async getMultipleAdmins(adminIds: string[]): Promise<MultiAdminResponse> {
    const cacheKey = adminIds.sort().join(',');
    const now = Date.now();

    // Check cache first
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey)!;
      if (now - cached.timestamp < this.CACHE_DURATION) {
        logCache(LogLevel.INFO, 'Admin data cache hit', { adminIds });
        return cached.data;
      }
    }

    try {
      logApi(LogLevel.INFO, 'Fetching admin data', { adminIds });
      const response = await fetch(
        `${this.baseUrl}/multiple?admin_ids=${adminIds.join(',')}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: MultiAdminResponse = await response.json();
      
      // Update cache
      this.cache.set(cacheKey, { data, timestamp: now });
      logApi(LogLevel.INFO, 'Admin data fetched successfully', { 
        adminCount: data.data.admins.length,
        venueCount: data.data.venues.length 
      });
      
      return data;
    } catch (error) {
      logApi(LogLevel.ERROR, 'Failed to fetch admin data', { adminIds, error: error.message });
      throw error;
    }
  }

  /**
   * Get specific admin by phone number
   */
  async getAdminByPhone(phone: string): Promise<Admin | null> {
    try {
      const result = await this.getMultipleAdmins([phone]);
      return result.data.admins[0] || null;
    } catch (error) {
      logApi(LogLevel.ERROR, 'Failed to fetch admin by phone', { phone, error: error.message });
      return null;
    }
  }

  /**
   * Search admins by criteria
   */
  async searchAdmins(criteria: {
    phone?: string;
    email?: string;
    name?: string;
    venue_name?: string;
    city?: string;
    address?: string;
    sport?: string;
  }): Promise<MultiAdminResponse> {
    try {
      const params = new URLSearchParams();
      Object.entries(criteria).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });

      const response = await fetch(
        `${this.baseUrl}/search?${params.toString()}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: MultiAdminResponse = await response.json();
      return data;
    } catch (error) {
      logApi(LogLevel.ERROR, 'Failed to search admins', { criteria, error: error.message });
      throw error;
    }
  }

  /**
   * Book a facility (placeholder for future booking API)
   */
  async bookFacility(bookingRequest: BookingRequest): Promise<BookingResponse> {
    try {
      // This is a placeholder implementation
      // In the future, this would call the actual booking API
      logBooking(LogLevel.INFO, 'Booking facility', { 
        facilityId: bookingRequest.facility_id,
        venueId: bookingRequest.venue_id,
        date: bookingRequest.date 
      });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const bookingId = `booking_${Date.now()}`;
      logBooking(LogLevel.INFO, 'Booking confirmed', { bookingId });
      
      return {
        success: true,
        data: {
          booking_id: bookingId,
          status: 'confirmed',
          facility: {} as any, // Would be populated from API
          venue: {} as any, // Would be populated from API
          total_amount: bookingRequest.payment_info?.amount || 0,
          booking_date: new Date().toISOString(),
        },
        message: 'Booking confirmed successfully',
      };
    } catch (error) {
      logBooking(LogLevel.ERROR, 'Failed to book facility', { 
        bookingRequest, 
        error: error.message 
      });
      throw error;
    }
  }

  /**
   * Cancel a booking (placeholder for future booking API)
   */
  async cancelBooking(bookingId: string): Promise<{ success: boolean; message: string }> {
    try {
      // This is a placeholder implementation
      logBooking(LogLevel.INFO, 'Cancelling booking', { bookingId });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      logBooking(LogLevel.INFO, 'Booking cancelled', { bookingId });
      return {
        success: true,
        message: 'Booking cancelled successfully',
      };
    } catch (error) {
      logBooking(LogLevel.ERROR, 'Failed to cancel booking', { bookingId, error: error.message });
      throw error;
    }
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache.clear();
    logCache(LogLevel.INFO, 'Admin service cache cleared');
  }

  /**
   * Get cache status
   */
  getCacheStatus(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }
}

// Export singleton instance
export const adminService = new AdminService();
