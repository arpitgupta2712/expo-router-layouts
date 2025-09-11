import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";

interface NavigationDotsProps {
  /** Total number of items */
  count: number;
  /** Currently active item index */
  activeIndex: number;
  /** Orientation of the dots */
  orientation?: "horizontal" | "vertical";
  /** Size of the dots */
  size?: "small" | "medium" | "large";
  /** Color of active dots */
  activeColor?: string;
  /** Color of inactive dots */
  inactiveColor?: string;
  /** Custom container style */
  containerStyle?: ViewStyle;
  /** Custom dot style */
  dotStyle?: ViewStyle;
  /** Spacing between dots */
  spacing?: number;
}

export default function NavigationDots({
  count,
  activeIndex,
  orientation = "horizontal",
  size = "medium",
  activeColor = "#007AFF",
  inactiveColor = "#E5E5EA",
  containerStyle,
  dotStyle,
  spacing,
}: NavigationDotsProps) {
  const getDotSize = () => {
    switch (size) {
      case "small":
        return { width: 4, height: 4, borderRadius: 2 };
      case "large":
        return { width: 10, height: 10, borderRadius: 5 };
      default: // medium
        return { width: 6, height: 6, borderRadius: 3 };
    }
  };

  const getSpacing = () => {
    if (spacing !== undefined) return spacing;
    switch (size) {
      case "small":
        return 2;
      case "large":
        return 6;
      default: // medium
        return 3;
    }
  };

  const dotSize = getDotSize();
  const dotSpacing = getSpacing();

  const containerStyles = [
    styles.container,
    orientation === "vertical" && styles.verticalContainer,
    containerStyle,
  ];

  const dotsContainerStyles = [
    styles.dotsContainer,
    orientation === "vertical" && styles.verticalDotsContainer,
  ];

  return (
    <View style={containerStyles}>
      <View style={dotsContainerStyles}>
        {Array.from({ length: count }, (_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              dotSize,
              {
                backgroundColor: index === activeIndex ? activeColor : inactiveColor,
                [orientation === "vertical" ? "marginVertical" : "marginHorizontal"]: dotSpacing,
              },
              dotStyle,
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "transparent",
  },
  verticalContainer: {
    // No additional styles needed for vertical container
  },
  dotsContainer: {
    flexDirection: "row",
  },
  verticalDotsContainer: {
    flexDirection: "column",
  },
  dot: {
    // Base dot styles - size and color will be applied dynamically
  },
});
