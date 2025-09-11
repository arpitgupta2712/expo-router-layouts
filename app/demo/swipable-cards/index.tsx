import React, { useState } from "react";
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, PanResponder } from "react-native";
import { Link } from "expo-router";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const cards = [
  {
    id: 1,
    title: "Card 1",
    description: "Swipe left/right for main cards, up/down for child cards",
    color: "#FF6B6B",
    children: [
      { id: 1, title: "Child 1.1", color: "#FF8E8E" },
      { id: 2, title: "Child 1.2", color: "#FFB3B3" },
    ]
  },
  {
    id: 2,
    title: "Card 2", 
    description: "This is a simple card interface with child navigation",
    color: "#4ECDC4",
    children: [
      { id: 1, title: "Child 2.1", color: "#6ED5D5" },
      { id: 2, title: "Child 2.2", color: "#8EDFDF" },
    ]
  },
  {
    id: 3,
    title: "Card 3",
    description: "Perfect for onboarding or content browsing",
    color: "#45B7D1",
    children: [
      { id: 1, title: "Child 3.1", color: "#65C5E5" },
      { id: 2, title: "Child 3.2", color: "#85D3ED" },
    ]
  },
  {
    id: 4,
    title: "Card 4",
    description: "Easy to customize and extend",
    color: "#96CEB4",
    children: [
      { id: 1, title: "Child 4.1", color: "#A8D8C4" },
      { id: 2, title: "Child 4.2", color: "#BAE2D4" },
    ]
  },
  {
    id: 5,
    title: "Card 5",
    description: "Add your own content and styling",
    color: "#FFEAA7",
    children: [
      { id: 1, title: "Child 5.1", color: "#FFF0C7" },
      { id: 2, title: "Child 5.2", color: "#FFF6E7" },
    ]
  },
];

export default function SwipableCards() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [childIndex, setChildIndex] = useState(0);

  const goToNext = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setChildIndex(0); // Reset child index when changing main cards
    }
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setChildIndex(0); // Reset child index when changing main cards
    }
  };

  const goToNextChild = () => {
    const currentCard = cards[currentIndex];
    if (childIndex < currentCard.children.length - 1) {
      setChildIndex(childIndex + 1);
    }
  };

  const goToPreviousChild = () => {
    if (childIndex > 0) {
      setChildIndex(childIndex - 1);
    }
  };

  // Enhanced swipe detection for both horizontal and vertical
  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (evt, gestureState) => {
      return Math.abs(gestureState.dx) > 20 || Math.abs(gestureState.dy) > 20;
    },
    onPanResponderRelease: (evt, gestureState) => {
      const { dx, dy } = gestureState;
      
      // Horizontal swipes for main cards
      if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > 50) {
          // Swipe right - go to previous main card
          goToPrevious();
        } else if (dx < -50) {
          // Swipe left - go to next main card
          goToNext();
        }
      }
      // Vertical swipes for child cards
      else {
        if (dy > 50) {
          // Swipe down - go to previous child card
          goToPreviousChild();
        } else if (dy < -50) {
          // Swipe up - go to next child card
          goToNextChild();
        }
      }
    },
  });

  const currentCard = cards[currentIndex];
  const currentChild = currentCard.children[childIndex];

  return (
    <View style={styles.container}>

      <View style={styles.cardContainer}>
        <View 
          {...panResponder.panHandlers}
          style={[styles.card, { backgroundColor: currentChild.color }]}
        >
          <Text style={styles.cardTitle}>{currentCard.title}</Text>
          <Text style={styles.childTitle}>{currentChild.title}</Text>
          <Text style={styles.cardDescription}>{currentCard.description}</Text>
        </View>
      </View>

      <View style={styles.indicators}>
        <Text style={styles.indicatorLabel}>Main Cards:</Text>
        {cards.map((_, index) => (
          <View
            key={index}
            style={[
              styles.indicator,
              { opacity: index === currentIndex ? 1 : 0.3 },
            ]}
          />
        ))}
      </View>

      <View style={styles.childIndicators}>
        <Text style={styles.indicatorLabel}>Child Cards:</Text>
        {currentCard.children.map((_, index) => (
          <View
            key={index}
            style={[
              styles.childIndicator,
              { opacity: index === childIndex ? 1 : 0.3 },
            ]}
          />
        ))}
      </View>

      <View style={styles.footer}>
        <Link href="/" style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back to Home</Text>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  header: {
    position: "absolute",
    top: 60,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingHorizontal: 20,
    paddingBottom: 20,
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: "white",
  },
  cardContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: screenWidth,
    height: screenHeight,
    padding: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 48,
    fontWeight: "bold",
    color: "white",
    marginBottom: 20,
    textAlign: "center",
  },
  childTitle: {
    fontSize: 36,
    fontWeight: "600",
    color: "white",
    marginBottom: 20,
    textAlign: "center",
    opacity: 0.9,
  },
  cardDescription: {
    fontSize: 20,
    color: "white",
    textAlign: "center",
    lineHeight: 28,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  navigationHint: {
    fontSize: 16,
    color: "white",
    textAlign: "center",
    opacity: 0.7,
    fontStyle: "italic",
  },
  navigationButtons: {
    position: "absolute",
    bottom: 180,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 40,
  },
  navButton: {
    padding: 15,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "white",
    minWidth: 120,
    alignItems: "center",
  },
  navButtonDisabled: {
    opacity: 0.3,
  },
  navButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  indicators: {
    position: "absolute",
    bottom: 140,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
  },
  childIndicators: {
    position: "absolute",
    bottom: 100,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
  },
  indicatorLabel: {
    color: "white",
    fontSize: 14,
    marginRight: 10,
    opacity: 0.8,
  },
  indicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "white",
    marginHorizontal: 5,
  },
  childIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "white",
    marginHorizontal: 3,
  },
  footer: {
    position: "absolute",
    bottom: 40,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  backButton: {
    padding: 15,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "white",
  },
  backButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
