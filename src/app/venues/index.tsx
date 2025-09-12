import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Typography, Colors, Layout } from "@/constants";
import { useCitiesAndVenues } from "@/hooks";
import { VenueCard, VenueIndicators, VenueHeader, VenueFooter } from "./components";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

// Color palette for cities and venues
const cityColors = [
  Colors.primary,        // Forest Green
  Colors.accent,         // Chartreuse
  Colors.primaryLight,   // Ocean Green
  Colors.info,           // Illuminating Emerald
  Colors.error,          // Safety Orange
  Colors.warning,        // Royal Orange
  Colors.accentLight,    // Key Lime
  Colors.primaryDark,    // Dark Green
];

const venueColors = [
  Colors.primaryLight,   // Ocean Green
  Colors.info,           // Illuminating Emerald
  Colors.primaryDark,    // Dark Green
  Colors.veryLightTangelo, // Very Light Tangelo
  Colors.accentLight,    // Key Lime
  Colors.accentDark,     // Light Goldenrod Yellow
  Colors.warning,        // Royal Orange
  Colors.error,          // Safety Orange
];

export default function VenuesScreen() {
  // Get city parameter from route
  const { city: cityParam } = useLocalSearchParams();
  const targetCityId = cityParam as string;

  const [venueIndex, setVenueIndex] = useState(0);

  // Fetch data from API - single hook call for efficiency
  const { cities, venues, loading, error, getVenuesByCity } = useCitiesAndVenues();

  // Get target city and its venues
  const targetCity = cities.find(city => city.id.toString() === targetCityId) || cities[0];
  const cityVenues = targetCity ? getVenuesByCity(targetCity.id) : [];

  // Transform venue data
  const transformedVenues = cityVenues.map((venue, index) => ({
    id: venue.id,
    title: venue.name || 'Unnamed Venue',
    color: venueColors[index % venueColors.length],
    address: venue.address || 'Address not available',
    sports: venue.sports || [],
    facilities_count: venue.facilities_count || 0,
    facilities: venue.facilities || [], // Include facilities data
    image_url: venue.image_url,
    rating: venue.rating,
    rating_count: venue.rating_count,
    closest_metro: venue.closest_metro,
    offer_text: venue.offer_text,
    web_url: venue.web_url,
    coordinates: venue.coordinates,
  }));

  const currentVenue = transformedVenues[venueIndex];
  
  

  // Handle facility selection - memoized to prevent callback reference changes
  const handleFacilitySelect = useCallback((facilityId: string, venueId: string) => {
    // For now, show an alert with facility details
    const venue = cityVenues.find(v => v.id === venueId);
    const facility = venue?.facilities?.find(f => f.id === facilityId);
    
    if (facility) {
      Alert.alert(
        'Facility Selected',
        `${facility.name}\nPrice: ₹${facility.price}\nSports: ${facility.sports?.map(s => s.name).join(', ') || 'N/A'}\n\nThis will navigate to the booking flow for this facility.`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Book Now', onPress: () => {
            // TODO: Navigate to booking flow
            Alert.alert('Coming Soon', 'Booking flow will be implemented soon!');
          }}
        ]
      );
    }
  }, [cityVenues]);


  // Render star rating in brand colors
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    // Always render exactly 5 stars
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        // Full star
        stars.push(
          <Text key={i} style={styles.star}>★</Text>
        );
      } else if (i === fullStars && hasHalfStar) {
        // Half star
        stars.push(
          <Text key={i} style={styles.star}>☆</Text>
        );
      } else {
        // Empty star
        stars.push(
          <Text key={i} style={styles.emptyStar}>☆</Text>
        );
      }
    }
    
    return stars;
  };

  // Simplified venue navigation functions
  const goToNextVenue = () => {
    if (!transformedVenues.length || transformedVenues.length <= 1) return;
    const nextVenueIdx = (venueIndex + 1) % transformedVenues.length;
    setVenueIndex(nextVenueIdx);
  };

  const goToPreviousVenue = () => {
    if (!transformedVenues.length || transformedVenues.length <= 1) return;
    const prevVenueIdx = (venueIndex - 1 + transformedVenues.length) % transformedVenues.length;
    setVenueIndex(prevVenueIdx);
  };



  // Show error state
  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Failed to load venues</Text>
          <Text style={styles.errorSubtext}>{error}</Text>
          <TouchableOpacity 
            style={styles.retryButton} 
            onPress={() => window.location.reload()}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Show loading state
  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading venues...</Text>
        </View>
      </View>
    );
  }

  // Show empty state
  if (!transformedVenues.length) {
    return (
      <View style={styles.container}>


        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No venues available</Text>
          <Text style={styles.emptySubtext}>
            {targetCity ? `No venues found in ${targetCity.name}` : 'Check back later for new venues'}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Venue Header with City Information */}
      {targetCity && (
        <VenueHeader
          cityName={targetCity.name}
        />
      )}


      <View style={styles.cardContainer}>
        {/* Simple Card */}
        <View style={styles.fullScreenCard}>
          {currentVenue && (
            <VenueCard 
              venue={currentVenue} 
              renderStars={renderStars}
              onFacilitySelect={handleFacilitySelect}
            />
          )}
        </View>
      </View>

      {/* Venue Footer with Action and Navigation Buttons */}
      {currentVenue && (
        <VenueFooter
          venue={currentVenue}
          venuesCount={transformedVenues.length}
          currentIndex={venueIndex}
          onPrevious={goToPreviousVenue}
          onNext={goToNextVenue}
        />
      )}


      {/* Venue indicators - middle right */}
      <VenueIndicators 
        venuesCount={transformedVenues.length}
        currentIndex={venueIndex}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cardContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  fullScreenCard: {
    position: "absolute",
    width: screenWidth,
    height: screenHeight, // Full screen height
    justifyContent: "center",
    alignItems: "center",
  },
  cityTitle: {
    ...Typography.styles.venuesCityTitle,
    color: Colors.base,
    marginBottom: 16,
    textAlign: "center",
  },
  cityDescription: {
    ...Typography.styles.venuesCityDescription,
    color: Colors.base,
    textAlign: "center",
    marginBottom: 60,
    opacity: 0.9,
  },
  star: {
    fontSize: Typography.styles.bodyMedium.fontSize,
    color: Colors.accent,
    marginHorizontal: 1,
  },
  emptyStar: {
    fontSize: Typography.styles.bodyMedium.fontSize,
    color: Colors.accentLight,
    marginHorizontal: 1,
  },
  // Loading state styles
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.background,
  },
  loadingText: {
    ...Typography.styles.venuesCityDescription,
    color: Colors.text.secondary,
    marginTop: Layout.spacing.md,
  },
  // Error state styles
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.background,
    paddingHorizontal: Layout.spacing.xl,
  },
  errorText: {
    ...Typography.styles.venuesCityTitle,
    color: Colors.error,
    textAlign: "center",
    marginBottom: Layout.spacing.sm,
  },
  errorSubtext: {
    ...Typography.styles.venuesCityDescription,
    color: Colors.text.secondary,
    textAlign: "center",
    marginBottom: Layout.spacing.lg,
  },
  retryButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.md,
    borderRadius: Layout.borderRadius.lg,
  },
  retryButtonText: {
    ...Typography.styles.venuesCityDescription,
    color: Colors.base,
    fontWeight: "600",
  },
  // Empty state styles
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.background,
    paddingHorizontal: Layout.spacing.xl,
  },
  emptyText: {
    ...Typography.styles.venuesCityTitle,
    color: Colors.text.primary,
    textAlign: "center",
    marginBottom: Layout.spacing.sm,
  },
  emptySubtext: {
    ...Typography.styles.venuesCityDescription,
    color: Colors.text.secondary,
    textAlign: "center",
  },
});
