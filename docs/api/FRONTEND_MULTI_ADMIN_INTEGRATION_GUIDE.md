# Frontend Multi-Admin Integration Guide

## Overview
This guide provides comprehensive integration instructions for the multi-admin support endpoint in an Expo/React Native TypeScript application. It focuses on using the `/api/hudle/admins/multiple` endpoint to populate city and venue cards for two specific admins: `9910545678` and `9999099867`.

## Target Users
- **Admin 1**: `9910545678` - Primary admin for testing
- **Admin 2**: `9999099867` - Secondary admin for testing

## API Endpoint
```
GET /api/hudle/admins/multiple?admin_ids=9910545678,9999099867
```

**Base URL:** `https://claygrounds-6d703322b3bc.herokuapp.com`

## TypeScript Interfaces

### Core Data Types
```typescript
// City interface with ID for efficient queries
interface City {
  id: string;
  name: string;
}

// Sport interface
interface Sport {
  id: string;
  name: string;
}

// Facility interface
interface Facility {
  id: string;
  name: string;
  price: number;
  slot_length: number;
  start_time: string;
  end_time: string;
  sports: Sport[];
  has_split_payment: boolean;
  split_payment_config?: any;
}

// Venue interface with nested facilities
interface Venue {
  id: string;
  name: string;
  city_id: number;
  city_name: string;
  region: string;
  address?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  image_url?: string;
  rating?: number;
  rating_count?: number;
  closest_metro?: string;
  web_url?: string;
  offer_text?: string;
  facilities_count: number;
  sports: string[];
  facilities: Facility[];
}

// Company interface
interface Company {
  name: string;
  address: string;
  gstin: string;
  pan: string;
}

// Admin interface
interface Admin {
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
  venues: Venue[];
}

// Multi-admin response interface
interface MultiAdminResponse {
  success: boolean;
  data: {
    admins: Admin[];
    summary: {
      total_admins: number;
      total_venues: number;
      total_facilities: number;
      unique_cities: City[];
      unique_regions: string[];
      unique_sports: string[];
    };
  };
  message: string;
}
```

## API Service Implementation

### API Service Class
```typescript
// services/AdminService.ts
import { MultiAdminResponse, Admin } from '../types/AdminTypes';

class AdminService {
  private baseUrl = 'https://claygrounds-6d703322b3bc.herokuapp.com/api/hudle/admins';

  async getMultipleAdmins(adminIds: string[]): Promise<MultiAdminResponse> {
    try {
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
      return data;
    } catch (error) {
      console.error('Error fetching multiple admins:', error);
      throw error;
    }
  }

  // Helper method to get specific admin by phone
  async getAdminByPhone(phone: string): Promise<Admin | null> {
    const result = await this.getMultipleAdmins([phone]);
    return result.data.admins[0] || null;
  }
}

export const adminService = new AdminService();
```

## React Native Components

### 1. City Card Component
```typescript
// components/CityCard.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, Title, Paragraph } from 'react-native-paper';
import { City } from '../types/AdminTypes';

interface CityCardProps {
  city: City;
  venueCount: number;
  onPress: (cityId: string) => void;
}

export const CityCard: React.FC<CityCardProps> = ({ city, venueCount, onPress }) => {
  return (
    <TouchableOpacity onPress={() => onPress(city.id)}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.cityName}>{city.name}</Title>
          <Paragraph style={styles.venueCount}>
            {venueCount} venue{venueCount !== 1 ? 's' : ''}
          </Paragraph>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 8,
    elevation: 4,
  },
  cityName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  venueCount: {
    fontSize: 14,
    color: '#666',
  },
});
```

