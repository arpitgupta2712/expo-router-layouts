import React from 'react';
import { Text, Dimensions, Platform } from 'react-native';
import { Colors } from '@/constants';

/**
 * UI Helper utilities for common UI operations
 */

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

// Render star rating in brand colors
export const renderStars = (rating: number): React.ReactNode[] => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  
  // Always render exactly 5 stars
  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      // Full star
      stars.push(
        React.createElement(Text, { 
          key: i, 
          style: { 
            fontSize: 16, 
            color: Colors.accent, 
            marginHorizontal: 1 
          } 
        }, '★')
      );
    } else if (i === fullStars && hasHalfStar) {
      // Half star
      stars.push(
        React.createElement(Text, { 
          key: i, 
          style: { 
            fontSize: 16, 
            color: Colors.accent, 
            marginHorizontal: 1 
          } 
        }, '☆')
      );
    } else {
      // Empty star
      stars.push(
        React.createElement(Text, { 
          key: i, 
          style: { 
            fontSize: 16, 
            color: Colors.accentLight, 
            marginHorizontal: 1 
          } 
        }, '☆')
      );
    }
  }
  
  return stars;
};

// Navigation helper functions
export const createNavigationHelpers = (totalItems: number) => {
  const goToNext = (currentIndex: number, setIndex: (index: number) => void) => {
    if (!totalItems || totalItems <= 1) return;
    const nextIndex = (currentIndex + 1) % totalItems;
    setIndex(nextIndex);
  };

  const goToPrevious = (currentIndex: number, setIndex: (index: number) => void) => {
    if (!totalItems || totalItems <= 1) return;
    const prevIndex = (currentIndex - 1 + totalItems) % totalItems;
    setIndex(prevIndex);
  };

  return { goToNext, goToPrevious };
};

// Format date for display
export const formatDisplayDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric' 
  });
};

// Create array of items for indicators (dots, etc.)
export const createIndicatorArray = (count: number): number[] => {
  return Array.from({ length: count }, (_, index) => index);
};
