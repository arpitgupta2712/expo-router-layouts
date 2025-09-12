import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Linking, Alert, Platform } from 'react-native';
import { Globe, MapPin, Calendar } from 'lucide-react-native';
import { Typography, Colors, Layout } from '@/constants';
import { router } from 'expo-router';

interface VenueCardProps {
  venue: {
    id: string;
    title: string;
    image_url?: string;
    rating?: string;
    web_url?: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
    facilities?: {
      id: string;
      name: string;
      price: string;
      sports: { id: string; name: string }[];
    }[];
  };
  renderStars: (rating: number) => React.ReactNode[];
  onFacilitySelect?: (facilityId: string, venueId: string) => void;
}

// Helper function to safely open URLs
const openURL = async (url: string, fallbackMessage?: string) => {
  try {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert(
        'Cannot Open Link',
        fallbackMessage || `Unable to open the link: ${url}`,
        [{ text: 'OK' }]
      );
    }
  } catch (error) {
    console.error('Error opening URL:', error);
    Alert.alert(
      'Error',
      fallbackMessage || 'Unable to open the link. Please try again.',
      [{ text: 'OK' }]
    );
  }
};

export const VenueCard: React.FC<VenueCardProps> = ({ venue, renderStars, onFacilitySelect }) => {
  return (
    <View style={styles.venueCard}>
      {/* Venue Image - 60% of top space */}
      {venue.image_url && (
        <View style={styles.venueImageContainer}>
          <Image 
            source={{ uri: venue.image_url }} 
            style={styles.venueImage}
            resizeMode="cover"
          />
          {/* Rating overlay at bottom of image */}
          {venue.rating && (
            <View style={styles.ratingOverlay}>
              {renderStars(parseFloat(venue.rating))}
            </View>
          )}
        </View>
      )}
      
      {/* Venue Details - 40% of space */}
      <View style={styles.venueDetails}>
        <Text style={styles.venueTitle}>{venue.title}</Text>
        
        {/* Venue Info Container */}
        <View style={styles.venueInfoContainer}>
          {/* Facility Selection Buttons */}
          {venue.facilities && venue.facilities.length > 0 && (
            <View style={styles.facilitiesContainer}>
              <Text style={styles.facilitiesTitle}>Choose a facility to book</Text>
              <View style={styles.facilitiesGrid}>
                {venue.facilities.slice(0, 6).map((facility) => (
                  <TouchableOpacity
                    key={facility.id}
                    style={styles.facilityButton}
                    onPress={() => onFacilitySelect?.(facility.id, venue.id)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.facilityName} numberOfLines={1}>
                      {facility.name}
                    </Text>
                    <Text style={styles.facilityPrice}>
                      ₹{facility.price}
                    </Text>
                    {facility.sports && facility.sports.length > 0 && (
                      <Text style={styles.facilitySport} numberOfLines={1}>
                        {facility.sports[0].name}
                      </Text>
                    )}
                  </TouchableOpacity>
                ))}
                {venue.facilities.length > 6 && (
                  <TouchableOpacity
                    style={styles.moreFacilitiesButton}
                    onPress={() => {
                      Alert.alert(
                        'More Facilities',
                        `${venue.facilities!.length - 6} more facilities available. This will be implemented in the booking flow.`,
                        [{ text: 'OK' }]
                      );
                    }}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.moreFacilitiesText}>
                      +{venue.facilities.length - 6} more
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}
          
          {/* Action Buttons */}
          <View style={styles.actionButtonsContainer}>
            {/* Web URL Button */}
            {venue.web_url && (
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => openURL(
                  venue.web_url!, 
                  'Unable to open the venue website. Please check your internet connection.'
                )}
                activeOpacity={0.7}
              >
                <Globe size={20} color={Colors.primary} />
              </TouchableOpacity>
            )}
            
            {/* Google Maps Button */}
            {venue.coordinates && (
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => {
                  const { latitude, longitude } = venue.coordinates!;
                  // Try different map URL formats for better compatibility
                  const googleMapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
                  const appleMapsUrl = `http://maps.apple.com/?q=${latitude},${longitude}`;
                  
                  // Use platform-specific URL or fallback to Google Maps
                  const mapUrl = Platform.OS === 'ios' ? appleMapsUrl : googleMapsUrl;
                  
                  openURL(
                    mapUrl,
                    'Unable to open maps. Please try opening the location manually.'
                  );
                }}
                activeOpacity={0.7}
              >
                <MapPin size={20} color={Colors.primary} />
              </TouchableOpacity>
            )}
            
            {/* Booking Button */}
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => {
                // Navigate to booking page or dashboard
                try {
                  router.push('/dashboard');
                } catch (error) {
                  console.error('Navigation error:', error);
                  Alert.alert(
                    'Navigation Error',
                    'Unable to navigate. Please try again.',
                    [{ text: 'OK' }]
                  );
                }
              }}
              activeOpacity={0.7}
            >
              <Calendar size={20} color={Colors.primary} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  // Venue Card Styles
  venueCard: {
    flex: 1,
    width: '100%',
  },
  venueImageContainer: {
    height: '60%',
    position: 'relative',
  },
  venueImage: {
    width: '100%',
    height: '100%',
  },
  ratingOverlay: {
    position: 'absolute',
    bottom: Layout.spacing.xs,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Layout.spacing.sm,
    paddingHorizontal: Layout.spacing.md,
    borderRadius: Layout.borderRadius.md,
    marginHorizontal: Layout.spacing.md,
  },
  venueDetails: {
    height: '40%',
    padding: Layout.spacing.lg,
    paddingBottom: 120, // Add bottom padding to avoid overlap with indicators
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  venueInfoContainer: {
    alignItems: 'center',
    gap: Layout.spacing.sm,
    marginTop: Layout.spacing.md,
  },
  venueTitle: {
    ...Typography.styles.venuesVenueTitle,
    color: Colors.primary,
    textAlign: 'center',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Layout.spacing.lg,
  },
  actionButton: {
    width: 50,
    height: 50,
    borderRadius: 10,
    backgroundColor: Colors.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  // Facility selection styles
  facilitiesContainer: {
    width: '100%',
    marginBottom: Layout.spacing.md,
  },
  facilitiesTitle: {
    ...Typography.styles.venuesVenueTitle,
    color: Colors.primary,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: Layout.spacing.sm,
    opacity: 0.8,
  },
  facilitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: Layout.spacing.sm,
  },
  facilityButton: {
    width: '30%',
    minWidth: 80,
    backgroundColor: Colors.base,
    borderRadius: Layout.borderRadius.md,
    padding: Layout.spacing.sm,
    borderWidth: 1,
    borderColor: Colors.primary,
    alignItems: 'center',
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  facilityName: {
    ...Typography.styles.venuesVenueTitle,
    color: Colors.primary,
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 2,
  },
  facilityPrice: {
    ...Typography.styles.venuesVenueTitle,
    color: Colors.primary,
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 2,
  },
  facilitySport: {
    ...Typography.styles.venuesVenueTitle,
    color: Colors.primary,
    fontSize: 8,
    opacity: 0.7,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  moreFacilitiesButton: {
    width: '30%',
    minWidth: 80,
    backgroundColor: Colors.gray[100],
    borderRadius: Layout.borderRadius.md,
    padding: Layout.spacing.sm,
    borderWidth: 1,
    borderColor: Colors.gray[300],
    alignItems: 'center',
    justifyContent: 'center',
  },
  moreFacilitiesText: {
    ...Typography.styles.venuesVenueTitle,
    color: Colors.primary,
    fontSize: 10,
    fontWeight: '500',
    textAlign: 'center',
    opacity: 0.7,
  },
});

export default VenueCard;
