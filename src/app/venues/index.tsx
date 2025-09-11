import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  PanResponder,
  TouchableOpacity,
  Animated,
} from "react-native";
import { Link } from "expo-router";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const cities = [
  {
    id: 1,
    title: "New York",
    description: "The Big Apple",
    color: "#FF6B6B",
    venues: [
      { id: 1, title: "Madison Square Garden", color: "#4ECDC4" },
      { id: 2, title: "Yankee Stadium", color: "#45B7D1" },
      { id: 3, title: "MetLife Stadium", color: "#96CEB4" },
    ],
  },
  {
    id: 2,
    title: "Los Angeles",
    description: "City of Angels",
    color: "#4ECDC4",
    venues: [
      { id: 1, title: "Staples Center", color: "#FFEAA7" },
      { id: 2, title: "Dodger Stadium", color: "#DDA0DD" },
      { id: 3, title: "SoFi Stadium", color: "#98D8C8" },
    ],
  },
  {
    id: 3,
    title: "Chicago",
    description: "Windy City",
    color: "#45B7D1",
    venues: [
      { id: 1, title: "United Center", color: "#F7DC6F" },
      { id: 2, title: "Wrigley Field", color: "#BB8FCE" },
      { id: 3, title: "Soldier Field", color: "#85C1E9" },
    ],
  },
  {
    id: 4,
    title: "Boston",
    description: "Beantown",
    color: "#96CEB4",
    venues: [
      { id: 1, title: "TD Garden", color: "#F8C471" },
      { id: 2, title: "Fenway Park", color: "#FF6B6B" },
      { id: 3, title: "Gillette Stadium", color: "#4ECDC4" },
    ],
  },
  {
    id: 5,
    title: "Miami",
    description: "Magic City",
    color: "#FFEAA7",
    venues: [
      { id: 1, title: "American Airlines Arena", color: "#45B7D1" },
      { id: 2, title: "Marlins Park", color: "#96CEB4" },
      { id: 3, title: "Hard Rock Stadium", color: "#DDA0DD" },
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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerSpacer} />
      </View>

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

      <View style={styles.indicators}>
        <View style={styles.cityIndicators}>
          {cities.map((_, index) => (
            <View
              key={index}
              style={[
                styles.indicator,
                index === currentCityIndex && styles.activeIndicator,
              ]}
            />
          ))}
        </View>
        
        <View style={styles.venueIndicators}>
          {currentCity.venues.map((_, index) => (
            <View
              key={index}
              style={[
                styles.childIndicator,
                index === venueIndex && styles.activeChildIndicator,
              ]}
            />
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
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
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  cityTitle: {
    fontSize: 36,
    fontWeight: "bold",
    color: "white",
    marginBottom: 16,
    textAlign: "center",
  },
  cityDescription: {
    fontSize: 20,
    color: "white",
    textAlign: "center",
    marginBottom: 60,
    opacity: 0.9,
  },
  venueTitle: {
    fontSize: 36,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  indicators: {
    position: "absolute",
    bottom: 50,
    left: 0,
    right: 0,
    alignItems: "center",
    paddingVertical: 20,
    backgroundColor: "transparent",
  },
  cityIndicators: {
    flexDirection: "row",
    marginBottom: 12,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#E5E5EA",
    marginHorizontal: 4,
  },
  activeIndicator: {
    backgroundColor: "#007AFF",
  },
  venueIndicators: {
    flexDirection: "row",
  },
  childIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#E5E5EA",
    marginHorizontal: 3,
  },
  activeChildIndicator: {
    backgroundColor: "#007AFF",
  },
});
