import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { Typography, Colors, Layout, Responsive } from '@/constants';
import { FacilityCard } from './FacilityCard';
import { getSportIcon, sortFacilitiesByPrice, cleanVenueTitle } from '@/utils';

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


export const VenueCard: React.FC<VenueCardProps> = ({ 
  venue, 
  renderStars, 
  onFacilitySelect
}) => {
  // Sort facilities by price in descending order (higher price first)
  const sortedFacilities = venue.facilities ? sortFacilitiesByPrice(venue.facilities as any, false) : [];
  
  // Show all facilities since we now have scrolling
  const visibleFacilities = sortedFacilities;


  return (
    <View style={styles.venueCard}>
      {/* Venue Image - Fixed height */}
      {venue.image_url && (
        <View style={styles.venueImageContainer}>
          <Image 
            source={{ uri: venue.image_url }} 
            style={styles.venueImage}
            resizeMode="cover"
          />
          {/* Rating overlay at bottom of image */}
          <View style={styles.ratingOverlay}>
            {renderStars(venue.rating ? parseFloat(venue.rating) : 0)}
          </View>
        </View>
      )}
      
      {/* Venue Details - Scrollable content */}
      <ScrollView 
        style={styles.venueDetails} 
        contentContainerStyle={styles.venueDetailsContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.venueTitle}>{cleanVenueTitle(venue.title)}</Text>
        
        {/* Simple Separator */}
        <View style={styles.separator} />
        
        {/* Venue Info Container */}
        <View style={styles.venueInfoContainer}>
          {/* Available Sports */}
          {venue.sports && venue.sports.length > 0 && (
            <View style={styles.sportsContainer}>
              <View style={styles.sportsList}>
                {venue.sports.map((sport, index) => (
                  <View key={index} style={styles.sportChip}>
                    {getSportIcon(sport)}
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
                {visibleFacilities?.map((facility) => (
                  <FacilityCard
                    key={facility.id}
                    facility={facility}
                    onPress={() => onFacilitySelect?.(facility.id, venue.id)}
                  />
                ))}
              </View>
            </View>
          )}
          
        </View>
      </ScrollView>
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
    height: '40%',
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
    flex: 1,
    marginBottom: Layout.spacing.xxl,
  },
  venueDetailsContent: {
    padding: Layout.spacing.lg,
    paddingBottom: Layout.spacing.xxl,
    justifyContent: 'flex-start',
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
  separator: {
    width: '80%',
    height: 2,
    backgroundColor: Colors.primary,
    opacity: 1,
    marginTop: Layout.spacing.sm,
    marginBottom: Layout.spacing.xs,
  },
  // Sports container styles
  sportsContainer: {
    width: Responsive.screen.width,
    marginBottom: Responsive.spacing.xs,
    paddingHorizontal: Responsive.grid.containerPadding,
  },
  sportsTitle: {
    ...Typography.styles.venuesVenueTitle,
    color: Colors.primary,
    fontSize: Responsive.fontSize.sm,
    textAlign: 'center',
    marginBottom: Responsive.spacing.xs,
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
    paddingHorizontal: Responsive.spacing.sm,
    paddingVertical: Responsive.spacing.xs,
    marginLeft: Responsive.spacing.xs,
    marginRight: Responsive.spacing.xs,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
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