### 2. Venue Card Component
```typescript
// components/VenueCard.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Card, Title, Paragraph, Chip } from 'react-native-paper';
import { Venue } from '../types/AdminTypes';

interface VenueCardProps {
  venue: Venue;
  onPress: (venueId: string) => void;
}

export const VenueCard: React.FC<VenueCardProps> = ({ venue, onPress }) => {
  return (
    <TouchableOpacity onPress={() => onPress(venue.id)}>
      <Card style={styles.card}>
        {venue.image_url && (
          <Card.Cover source={{ uri: venue.image_url }} style={styles.image} />
        )}
        <Card.Content>
          <Title style={styles.venueName}>{venue.name}</Title>
          <Paragraph style={styles.address}>{venue.address}</Paragraph>
          <Paragraph style={styles.region}>{venue.region}</Paragraph>
          
          {venue.rating && (
            <View style={styles.ratingContainer}>
              <Text style={styles.rating}>⭐ {venue.rating}</Text>
              <Text style={styles.ratingCount}>({venue.rating_count} reviews)</Text>
            </View>
          )}

          <View style={styles.sportsContainer}>
            {venue.sports.slice(0, 3).map((sport, index) => (
              <Chip key={index} style={styles.sportChip} textStyle={styles.sportText}>
                {sport}
              </Chip>
            ))}
            {venue.sports.length > 3 && (
              <Chip style={styles.moreChip} textStyle={styles.sportText}>
                +{venue.sports.length - 3} more
              </Chip>
            )}
          </View>

          <Paragraph style={styles.facilitiesCount}>
            {venue.facilities_count} facilit{venue.facilities_count !== 1 ? 'ies' : 'y'}
          </Paragraph>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 8,
    elevation: 4,
  },
  image: {
    height: 200,
  },
  venueName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 8,
  },
  address: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  region: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  rating: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFA500',
  },
  ratingCount: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  sportsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  sportChip: {
    margin: 2,
    backgroundColor: '#E3F2FD',
  },
  moreChip: {
    margin: 2,
    backgroundColor: '#F5F5F5',
  },
  sportText: {
    fontSize: 12,
  },
  facilitiesCount: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },
});
```

### 3. Facility Card Component
```typescript
// components/FacilityCard.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, Title, Paragraph, Chip } from 'react-native-paper';
import { Facility } from '../types/AdminTypes';

interface FacilityCardProps {
  facility: Facility;
  onPress: (facilityId: string) => void;
}

export const FacilityCard: React.FC<FacilityCardProps> = ({ facility, onPress }) => {
  const formatTime = (time: string) => {
    return time.substring(0, 5); // Format as HH:MM
  };

  return (
    <TouchableOpacity onPress={() => onPress(facility.id)}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.facilityName}>{facility.name}</Title>
          
          <View style={styles.priceContainer}>
            <Text style={styles.price}>₹{facility.price}</Text>
            <Text style={styles.slotLength}>per {facility.slot_length} min</Text>
          </View>

          <View style={styles.timeContainer}>
            <Text style={styles.timeLabel}>Available:</Text>
            <Text style={styles.time}>
              {formatTime(facility.start_time)} - {formatTime(facility.end_time)}
            </Text>
          </View>

          <View style={styles.sportsContainer}>
            {facility.sports.map((sport, index) => (
              <Chip key={index} style={styles.sportChip} textStyle={styles.sportText}>
                {sport.name}
              </Chip>
            ))}
          </View>

          {facility.has_split_payment && (
            <Chip style={styles.splitPaymentChip} textStyle={styles.splitPaymentText}>
              Split Payment Available
            </Chip>
          )}
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 8,
    elevation: 2,
  },
  facilityName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  slotLength: {
    fontSize: 12,
    color: '#666',
    marginLeft: 8,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  timeLabel: {
    fontSize: 14,
    color: '#666',
  },
  time: {
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  sportsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  sportChip: {
    margin: 2,
    backgroundColor: '#E8F5E8',
  },
  sportText: {
    fontSize: 12,
  },
  splitPaymentChip: {
    marginTop: 8,
    backgroundColor: '#FFF3E0',
  },
  splitPaymentText: {
    fontSize: 12,
    color: '#F57C00',
  },
});
```

## Main Screen Implementation

