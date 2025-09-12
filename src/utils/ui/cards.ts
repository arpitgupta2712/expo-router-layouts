import { Dimensions, Platform } from 'react-native';
import { Colors } from '@/constants';

// Responsive card sizing for web vs mobile
export const getCardSize = (cardGap = 20, containerPadding = 20) => {
  const { width } = Dimensions.get("window");
  
  if (Platform.OS === 'web') {
    // For web, use a fixed max width and center the grid
    const maxWidth = Math.min(width, 800); // Max 800px width
    return (maxWidth - containerPadding * 2 - cardGap) / 2;
  }
  // For mobile, use full width
  return (width - containerPadding * 2 - cardGap) / 2;
};

// Card style generator for different sizes
export const getCardStyle = (size: string, cardSize: number, cardGap = 20) => {
  const baseStyle = {
    backgroundColor: Colors.base,
  };

  switch (size) {
    case 'small':
      return {
        ...baseStyle,
        width: cardSize,
        height: cardSize,
      };
    case 'rectangle':
      return {
        ...baseStyle,
        width: cardSize * 2 + cardGap,
        height: cardSize,
      };
    case 'big':
      return {
        ...baseStyle,
        width: cardSize * 2 + cardGap,
        height: cardSize * 2 + cardGap,
      };
    default:
      return {
        ...baseStyle,
        width: cardSize,
        height: cardSize,
      };
  }
};

// Layout utility for city cards in bento grid
export const getCityCardLayout = (totalCities: number, currentIndex: number) => {
  const isLastCity = currentIndex === totalCities - 1;
  const isOddTotal = totalCities % 2 !== 0;
  
  // If it's the last city in an odd-numbered list, make it a rectangle
  if (isLastCity && isOddTotal) {
    return {
      size: 'rectangle' as const,
      shouldRender: true,
      isSolo: true
    };
  }
  
  // For pairs, render only on even indices
  if (currentIndex % 2 === 0) {
    return {
      size: 'small' as const,
      shouldRender: true,
      isSolo: false
    };
  }
  
  // Skip odd indices (handled by the even index above)
  return {
    size: 'small' as const,
    shouldRender: false,
    isSolo: false
  };
};
