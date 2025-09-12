import { 
  MultiAdminResponse, 
  Admin, 
  ApiError, 
  BookingRequest, 
  BookingResponse 
} from '../types/AdminTypes';

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
        console.log('📦 Returning cached admin data');
        return cached.data;
      }
    }

    try {
      console.log('🌐 Fetching admin data from API...');
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
      console.log('✅ Admin data fetched and cached successfully');
      
      return data;
    } catch (error) {
      console.error('❌ Error fetching multiple admins:', error);
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
      console.error('❌ Error fetching admin by phone:', error);
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
      console.error('❌ Error searching admins:', error);
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
      console.log('📅 Booking facility:', bookingRequest);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return {
        success: true,
        data: {
          booking_id: `booking_${Date.now()}`,
          status: 'confirmed',
          facility: {} as any, // Would be populated from API
          venue: {} as any, // Would be populated from API
          total_amount: bookingRequest.payment_info?.amount || 0,
          booking_date: new Date().toISOString(),
        },
        message: 'Booking confirmed successfully',
      };
    } catch (error) {
      console.error('❌ Error booking facility:', error);
      throw error;
    }
  }

  /**
   * Cancel a booking (placeholder for future booking API)
   */
  async cancelBooking(bookingId: string): Promise<{ success: boolean; message: string }> {
    try {
      // This is a placeholder implementation
      console.log('❌ Cancelling booking:', bookingId);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return {
        success: true,
        message: 'Booking cancelled successfully',
      };
    } catch (error) {
      console.error('❌ Error cancelling booking:', error);
      throw error;
    }
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache.clear();
    console.log('🗑️ Admin service cache cleared');
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
