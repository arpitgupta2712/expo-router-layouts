import React from 'react';
import { Text } from 'react-native';
import { Colors } from '@/constants';

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