### Multi-Admin Dashboard Screen
```typescript
// screens/MultiAdminDashboard.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Appbar, FAB, Portal, Modal, Card, Title, Paragraph } from 'react-native-paper';
import { adminService } from '../services/AdminService';
import { CityCard } from '../components/CityCard';
import { VenueCard } from '../components/VenueCard';
import { FacilityCard } from '../components/FacilityCard';
import { MultiAdminResponse, City, Venue, Facility } from '../types/AdminTypes';

export const MultiAdminDashboard: React.FC = () => {
  const [data, setData] = useState<MultiAdminResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Target admin IDs
  const adminIds = ['9910545678', '9999099867'];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const result = await adminService.getMultipleAdmins(adminIds);
      setData(result);
    } catch (error) {
      console.error('Error loading admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleCityPress = (cityId: string) => {
    const city = data?.data.summary.unique_cities.find(c => c.id === cityId);
    if (city) {
      setSelectedCity(city);
      setModalVisible(true);
    }
  };

  const handleVenuePress = (venueId: string) => {
    const venue = data?.data.admins
      .flatMap(admin => admin.venues)
      .find(v => v.id === venueId);
    if (venue) {
      setSelectedVenue(venue);
    }
  };

  const handleFacilityPress = (facilityId: string) => {
    // Handle facility booking or details
    console.log('Facility selected:', facilityId);
  };

  const getVenuesForCity = (cityId: string) => {
    return data?.data.admins
      .flatMap(admin => admin.venues)
      .filter(venue => venue.city_id.toString() === cityId) || [];
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading admin data...</Text>
      </View>
    );
  }

  if (!data) {
    return (
      <View style={styles.errorContainer}>
        <Text>Error loading data</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="Multi-Admin Dashboard" />
        <Appbar.Action icon="refresh" onPress={onRefresh} />
      </Appbar.Header>

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Summary Cards */}
        <View style={styles.summaryContainer}>
          <Card style={styles.summaryCard}>
            <Card.Content>
              <Title>Total Admins</Title>
              <Paragraph style={styles.summaryNumber}>
                {data.data.summary.total_admins}
              </Paragraph>
            </Card.Content>
          </Card>

          <Card style={styles.summaryCard}>
            <Card.Content>
              <Title>Total Venues</Title>
              <Paragraph style={styles.summaryNumber}>
                {data.data.summary.total_venues}
              </Paragraph>
            </Card.Content>
          </Card>

          <Card style={styles.summaryCard}>
            <Card.Content>
              <Title>Total Facilities</Title>
              <Paragraph style={styles.summaryNumber}>
                {data.data.summary.total_facilities}
              </Paragraph>
            </Card.Content>
          </Card>
        </View>

        {/* Cities Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cities ({data.data.summary.unique_cities.length})</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {data.data.summary.unique_cities.map((city) => {
              const venueCount = getVenuesForCity(city.id).length;
              return (
                <CityCard
                  key={city.id}
                  city={city}
                  venueCount={venueCount}
                  onPress={handleCityPress}
                />
              );
            })}
          </ScrollView>
        </View>

        {/* Sports Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sports Available</Text>
          <View style={styles.sportsContainer}>
            {data.data.summary.unique_sports.map((sport, index) => (
              <Card key={index} style={styles.sportCard}>
                <Card.Content>
                  <Text style={styles.sportText}>{sport}</Text>
                </Card.Content>
              </Card>
            ))}
          </View>
        </View>

        {/* All Venues Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>All Venues</Text>
          {data.data.admins.map((admin) => (
            <View key={admin.id} style={styles.adminSection}>
              <Text style={styles.adminName}>{admin.name}</Text>
              {admin.venues.map((venue) => (
                <VenueCard
                  key={venue.id}
                  venue={venue}
                  onPress={handleVenuePress}
                />
              ))}
            </View>
          ))}
        </View>
      </ScrollView>

      {/* City Modal */}
      <Portal>
        <Modal
          visible={modalVisible}
          onDismiss={() => setModalVisible(false)}
          contentContainerStyle={styles.modalContainer}
        >
          {selectedCity && (
            <View>
              <Title>{selectedCity.name} Venues</Title>
              {getVenuesForCity(selectedCity.id).map((venue) => (
                <VenueCard
                  key={venue.id}
                  venue={venue}
                  onPress={handleVenuePress}
                />
              ))}
            </View>
          )}
        </Modal>
      </Portal>

      {/* Venue Details Modal */}
      <Portal>
        <Modal
          visible={!!selectedVenue}
          onDismiss={() => setSelectedVenue(null)}
          contentContainerStyle={styles.modalContainer}
        >
          {selectedVenue && (
            <View>
              <Title>{selectedVenue.name} Facilities</Title>
              <ScrollView>
                {selectedVenue.facilities.map((facility) => (
                  <FacilityCard
                    key={facility.id}
                    facility={facility}
                    onPress={handleFacilityPress}
                  />
                ))}
              </ScrollView>
            </View>
          )}
        </Modal>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  summaryContainer: {
    flexDirection: 'row',
    padding: 16,
    justifyContent: 'space-around',
  },
  summaryCard: {
    flex: 1,
    margin: 4,
  },
  summaryNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  section: {
    margin: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  sportsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  sportCard: {
    margin: 4,
    backgroundColor: '#E8F5E8',
  },
  sportText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  adminSection: {
    marginBottom: 16,
  },
  adminName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#1976D2',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 8,
    maxHeight: '80%',
  },
});
```

## Usage Examples

### 1. Basic Data Fetching
```typescript
// Example usage in any component
import { adminService } from '../services/AdminService';

const MyComponent = () => {
  const [admins, setAdmins] = useState(null);

  useEffect(() => {
    const loadAdmins = async () => {
      try {
        const result = await adminService.getMultipleAdmins(['9910545678', '9999099867']);
        setAdmins(result.data.admins);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    loadAdmins();
  }, []);

  // Use admins data...
};
```

