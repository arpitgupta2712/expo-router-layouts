import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
  Alert,
  Image,
  Linking,
} from "react-native";
import { Link, useLocalSearchParams } from "expo-router";
import { Typography, Colors, Layout, AnimationSequences } from "@/constants";
import { useCitiesAndVenues } from "@/hooks";
import { Venue } from "@/types/AdminTypes";
import { formatRating } from "@/utils";
import { ArrowLeft } from "lucide-react-native";
import { VenueCard, VenueIndicators, CityHeader } from "./components";

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
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Text key={i} style={styles.star}>★</Text>
      );
    }
    
    if (hasHalfStar) {
      stars.push(
        <Text key="half" style={styles.star}>☆</Text>
      );
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Text key={`empty-${i}`} style={styles.emptyStar}>☆</Text>
      );
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
        <View style={styles.header}>
          <View style={styles.headerSpacer} />
        </View>

        {/* Floating Back Button */}
        <Link href="/dashboard" asChild>
          <TouchableOpacity style={styles.backButton} activeOpacity={0.8}>
            <ArrowLeft size={24} color={Colors.text.inverse} />
          </TouchableOpacity>
        </Link>

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
      <View style={styles.header}>
        <View style={styles.headerSpacer} />
        {/* City Header inside page header */}
        {targetCity && (
          <CityHeader 
            cityName={targetCity.name} 
            venuesCount={transformedVenues.length} 
          />
        )}
      </View>

      {/* Floating Back Button */}
      <Link href="/dashboard" asChild>
        <TouchableOpacity style={styles.backButton} activeOpacity={0.8}>
          <ArrowLeft size={24} color={Colors.text.primary} />
        </TouchableOpacity>
      </Link>

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

      {/* Navigation Buttons */}
      {transformedVenues.length > 1 && (
        <View style={styles.navigationButtons}>
          <TouchableOpacity 
            style={styles.navButton} 
            onPress={goToPreviousVenue}
            activeOpacity={0.7}
          >
            <Text style={styles.navButtonText}>← Previous</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.navButton} 
            onPress={goToNextVenue}
            activeOpacity={0.7}
          >
            <Text style={styles.navButtonText}>Next →</Text>
          </TouchableOpacity>
        </View>
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
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 160,
    backgroundColor: "transparent",
    zIndex: 10,
    paddingTop: 50, // Status bar height
  },
  headerSpacer: {
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
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.primary,
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
  backButton: {
    position: "absolute",
    top: 90,
    left: 30,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.accent,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
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
  // Navigation button styles
  navigationButtons: {
    position: "absolute",
    bottom: 100,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 30,
    zIndex: 20,
  },
  navButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  navButtonText: {
    color: Colors.base,
    fontSize: 16,
    fontWeight: "600",
  },
});
