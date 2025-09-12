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
import { 
  renderStars, 
  createNavigationHelpers,
  transformVenueData,
  logUserAction,
  getTodayIST,
  getISTTimestamp
} from "@/utils";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

// Color palette for cities and venues (imported from utils)

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

  // Transform venue data using extracted utility
  const transformedVenues = cityVenues.map(venue => 
    transformVenueData(venue)
  );

  const currentVenue = transformedVenues[venueIndex];

  // Log city selection when component mounts
  React.useEffect(() => {
    if (targetCity) {
      logUserAction('city_selected', {
        cityId: targetCity.id,
        cityName: targetCity.name,
        venueCount: cityVenues.length
      });
    }
  }, [targetCity, cityVenues.length]);

  // Log venue navigation
  React.useEffect(() => {
    if (currentVenue) {
      logUserAction('venue_viewed', {
        venueId: currentVenue.id,
        venueName: currentVenue.title,
        venueIndex,
        totalVenues: transformedVenues.length,
        cityId: targetCity?.id,
        cityName: targetCity?.name
      });
    }
  }, [currentVenue, venueIndex, transformedVenues.length, targetCity]);
  
  

  // Handle facility selection - memoized to prevent callback reference changes
  const handleFacilitySelect = useCallback((facilityId: string, venueId: string) => {
    // For now, show an alert with facility details
    const venue = cityVenues.find(v => v.id === venueId);
    const facility = venue?.facilities?.find(f => f.id === facilityId);
    
    if (facility) {
      const currentDate = getTodayIST(); // YYYY-MM-DD format in IST
      
      // Log facility selection with comprehensive data including timing info
      logUserAction('facility_selected', {
        facilityId: facility.id,
        facilityName: facility.name,
        facilityPrice: facility.price,
        facilitySports: facility.sports?.map(s => s.name) || [],
        facilityStartTime: facility.start_time,
        facilityEndTime: facility.end_time,
        facilitySlotLength: facility.slot_length,
        facilityHasSplitPayment: facility.has_split_payment,
        venueId: venue.id,
        venueName: venue.name,
        venueAddress: venue.address,
        cityId: targetCity?.id,
        cityName: targetCity?.name,
        selectedDate: currentDate,
        timestamp: getISTTimestamp()
      });

      Alert.alert(
        'Facility Selected',
        `Venue: ${venue.name} (ID: ${venue.id})\nCity: ${targetCity?.name} (ID: ${targetCity?.id})\n\nFacility: ${facility.name} (ID: ${facility.id})\nPrice: ₹${facility.price}\nSports: ${facility.sports?.map(s => s.name).join(', ') || 'N/A'}\nTiming: ${facility.start_time} - ${facility.end_time}\nSlot Duration: ${facility.slot_length} minutes\nSplit Payment: ${facility.has_split_payment ? 'Available' : 'Not Available'}\n\nDate: ${currentDate}\n\nThis will navigate to the booking flow for this facility.`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Book Now', onPress: () => {
            // Log booking intent with timing data
            logUserAction('booking_intent', {
              facilityId: facility.id,
              facilityName: facility.name,
              facilityStartTime: facility.start_time,
              facilityEndTime: facility.end_time,
              facilitySlotLength: facility.slot_length,
              venueId: venue.id,
              venueName: venue.name,
              cityId: targetCity?.id,
              cityName: targetCity?.name,
              selectedDate: currentDate,
              timestamp: getISTTimestamp()
            });
            // TODO: Navigate to booking flow
            Alert.alert('Coming Soon', 'Booking flow will be implemented soon!');
          }}
        ]
      );
    }
  }, [cityVenues, targetCity]);


  // Create navigation helpers using extracted utility
  const { goToNext, goToPrevious } = createNavigationHelpers(transformedVenues.length);
  
  const goToNextVenue = useCallback(() => {
    const oldIndex = venueIndex;
    goToNext(venueIndex, setVenueIndex);
    // Log navigation after state update
    setTimeout(() => {
      const newIndex = (oldIndex + 1) % transformedVenues.length;
      if (transformedVenues[newIndex]) {
        logUserAction('venue_navigation', {
          direction: 'next',
          fromIndex: oldIndex,
          toIndex: newIndex,
          venueId: transformedVenues[newIndex].id,
          venueName: transformedVenues[newIndex].title,
          cityId: targetCity?.id,
          cityName: targetCity?.name
        });
      }
    }, 0);
  }, [venueIndex, transformedVenues, targetCity, goToNext]);

  const goToPreviousVenue = useCallback(() => {
    const oldIndex = venueIndex;
    goToPrevious(venueIndex, setVenueIndex);
    // Log navigation after state update
    setTimeout(() => {
      const newIndex = oldIndex === 0 ? transformedVenues.length - 1 : oldIndex - 1;
      if (transformedVenues[newIndex]) {
        logUserAction('venue_navigation', {
          direction: 'previous',
          fromIndex: oldIndex,
          toIndex: newIndex,
          venueId: transformedVenues[newIndex].id,
          venueName: transformedVenues[newIndex].title,
          cityId: targetCity?.id,
          cityName: targetCity?.name
        });
      }
    }, 0);
  }, [venueIndex, transformedVenues, targetCity, goToPrevious]);



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
