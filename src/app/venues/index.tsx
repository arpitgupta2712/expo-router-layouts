import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  PanResponder,
  TouchableOpacity,
  Animated,
  Platform,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Link } from "expo-router";
import Dots from "react-native-dots-pagination";
import { Typography } from "@/constants/Typography";
import { Colors } from "@/constants/Colors";
import { Layout } from "@/constants/Layout";
import { useCities, useVenues } from "@/hooks";
import { Venue } from "@/types/AdminTypes";

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
  const [currentCityIndex, setCurrentCityIndex] = useState(0);
  const [venueIndex, setVenueIndex] = useState(0);
  const [isShowingVenue, setIsShowingVenue] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Simple animation values
  const cardOpacity = useRef(new Animated.Value(1)).current;

  // Fetch data from API
  const { cities, loading: citiesLoading, error: citiesError } = useCities();
  const { venues, loading: venuesLoading, error: venuesError, getVenuesByCity } = useVenues();

  const loading = citiesLoading || venuesLoading;
  const error = citiesError || venuesError;

  // Transform API data to match the expected format
  const transformedCities = cities.map((city, index) => {
    const cityVenues = getVenuesByCity(city.id);
    return {
      id: city.id,
      title: city.name,
      description: `${cityVenues.length} venues available`,
      color: cityColors[index % cityColors.length],
      venues: cityVenues.map((venue, venueIndex) => ({
        id: venue.id,
        title: venue.name || 'Unnamed Venue',
        color: venueColors[venueIndex % venueColors.length],
        address: venue.address || 'Address not available',
        sports: venue.sports || [],
        facilities_count: venue.facilities_count || 0,
      })),
    };
  });

  const currentCity = transformedCities[currentCityIndex];
  const currentVenue = currentCity?.venues[venueIndex];

  const animateCardChange = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    
    Animated.sequence([
      Animated.timing(cardOpacity, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(cardOpacity, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsAnimating(false);
    });
  };

  const goToNextCity = () => {
    if (isAnimating || !transformedCities.length) return;
    animateCardChange();
    setCurrentCityIndex((prev) => (prev + 1) % transformedCities.length);
    setVenueIndex(0);
    setIsShowingVenue(false);
  };

  const goToPreviousCity = () => {
    if (isAnimating || !transformedCities.length) return;
    animateCardChange();
    setCurrentCityIndex((prev) => (prev - 1 + transformedCities.length) % transformedCities.length);
    setVenueIndex(0);
    setIsShowingVenue(false);
  };

  const goToNextVenue = () => {
    if (isAnimating || !currentCity?.venues.length) return;
    animateCardChange();
    setVenueIndex((prev) => (prev + 1) % currentCity.venues.length);
    setIsShowingVenue(true);
  };

  const goToPreviousVenue = () => {
    if (isAnimating || !currentCity?.venues.length) return;
    animateCardChange();
    setVenueIndex((prev) => (prev - 1 + currentCity.venues.length) % currentCity.venues.length);
    setIsShowingVenue(true);
  };

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, gestureState) => {
      return !isAnimating && (Math.abs(gestureState.dx) > 5 || Math.abs(gestureState.dy) > 5);
    },
    onPanResponderRelease: (_, gestureState) => {
      if (isAnimating) return;
      
      const { dx, dy } = gestureState;
      const minSwipeDistance = 50;
      const minSwipeVelocity = 0.3;

      // Check if it's a horizontal swipe (cities)
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > minSwipeDistance) {
        if (dx > 0) {
          // Swipe right - previous city
          goToPreviousCity();
        } else {
          // Swipe left - next city
          goToNextCity();
        }
      }
      // Check if it's a vertical swipe (venues)
      else if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > minSwipeDistance) {
        if (dy > 0) {
          // Swipe down - previous venue
          goToPreviousVenue();
        } else {
          // Swipe up - next venue
          goToNextVenue();
        }
      }
      // Check for velocity-based swipes (faster swipes)
      else if (Math.abs(gestureState.vx) > minSwipeVelocity || Math.abs(gestureState.vy) > minSwipeVelocity) {
        if (Math.abs(gestureState.vx) > Math.abs(gestureState.vy)) {
          // Horizontal velocity swipe
          if (gestureState.vx > 0) {
            goToPreviousCity();
          } else {
            goToNextCity();
          }
        } else {
          // Vertical velocity swipe
          if (gestureState.vy > 0) {
            goToPreviousVenue();
          } else {
            goToNextVenue();
          }
        }
      }
    },
  });

  // Handle scroll wheel events for web
  useEffect(() => {
    if (Platform.OS === 'web') {
      const handleWheel = (event: WheelEvent) => {
        if (isAnimating || !transformedCities.length) return;
        
        event.preventDefault();
        
        const { deltaX, deltaY } = event;
        const threshold = 50; // Minimum scroll distance to trigger navigation
        
        // Horizontal scroll (cities)
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > threshold) {
          if (deltaX > 0) {
            // Scroll right - next city
            goToNextCity();
          } else {
            // Scroll left - previous city
            goToPreviousCity();
          }
        }
        // Vertical scroll (venues)
        else if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > threshold) {
          if (deltaY > 0) {
            // Scroll down - next venue
            goToNextVenue();
          } else {
            // Scroll up - previous venue
            goToPreviousVenue();
          }
        }
      };

      // Add wheel event listener
      document.addEventListener('wheel', handleWheel, { passive: false });

      // Cleanup
      return () => {
        document.removeEventListener('wheel', handleWheel);
      };
    }
  }, [isAnimating, currentCityIndex, venueIndex, isShowingVenue, transformedCities.length]);

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
  if (!transformedCities.length) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No venues available</Text>
          <Text style={styles.emptySubtext}>Check back later for new venues</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerSpacer} />
      </View>

      {/* Floating Back Button */}
      <Link href="/dashboard" asChild>
        <TouchableOpacity style={styles.backButton} activeOpacity={0.8}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
      </Link>

      <View style={styles.cardContainer} {...panResponder.panHandlers}>
        <Animated.View 
          style={[
            styles.fullScreenCard, 
            { 
              backgroundColor: isShowingVenue ? currentVenue.color : currentCity.color,
              opacity: cardOpacity,
            }
          ]}
        >
          {isShowingVenue ? (
            <Text style={styles.venueTitle}>{currentVenue.title}</Text>
          ) : (
            <>
              <Text style={styles.cityTitle}>{currentCity.title}</Text>
              <Text style={styles.cityDescription}>{currentCity.description}</Text>
            </>
          )}
        </Animated.View>
      </View>

      {/* City indicators - bottom center */}
      <View style={styles.cityIndicatorsContainer}>
        <Dots
          length={transformedCities.length}
          active={currentCityIndex}
          activeColor={Colors.accent}
          passiveColor={Colors.gray[300]}
          activeDotWidth={12}
          activeDotHeight={12}
          passiveDotWidth={8}
          passiveDotHeight={8}
          marginHorizontal={8}
        />
      </View>

      {/* Venue indicators - middle right */}
      <View style={styles.venueIndicatorsContainer}>
        {currentCity?.venues.map((_, index) => (
          <View
            key={index}
            style={[
              styles.verticalDot,
              {
                backgroundColor: index === venueIndex ? Colors.accent : Colors.gray[300],
                width: index === venueIndex ? 10 : 6,
                height: index === venueIndex ? 10 : 6,
                borderRadius: index === venueIndex ? 5 : 3,
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 100,
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
    borderRadius: 0,
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
  venueTitle: {
    ...Typography.styles.venuesVenueTitle,
    color: Colors.base,
    textAlign: "center",
  },
  cityIndicatorsContainer: {
    position: "absolute",
    bottom: 50,
    left: 0,
    right: 0,
    alignItems: "center",
    paddingVertical: 20,
    backgroundColor: "transparent",
  },
  venueIndicatorsContainer: {
    position: "absolute",
    right: 20,
    top: "50%",
    transform: [{ translateY: -50 }],
    backgroundColor: "transparent",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  verticalDot: {
    marginVertical: 4,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  backButton: {
    position: "absolute",
    top: 60,
    left: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
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
  backButtonText: {
    ...Typography.styles.venuesBackButton,
    color: Colors.base,
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
