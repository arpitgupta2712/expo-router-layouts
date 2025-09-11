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
} from "react-native";
import { Link } from "expo-router";
import { NavigationDots } from "@/components";
import { Typography } from "@/constants/Typography";
import { Colors } from "@/constants/Colors";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const cities = [
  {
    id: 1,
    title: "New York",
    description: "The Big Apple",
    color: "#003D1E", // Forest Green
    venues: [
      { id: 1, title: "Madison Square Garden", color: "#47C686" }, // Ocean Green
      { id: 2, title: "Yankee Stadium", color: "#2CA166" }, // Illuminating Emerald
      { id: 3, title: "MetLife Stadium", color: "#032516" }, // Dark Green
    ],
  },
  {
    id: 2,
    title: "Los Angeles",
    description: "City of Angels",
    color: "#DCFF00", // Chartreuse
    venues: [
      { id: 1, title: "Staples Center", color: "#EDFD8A" }, // Key Lime
      { id: 2, title: "Dodger Stadium", color: "#F9FFD0" }, // Light Goldenrod Yellow
      { id: 3, title: "SoFi Stadium", color: "#FF9E4A" }, // Royal Orange
    ],
  },
  {
    id: 3,
    title: "Chicago",
    description: "Windy City",
    color: "#47C686", // Ocean Green
    venues: [
      { id: 1, title: "United Center", color: "#FFB777" }, // Very Light Tangelo
      { id: 2, title: "Wrigley Field", color: "#FF7700" }, // Safety Orange
      { id: 3, title: "Soldier Field", color: "#2CA166" }, // Illuminating Emerald
    ],
  },
  {
    id: 4,
    title: "Boston",
    description: "Beantown",
    color: "#2CA166", // Illuminating Emerald
    venues: [
      { id: 1, title: "TD Garden", color: "#FF9E4A" }, // Royal Orange
      { id: 2, title: "Fenway Park", color: "#DCFF00" }, // Chartreuse
      { id: 3, title: "Gillette Stadium", color: "#47C686" }, // Ocean Green
    ],
  },
  {
    id: 5,
    title: "Miami",
    description: "Magic City",
    color: "#FF7700", // Safety Orange
    venues: [
      { id: 1, title: "American Airlines Arena", color: "#003D1E" }, // Forest Green
      { id: 2, title: "Marlins Park", color: "#DCFF00" }, // Chartreuse
      { id: 3, title: "Hard Rock Stadium", color: "#47C686" }, // Ocean Green
    ],
  },
];

export default function VenuesScreen() {
  const [currentCityIndex, setCurrentCityIndex] = useState(0);
  const [venueIndex, setVenueIndex] = useState(0);
  const [isShowingVenue, setIsShowingVenue] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Simple animation values
  const cardOpacity = useRef(new Animated.Value(1)).current;

  const currentCity = cities[currentCityIndex];
  const currentVenue = currentCity.venues[venueIndex];

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
    if (isAnimating) return;
    animateCardChange();
    setCurrentCityIndex((prev) => (prev + 1) % cities.length);
    setVenueIndex(0);
    setIsShowingVenue(false);
  };

  const goToPreviousCity = () => {
    if (isAnimating) return;
    animateCardChange();
    setCurrentCityIndex((prev) => (prev - 1 + cities.length) % cities.length);
    setVenueIndex(0);
    setIsShowingVenue(false);
  };

  const goToNextVenue = () => {
    if (isAnimating) return;
    animateCardChange();
    setVenueIndex((prev) => (prev + 1) % currentCity.venues.length);
    setIsShowingVenue(true);
  };

  const goToPreviousVenue = () => {
    if (isAnimating) return;
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
        if (isAnimating) return;
        
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
  }, [isAnimating, currentCityIndex, venueIndex, isShowingVenue]);

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
        <NavigationDots
          count={cities.length}
          activeIndex={currentCityIndex}
          orientation="horizontal"
          size="large"
          activeColor="#007AFF"
          inactiveColor="#E5E5EA"
        />
      </View>

      {/* Venue indicators - middle right */}
      <View style={styles.venueIndicatorsContainer}>
        <NavigationDots
          count={currentCity.venues.length}
          activeIndex={venueIndex}
          orientation="vertical"
          size="medium"
          activeColor="#007AFF"
          inactiveColor="#E5E5EA"
        />
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
});
