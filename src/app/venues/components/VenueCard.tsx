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
  };
  renderStars: (rating: number) => React.ReactNode[];
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

export const VenueCard: React.FC<VenueCardProps> = ({ venue, renderStars }) => {
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
});

export default VenueCard;
