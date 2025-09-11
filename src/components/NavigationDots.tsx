import React, { useEffect, useRef } from "react";
import { 
  View, 
  StyleSheet, 
  ViewStyle, 
  Animated, 
  TouchableOpacity,
  Dimensions 
} from "react-native";

interface NavigationDotsProps {
  /** Total number of items */
  count: number;
  /** Currently active item index */
  activeIndex: number;
  /** Orientation of the dots */
  orientation?: "horizontal" | "vertical";
  /** Size preset for the dots */
  size?: "small" | "medium" | "large";
  /** Style variant */
  variant?: "default" | "pill" | "scale" | "fade";
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
  /** Enable tap to navigate */
  interactive?: boolean;
  /** Callback when dot is pressed */
  onDotPress?: (index: number) => void;
  /** Enable haptic feedback on press */
  hapticFeedback?: boolean;
  /** Show progress bar style for active dot */
  showProgress?: boolean;
  /** Animation duration in ms */
  animationDuration?: number;
}

export default function NavigationDots({
  count,
  activeIndex,
  orientation = "horizontal",
  size = "medium",
  variant = "default",
  activeColor = "#1B4D3E",
  inactiveColor = "#E5E7EB",
  containerStyle,
  dotStyle,
  spacing,
  interactive = false,
  onDotPress,
  hapticFeedback = true,
  showProgress = false,
  animationDuration = 300,
}: NavigationDotsProps) {
  // Animation values for each dot
  const animations = useRef(
    Array.from({ length: count }, () => ({
      scale: new Animated.Value(1),
      opacity: new Animated.Value(0.4),
      width: new Animated.Value(getDotDimensions().width),
    }))
  ).current;

  // Get dot dimensions based on size
  function getDotDimensions() {
    const dimensions = {
      small: { width: 6, height: 6, borderRadius: 3, activeWidth: 18 },
      medium: { width: 8, height: 8, borderRadius: 4, activeWidth: 24 },
      large: { width: 10, height: 10, borderRadius: 5, activeWidth: 30 },
    };
    return dimensions[size];
  }

  // Get spacing value
  function getSpacing() {
    if (spacing !== undefined) return spacing;
    const spacingMap = { small: 6, medium: 8, large: 10 };
    return spacingMap[size];
  }

  const dotDimensions = getDotDimensions();
  const dotSpacing = getSpacing();

  // Animate dots when activeIndex changes
  useEffect(() => {
    animations.forEach((anim, index) => {
      const isActive = index === activeIndex;
      
      // Scale animation
      Animated.timing(anim.scale, {
        toValue: isActive ? 1.3 : 1,
        duration: animationDuration,
        useNativeDriver: true,
      }).start();

      // Opacity animation
      Animated.timing(anim.opacity, {
        toValue: isActive ? 1 : 0.4,
        duration: animationDuration,
        useNativeDriver: true,
      }).start();

      // Width animation for pill variant
      if (variant === "pill") {
        Animated.timing(anim.width, {
          toValue: isActive ? dotDimensions.activeWidth : dotDimensions.width,
          duration: animationDuration,
          useNativeDriver: false,
        }).start();
      }
    });
  }, [activeIndex, variant, animations, animationDuration, dotDimensions]);

  // Handle dot press
  const handleDotPress = (index: number) => {
    if (interactive && onDotPress) {
      if (hapticFeedback) {
        // You can add haptic feedback here using expo-haptics if available
        // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      onDotPress(index);
    }
  };

  // Render individual dot
  const renderDot = (index: number) => {
    const isActive = index === activeIndex;
    const anim = animations[index];

    // Base dot style
    let animatedStyle: any = {
      opacity: variant === "fade" ? anim.opacity : 1,
    };

    // Apply variant-specific animations
    if (variant === "scale") {
      animatedStyle.transform = [{ scale: anim.scale }];
    } else if (variant === "pill") {
      animatedStyle.width = anim.width;
    }

    const dotContent = (
      <Animated.View
        style={[
          styles.dot,
          {
            width: dotDimensions.width,
            height: dotDimensions.height,
            borderRadius: dotDimensions.borderRadius,
            backgroundColor: isActive ? activeColor : inactiveColor,
          },
          variant === "pill" && isActive && styles.pillActive,
          variant === "scale" && styles.scaleDot,
          animatedStyle,
          dotStyle,
        ]}
      >
        {/* Progress indicator for active dot */}
        {showProgress && isActive && (
          <View style={[styles.progressBar, { backgroundColor: activeColor }]} />
        )}
      </Animated.View>
    );

    // Wrap in TouchableOpacity if interactive
    if (interactive && onDotPress) {
      return (
        <TouchableOpacity
          key={`dot-${index}`}
          activeOpacity={0.7}
          onPress={() => handleDotPress(index)}
          style={[
            styles.dotTouchable,
            {
              [orientation === "vertical" ? "marginVertical" : "marginHorizontal"]: dotSpacing / 2,
            },
          ]}
        >
          {dotContent}
        </TouchableOpacity>
      );
    }

    return (
      <View
        key={`dot-${index}`}
        style={{
          [orientation === "vertical" ? "marginVertical" : "marginHorizontal"]: dotSpacing / 2,
        }}
      >
        {dotContent}
      </View>
    );
  };

  // Container styles
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
        {Array.from({ length: count }, (_, index) => renderDot(index))}
      </View>
      
      {/* Optional sliding indicator */}
      {variant === "default" && showProgress && (
        <Animated.View
          style={[
            styles.slidingIndicator,
            {
              backgroundColor: activeColor,
              [orientation === "vertical" ? "height" : "width"]: dotDimensions.width,
              [orientation === "vertical" ? "width" : "height"]: 2,
              transform: [
                orientation === "vertical"
                  ? { translateY: activeIndex * (dotDimensions.height + dotSpacing * 2) }
                  : { translateX: activeIndex * (dotDimensions.width + dotSpacing * 2) }
              ],
            },
          ]}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "transparent",
    position: "relative",
  },
  verticalContainer: {
    alignItems: "center",
  },
  dotsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  verticalDotsContainer: {
    flexDirection: "column",
    alignItems: "center",
  },
  dot: {
    backgroundColor: "#E5E7EB",
    // Shadow for modern depth
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  dotTouchable: {
    padding: 4, // Increase touch target
  },
  pillActive: {
    // Pill shape when active
  },
  scaleDot: {
    // For scale variant
  },
  progressBar: {
    position: "absolute",
    bottom: -8,
    left: "50%",
    transform: [{ translateX: -1 }],
    width: 2,
    height: 2,
    borderRadius: 1,
  },
  slidingIndicator: {
    position: "absolute",
    bottom: -10,
    left: 0,
    borderRadius: 1,
  },
});

// Example usage with all features:
/*
<NavigationDots
  count={5}
  activeIndex={currentIndex}
  variant="pill"
  size="medium"
  activeColor="#1B4D3E"
  inactiveColor="#E5E7EB"
  interactive={true}
  onDotPress={(index) => scrollToPage(index)}
  showProgress={false}
  animationDuration={300}
/>
*/