import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants';

// Sports abbreviation mapping
export const getSportIcon = (sportName: string) => {
  const normalizedSport = sportName.toLowerCase().trim();
  
  switch (normalizedSport) {
    case 'badminton':
      return React.createElement(Text, { style: styles.sportIcon }, 'BD');
    case 'box cricket':
    case 'cricket':
      return React.createElement(Text, { style: styles.sportIcon }, 'CR');
    case 'football':
    case 'soccer':
      return React.createElement(Text, { style: styles.sportIcon }, 'FB');
    case 'volleyball':
      return React.createElement(Text, { style: styles.sportIcon }, 'VB');
    case 'pickleball':
      return React.createElement(Text, { style: styles.sportIcon }, 'PB');
    default:
      return React.createElement(Text, { style: styles.sportIcon }, sportName.substring(0, 2).toUpperCase());
  }
};

const styles = StyleSheet.create({
  sportIcon: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.base,
    textAlign: 'center',
  },
});

// Export sport names for reference
export const SPORTS = {
  BADMINTON: 'Badminton',
  BOX_CRICKET: 'Box Cricket', 
  FOOTBALL: 'Football',
  VOLLEYBALL: 'Volleyball',
  PICKLEBALL: 'Pickleball',
} as const;

export type SportType = typeof SPORTS[keyof typeof SPORTS];