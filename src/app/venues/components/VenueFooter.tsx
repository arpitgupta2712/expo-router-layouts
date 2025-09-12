import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Alert, Platform } from 'react-native';
import { Globe, MapPin, ChevronLeft, ChevronRight } from 'lucide-react-native';
import { Colors, Layout } from '@/constants';

interface VenueFooterProps {
  venue: {
    id: string;
    title: string;
    web_url?: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  venuesCount: number;
  currentIndex: number;
  onPrevious: () => void;
  onNext: () => void;
}

export const VenueFooter: React.FC<VenueFooterProps> = ({
  venue,
  venuesCount,
  currentIndex,
  onPrevious,
  onNext,
}) => {
  const handleWebsitePress = async () => {
    if (venue.web_url) {
      try {
        let url = venue.web_url;
        // Ensure URL has proper protocol for real devices
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
          url = 'https://' + url;
        }
        await Linking.openURL(url);
      } catch (error) {
        Alert.alert(
          'Error',
          'Unable to open the venue website. Please check your internet connection.',
          [{ text: 'OK' }]
        );
      }
    }
  };

  const handleLocationPress = async () => {
    if (venue.coordinates) {
      try {
        const { latitude, longitude } = venue.coordinates;
        // Try different map URL formats for better compatibility
        const googleMapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
        const appleMapsUrl = `http://maps.apple.com/?q=${latitude},${longitude}`;
        
        // Use platform-specific URL or fallback to Google Maps
        const mapUrl = Platform.OS === 'ios' ? appleMapsUrl : googleMapsUrl;
        
        await Linking.openURL(mapUrl);
      } catch (error) {
        Alert.alert(
          'Error',
          'Unable to open maps. Please try opening the location manually.',
          [{ text: 'OK' }]
        );
      }
    }
  };

  return (
    <View style={styles.footer}>
      {/* Venue Action Buttons */}
      <View style={styles.actionButtonsContainer}>
        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={handleWebsitePress}
          activeOpacity={0.7}
        >
          <Globe size={20} color={Colors.primary} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={handleLocationPress}
          activeOpacity={0.7}
        >
          <MapPin size={20} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Venue Count Display */}
      {venuesCount > 1 && (
        <View style={styles.venueCountContainer}>
          <Text style={styles.venueCountText}>
            {currentIndex + 1} / {venuesCount}
          </Text>
        </View>
      )}

      {/* Navigation Buttons */}
      {venuesCount > 1 && (
        <View style={styles.navigationButtonsContainer}>
          <TouchableOpacity 
            style={styles.navButton} 
            onPress={onPrevious}
            activeOpacity={0.7}
          >
            <ChevronLeft size={20} color={Colors.primary} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.navButton} 
            onPress={onNext}
            activeOpacity={0.7}
          >
            <ChevronRight size={20} color={Colors.primary} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 30,
    zIndex: 20,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    gap: Layout.spacing.md,
  },
  actionButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
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
  venueCountContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Layout.spacing.sm,
  },
  venueCountText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.inverse,
    opacity: 0.8,
  },
  navigationButtonsContainer: {
    flexDirection: 'row',
    gap: Layout.spacing.md,
  },
  navButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: Colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default VenueFooter;
