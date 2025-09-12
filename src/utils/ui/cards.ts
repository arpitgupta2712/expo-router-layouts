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
