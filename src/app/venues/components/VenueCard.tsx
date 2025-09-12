import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Linking, Alert, Platform } from 'react-native';
import { Globe, MapPin } from 'lucide-react-native';
import { Typography, Colors, Layout, Responsive } from '@/constants';
import { FacilityCard } from './FacilityCard';

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
    sports?: string[];
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
          {/* Available Sports */}
          {venue.sports && venue.sports.length > 0 && (
            <View style={styles.sportsContainer}>
              <Text style={styles.sportsTitle}>Available Sports</Text>
              <View style={styles.sportsList}>
                {venue.sports.map((sport, index) => (
                  <View key={index} style={styles.sportChip}>
                    <Text style={styles.sportText}>{sport}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Facility Selection Cards */}
          {venue.facilities && venue.facilities.length > 0 && (
            <View style={styles.facilitiesContainer}>
              <Text style={styles.facilitiesTitle}>Choose a facility to book</Text>
              <View style={styles.facilitiesList}>
                {venue.facilities.map((facility) => (
                  <FacilityCard
                    key={facility.id}
                    facility={facility}
                    onPress={() => onFacilitySelect?.(facility.id, venue.id)}
                  />
                ))}
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
    height: '50%',
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
    height: '50%',
    padding: Layout.spacing.lg,
    paddingBottom: 60, // Add bottom padding to avoid overlap with indicators
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
  // Sports container styles
  sportsContainer: {
    width: Responsive.screen.width,
    marginBottom: Responsive.spacing.sm,
    paddingHorizontal: Responsive.grid.containerPadding,
  },
  sportsTitle: {
    ...Typography.styles.venuesVenueTitle,
    color: Colors.primary,
    fontSize: Responsive.fontSize.sm,
    textAlign: 'center',
    marginBottom: Responsive.spacing.sm,
    opacity: 0.8,
  },
  sportsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: Responsive.spacing.xs,
  },
  sportChip: {
    backgroundColor: Colors.primary,
    borderRadius: Layout.borderRadius.md,
    paddingHorizontal: Responsive.spacing.md,
    paddingVertical: Responsive.spacing.xs,
    marginLeft: Responsive.spacing.xs,
    marginRight: Responsive.spacing.xs,
  },
  sportText: {
    ...Typography.styles.venuesVenueTitle,
    color: Colors.base,
    fontSize: Responsive.fontSize.sm,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  // Facility selection styles
  facilitiesContainer: {
    width: Responsive.screen.width,
    marginBottom: Responsive.spacing.md,
    paddingHorizontal: Responsive.grid.containerPadding,
  },
  facilitiesTitle: {
    ...Typography.styles.venuesVenueTitle,
    color: Colors.primary,
    fontSize: Responsive.fontSize.sm,
    textAlign: 'center',
    marginBottom: Responsive.spacing.sm,
    opacity: 0.8,
  },
  facilitiesList: {
    width: '100%',
  },
});

export default VenueCard;
