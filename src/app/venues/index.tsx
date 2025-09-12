import React, { useState, useRef, useEffect } from "react";
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
  Animated,
  PanResponder,
} from "react-native";
import { Link, useLocalSearchParams } from "expo-router";
import { Typography, Colors, Layout, AnimationSequences } from "@/constants";
import { useCitiesAndVenues } from "@/hooks";
import { Venue } from "@/types/AdminTypes";
import { formatRating } from "@/utils";
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
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Basic Animated values (stable and reliable)
  const translateY = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(1)).current;

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
    image_url: venue.image_url,
    rating: venue.rating,
    rating_count: venue.rating_count,
    closest_metro: venue.closest_metro,
    offer_text: venue.offer_text,
    web_url: venue.web_url,
    coordinates: venue.coordinates,
  }));

  const currentVenue = transformedVenues[venueIndex];

  // Animation functions using basic Animated API
  const animateToNext = (direction: 'up' | 'down', callback: () => void) => {
    const targetY = direction === 'up' ? -screenHeight : screenHeight;
    
    Animated.sequence([
      Animated.timing(opacity, {
        toValue: 0.8,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: targetY,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start((finished) => {
      if (finished) {
        callback();
        translateY.setValue(0);
        Animated.timing(opacity, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }).start();
      }
    });
  };

  const resetAnimationState = () => {
    translateY.setValue(0);
    scale.setValue(1);
    opacity.setValue(1);
    setIsAnimating(false);
  };

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
    if (isAnimating || !transformedVenues.length || transformedVenues.length <= 1) return;
    
    setIsAnimating(true);
    const nextVenueIdx = (venueIndex + 1) % transformedVenues.length;
    
    animateToNext('up', () => {
      setVenueIndex(nextVenueIdx);
      setIsAnimating(false);
    });
  };

  const goToPreviousVenue = () => {
    if (isAnimating || !transformedVenues.length || transformedVenues.length <= 1) return;
    
    setIsAnimating(true);
    const prevVenueIdx = (venueIndex - 1 + transformedVenues.length) % transformedVenues.length;
    
    animateToNext('down', () => {
      setVenueIndex(prevVenueIdx);
      setIsAnimating(false);
    });
  };

  // Simplified PanResponder for venue navigation only
  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, gestureState) => {
      // Only respond to vertical gestures for venue navigation
      return !isAnimating && Math.abs(gestureState.dy) > 5;
    },
    onPanResponderGrant: () => {
      if (isAnimating) return;
      Animated.spring(scale, {
        toValue: 0.95,
        useNativeDriver: true,
      }).start();
    },
    onPanResponderMove: (_, gestureState) => {
      if (isAnimating) return;
      
      // Limit gesture distance for better feel
      const maxDistance = screenHeight * 0.3;
      const clampedY = Math.max(-maxDistance, Math.min(maxDistance, gestureState.dy));
      
      translateY.setValue(clampedY);
      
      // Add opacity effect based on distance
      const opacityValue = 1 - (Math.abs(clampedY) / maxDistance) * 0.3;
      opacity.setValue(Math.max(0.7, opacityValue));
    },
    onPanResponderRelease: (_, gestureState) => {
      if (isAnimating) return;
      
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
      
      const { dy, vy } = gestureState;
      const minSwipeDistance = 50;
      const minVelocity = 0.5;
      
      // Check if it's a significant vertical swipe for venues
      const isVerticalSwipe = Math.abs(dy) > minSwipeDistance || Math.abs(vy) > minVelocity;
      
      if (isVerticalSwipe) {
        // Vertical swipe - venues only
        if (dy > 0) {
          goToPreviousVenue();
        } else {
          goToNextVenue();
        }
      } else {
        // Reset if no significant swipe
        Animated.parallel([
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
        ]).start();
      }
    },
    onPanResponderTerminate: () => {
      resetAnimationState();
    },
  });

  // Handle scroll wheel events for web (venues only)
  useEffect(() => {
    if (Platform.OS === 'web') {
      const handleWheel = (event: WheelEvent) => {
        if (isAnimating || !transformedVenues.length) return;
        
        event.preventDefault();
        
        const { deltaY } = event;
        const threshold = 50; // Minimum scroll distance to trigger navigation
        
        // Vertical scroll for venues only
        if (Math.abs(deltaY) > threshold) {
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
  }, [isAnimating, venueIndex, transformedVenues.length]);

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
            <Text style={styles.backButtonText}>←</Text>
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
      </View>

      {/* Floating Back Button */}
      <Link href="/dashboard" asChild>
        <TouchableOpacity style={styles.backButton} activeOpacity={0.8}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
      </Link>

      <View style={styles.cardContainer} {...panResponder.panHandlers}>
        {/* Animated Card */}
        <Animated.View 
          style={[
            styles.fullScreenCard,
            {
              backgroundColor: Colors.base,
              transform: [
                { translateY: translateY },
                { scale: scale }
              ],
              opacity: opacity,
            }
          ]}
        >
          {currentVenue && (
            <VenueCard venue={currentVenue} renderStars={renderStars} />
          )}
        </Animated.View>
      </View>

      {/* City Header */}
      {targetCity && (
        <CityHeader 
          cityName={targetCity.name} 
          venuesCount={transformedVenues.length} 
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
    backgroundColor: Colors.forestGreen,
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