### 2. City-Based Venue Filtering
```typescript
// Filter venues by city ID
const getVenuesByCity = (cityId: string) => {
  return admins
    .flatMap(admin => admin.venues)
    .filter(venue => venue.city_id.toString() === cityId);
};

// Usage
const delhiVenues = getVenuesByCity('1'); // Delhi venues
```

### 3. Sport-Based Filtering
```typescript
// Filter admins by sport
const getAdminsBySport = (sport: string) => {
  return admins.filter(admin => 
    admin.sports.some(s => s.toLowerCase().includes(sport.toLowerCase()))
  );
};

// Usage
const footballAdmins = getAdminsBySport('Football');
```

## Performance Considerations

### 1. Caching Strategy
```typescript
// Implement simple caching
class AdminService {
  private cache: Map<string, MultiAdminResponse> = new Map();
  private cacheExpiry: Map<string, number> = new Map();
  private CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  async getMultipleAdmins(adminIds: string[]): Promise<MultiAdminResponse> {
    const cacheKey = adminIds.sort().join(',');
    const now = Date.now();

    // Check cache
    if (this.cache.has(cacheKey) && this.cacheExpiry.get(cacheKey)! > now) {
      return this.cache.get(cacheKey)!;
    }

    // Fetch from API
    const data = await this.fetchFromAPI(adminIds);
    
    // Update cache
    this.cache.set(cacheKey, data);
    this.cacheExpiry.set(cacheKey, now + this.CACHE_DURATION);
    
    return data;
  }
}
```

### 2. Lazy Loading
```typescript
// Implement lazy loading for large datasets
const useLazyLoading = (items: any[], itemsPerPage: number = 10) => {
  const [visibleItems, setVisibleItems] = useState(items.slice(0, itemsPerPage));
  const [hasMore, setHasMore] = useState(items.length > itemsPerPage);

  const loadMore = () => {
    if (hasMore) {
      const nextItems = items.slice(0, visibleItems.length + itemsPerPage);
      setVisibleItems(nextItems);
      setHasMore(nextItems.length < items.length);
    }
  };

  return { visibleItems, hasMore, loadMore };
};
```

## Error Handling

### 1. Network Error Handling
```typescript
const handleApiError = (error: any) => {
  if (error.message.includes('Network request failed')) {
    // Handle network error
    Alert.alert('Network Error', 'Please check your internet connection');
  } else if (error.message.includes('HTTP error')) {
    // Handle HTTP error
    Alert.alert('Server Error', 'Please try again later');
  } else {
    // Handle other errors
    Alert.alert('Error', 'Something went wrong');
  }
};
```

### 2. Retry Logic
```typescript
const retryApiCall = async (apiCall: () => Promise<any>, maxRetries: number = 3) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await apiCall();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
};
```

## Testing

### 1. Unit Tests
```typescript
// Example test for AdminService
import { adminService } from '../services/AdminService';

describe('AdminService', () => {
  it('should fetch multiple admins successfully', async () => {
    const result = await adminService.getMultipleAdmins(['9910545678', '9999099867']);
    
    expect(result.success).toBe(true);
    expect(result.data.admins).toHaveLength(2);
    expect(result.data.summary.total_admins).toBe(2);
  });
});
```

### 2. Component Tests
```typescript
// Example test for CityCard component
import { render, fireEvent } from '@testing-library/react-native';
import { CityCard } from '../components/CityCard';

describe('CityCard', () => {
  it('should call onPress when pressed', () => {
    const mockOnPress = jest.fn();
    const city = { id: '1', name: 'Delhi' };
    
    const { getByText } = render(
      <CityCard city={city} venueCount={5} onPress={mockOnPress} />
    );
    
    fireEvent.press(getByText('Delhi'));
    expect(mockOnPress).toHaveBeenCalledWith('1');
  });
});
```

## Best Practices

1. **Use TypeScript interfaces** for type safety
2. **Implement proper error handling** for network requests
3. **Use React Native Paper** components for consistent UI
4. **Implement caching** to reduce API calls
5. **Use lazy loading** for large datasets
6. **Test components** thoroughly
7. **Handle loading states** properly
8. **Use proper navigation** patterns
9. **Implement pull-to-refresh** functionality
10. **Optimize images** and use proper image loading

## Conclusion

This guide provides a complete implementation for integrating the multi-admin support endpoint in your Expo/React Native TypeScript application. The components are designed to work seamlessly with the enhanced API structure, providing efficient city-based filtering and comprehensive venue/facility management.

The implementation focuses on the two specific admin users (`9910545678` and `9999099867`) and provides a solid foundation for building a robust multi-admin dashboard in your mobile application.
